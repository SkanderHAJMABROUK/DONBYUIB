import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DemandeSuppressionCollecte } from 'src/app/interfaces/demande-suppression-collecte';
import { AssociationService } from 'src/app/services/association.service';
import { faList, faCheck, faXmark, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import Swal from 'sweetalert2';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CollecteService } from 'src/app/services/collecte.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { Collecte } from 'src/app/interfaces/collecte';

@Component({
  selector: 'app-demande-suppression-collecte',
  templateUrl: './demande-suppression-collecte.component.html',
  styleUrls: ['./demande-suppression-collecte.component.css']
})
export class DemandeSuppressionCollecteComponent implements OnInit{

  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faList = faList;
  faCheck = faCheck;
  faXmark = faXmark;

  rapportRefus : string = '';

  associationsNames: string[] = [];
  selectedAssociation: string = '';
  associationsIds : string[] = []; 

  collectesNames: string[] = [];
  collectesIds : string[] = [];

  showConfirmationModal: boolean = false;

  demandesSuppressionCollectes: DemandeSuppressionCollecte[] = [];
  filteredDemandeSuppressionCollecteList: DemandeSuppressionCollecte[] = [];
  searchTerm: string = '';
  selectedDemandeSuppressionCollecte: DemandeSuppressionCollecte = {} as DemandeSuppressionCollecte;
  pageSize: number = 10;
  currentPage: number = 1;
  selectedPageSize: string = '10'; 
  imageAffichee: string = ''; 
  selectedTri: string = 'none'; // Par défaut, aucun tri sélectionné
  @Input() selectedCollecte!: Collecte; 
  
 constructor(public collecteService: CollecteService, private router: Router, public adminService:AdministrateurService,
  private firestore: AngularFirestore, private associationService: AssociationService) { }

  ngOnInit(): void {
    this.selectedPageSize = '10';
    this.getDemandesSuppressionCollectes();
  }

  getDemandesSuppressionCollectes(): void {
    this.collecteService.getPendingDemandesSuppressionCollectes().subscribe(demandesSuppressionCollectes => {
      this.demandesSuppressionCollectes = demandesSuppressionCollectes;
      this.getAssociationsIds();
      this.getCollectesIds();
      this.chercherCollecte();
    });
  }

  afficherDetails(collecte: DemandeSuppressionCollecte) {
    if (collecte.id_collecte) {
      this.collecteService.getCollecteById(collecte.id_collecte).subscribe((response) => {
        this.selectedCollecte = response!;
        this.adminService.demandeSuppressionCollecteDetails = true;
        console.log(response);
      });
    } else {
      console.error('ID de collecte associé non défini.');
    }
  }

  chercherCollecte(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.filteredDemandeSuppressionCollecteList = this.demandesSuppressionCollectes.filter((demandeCollecte, index) =>
      index >= startIndex && index < endIndex &&
      (
      (!this.searchTerm || this.getCollecteNameById(demandeCollecte.id_collecte)?.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (!this.selectedAssociation || this.getAssociationNameById(demandeCollecte.id_association) === this.selectedAssociation) 
    ))
      
    switch (this.selectedTri) {
      case 'plusRecents':
        this.filteredDemandeSuppressionCollecteList = this.filteredDemandeSuppressionCollecteList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'plusAnciens':
        this.filteredDemandeSuppressionCollecteList = this.filteredDemandeSuppressionCollecteList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      default:
        break;
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.chercherCollecte();
  }

  onPageSizeChange(): void {
    this.pageSize = +this.selectedPageSize; // Convertit la chaîne en nombre
    this.currentPage = 1; // Réinitialise à la première page
    this.chercherCollecte(); // Réapplique la pagination avec la nouvelle taille de page
    this.getTotalPages(); // Recalcule le nombre total de pages
  }
  

  getTotalPages(): number {
    return Math.ceil(this.demandesSuppressionCollectes.length / this.pageSize);
  }

  afficherImage(url: string): void {
    this.imageAffichee = url; // Afficher l'image dans la lightbox
  }

  cacherImage(): void {
    this.imageAffichee = ''; // Cacher l'image en vidant l'URL
  }

  updateDemandeEtat(id: string, etat: string): Promise<void> {
    const demandeRef = this.firestore.collection('DemandeSuppressionCollecte').doc(id);
    return demandeRef.update({ etat: etat });
  }

  updateCollecteEtat(collecteId: string, etat: string): Promise<void> {
    const demandeRef = this.firestore.collection('Collecte').doc(collecteId);
    return demandeRef.update({ etat: etat });
  }

  getAssociationsIds(): void {
    this.associationsIds = Array.from(new Set(
      this.demandesSuppressionCollectes
        .map(demandeCollecte => demandeCollecte.id_association)
        .filter(id_association => id_association !== undefined && id_association !== null)
    )) as string[];

    this.getAssociationsNamesByIds(this.associationsIds); // Call function to fetch association names 
  }

  getAssociationsNamesByIds(ids: string[]) {
    const observables: Observable<string | undefined>[] = ids.map(id =>
      this.associationService.getAssociationNameById(id).pipe(
        map(name => name ?? undefined) // Convert undefined values to Observable<undefined>
      )
    );
        observables.forEach((observable, index) =>
      observable.subscribe(name => {
        console.log(`Observable ${index + 1} emitted value:`, name); // Log emitted values
        if (name !== undefined) {
          this.associationsNames.push(name);
          console.log('Pushed name:', name); // Log pushed name
          console.log(this.associationsNames);
        }
      })
    )
  } 
  
  getAssociationNameById(id: string | undefined): string {
    if (!id) {
      return 'Unknown Association';
    }
    const index = this.associationsIds.indexOf(id);
    if (index !== -1) {
      return this.associationsNames[index];
    } else {
      return 'Association not found';
    }
  }

  getCollectesIds(): void {
    this.collectesIds = Array.from(new Set(
      this.demandesSuppressionCollectes
        .map(demandeCollecte => demandeCollecte.id_collecte)
        .filter(id_collecte => id_collecte !== undefined && id_collecte !== null)
    )) as string[];

    this.getCollectesNamesByIds(this.collectesIds); // Call function to fetch association names 
  }

  getCollectesNamesByIds(ids: string[]) {
    const observables: Observable<string | undefined>[] = ids.map(id =>
      this.collecteService.getCollecteNameById(id).pipe(
        map(name => name ?? undefined) // Convert undefined values to Observable<undefined>
      )
    );
        observables.forEach((observable, index) =>
      observable.subscribe(name => {
        console.log(`Observable ${index + 1} emitted value:`, name); // Log emitted values
        if (name !== undefined) {
          this.collectesNames.push(name);
          console.log('Pushed name:', name); // Log pushed name
          console.log(this.collectesNames);
        }
      })
    )
  } 
  
  getCollecteNameById(id: string | undefined): string {
    if (!id) {
      return 'Unknown Collecte';
    }
    const index = this.collectesIds.indexOf(id);
    if (index !== -1) {
      return this.collectesNames[index];
    } else {
      return 'Collecte not found';
    }
  }
   

  refuserSuppressionCollecte(selectedDemandeCollecte: DemandeSuppressionCollecte): void {

    Swal.fire({
      title: `Vous voulez refuser la demande de suppression de cette collecte ?`,
      text: "La demande sera refusée définitivement",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, refuser",
      input: 'textarea', 
    inputPlaceholder: 'Raison du refus', 
    inputAttributes: {
      autocapitalize: 'off'
    }
    }).then((result) => {
      if (result.isConfirmed && selectedDemandeCollecte.id) {
        this.rapportRefus += result.value + ` \n`;
        this.envoyerRapport(selectedDemandeCollecte.id);
        if (selectedDemandeCollecte.id) {
          this.updateDemandeEtat(selectedDemandeCollecte.id, "refusé").then(() => {
            console.log(selectedDemandeCollecte.id_collecte);
            if (selectedDemandeCollecte.id_collecte) {
              this.updateCollecteEtat(selectedDemandeCollecte.id_collecte,"accepté").then(() => {
                Swal.fire({
                  title: "Refusé!",
                  text: `La demande de suppression a été refusée.`,
                  icon: "success"
                });
              }).catch(error => {
                console.error('Erreur lors de la suppression de la collecte:', error);
                Swal.fire({
                  title: "Erreur",
                  text: "Une erreur s'est produite lors du refus de la demande.",
                  icon: "error"
                });
              });
            } else {
              console.error('ID de la collecte indéfini.');
              Swal.fire({
                title: "Erreur",
                text: "ID de la collecte indéfini.",
                icon: "error"
              });
            }
          }).catch(error => {
            console.error('Erreur lors de la mise à jour de l\'état de la demande:', error);
            Swal.fire({
              title: "Erreur",
              text: "Une erreur s'est produite lors du refus de la demande.",
              icon: "error"
            });
          });
        } else {
          console.error('ID de la demande indéfini.');
          Swal.fire({
            title: "Erreur",
            text: "ID de la demande indéfini.",
            icon: "error"
          });
        }
      }
    });
  }

  accepterSuppressionCollecte(selectedDemandeCollecte: DemandeSuppressionCollecte): void {
    if (!selectedDemandeCollecte || !selectedDemandeCollecte.id_collecte) {
      console.error('La demande de la collecte ou l\'ID de la collecte est indéfinie.');
      Swal.fire({
        title: "Erreur",
        text: "La demande de l'actualité ou l'ID de la collecte est indéfinie.",
        icon: "error"
      });
      return;
    }
  
    Swal.fire({
      title: `Vous voulez accepter la demande de suppression ?`,
      text: "La demande sera acceptée définitivement",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, accepter",
    }).then((result) => {
      if (result.isConfirmed && selectedDemandeCollecte.id) {

        if (selectedDemandeCollecte.id) {
          this.updateDemandeEtat(selectedDemandeCollecte.id, "accepté").then(() => {
            if (selectedDemandeCollecte.id_collecte) {
              this.updateCollecteEtat(selectedDemandeCollecte.id_collecte, "supprimé").then(() => {
                Swal.fire({
                  title: "Accepté!",
                  text: `La demande de suppression a été acceptée.`,
                  icon: "success"
                });
              }).catch(error => {
                console.error('Erreur lors de la mise à jour de l\'état de la collecte:', error);
                Swal.fire({
                  title: "Erreur",
                  text: "Une erreur s'est produite lors de l'acceptation de la demande.",
                  icon: "error"
                });
              });
            } else {
              console.error('ID de la collecte indéfini.');
              Swal.fire({
                title: "Erreur",
                text: "ID de la collecte indéfini.",
                icon: "error"
              });
            }
          }).catch(error => {
            console.error('Erreur lors de la mise à jour de l\'état de la demande:', error);
            Swal.fire({
              title: "Erreur",
              text: "Une erreur s'est produite lors de l'acceptation de la demande.",
              icon: "error"
            });
          });
        } else {
          console.error('ID de la demande indéfini.');
          Swal.fire({
            title: "Erreur",
            text: "ID de la demande indéfini.",
            icon: "error"
          });
        }
      }
    });
  }

  envoyerRapport(id:string): void {
    const demandeRef = this.firestore.collection('DemandeSuppressionCollecte').doc(id);
    demandeRef.update({ rapport: this.rapportRefus })
      .then(() => {
        console.log('Rapport envoyé avec succès.');
      })
      .catch(error => {
        console.error('Erreur lors de l\'envoi du rapport :', error);
      });      
}

}
