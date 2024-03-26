import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DemandeActualite } from 'src/app/interfaces/demande-actualite';
import { AssociationService } from 'src/app/services/associationService.service';
import { faList, faCheck, faXmark, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import Swal from 'sweetalert2';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActualiteService } from 'src/app/services/actualite.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Component({
  selector: 'app-demandes-actualites',
  templateUrl: './demandes-actualites.component.html',
  styleUrls: ['./demandes-actualites.component.css']
})
export class DemandesActualitesComponent implements OnInit{

  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faList = faList;
  faCheck = faCheck;
  faXmark = faXmark;

  associationsNames: string[] = [];
  selectedAssociation: string = '';
  associationsIds : string[] = []; 

  showConfirmationModal: boolean = false;

  demandesActualites: DemandeActualite[] = [];
  filteredDemandeActualiteList: DemandeActualite[] = [];
  searchTerm: string = '';
  selectedDemandeActualite: DemandeActualite = {} as DemandeActualite;
  pageSize: number = 10;
  currentPage: number = 1;
  selectedPageSize: string = '10'; 
  imageAffichee: string = ''; 

  constructor(private actualiteService: ActualiteService, private router: Router, public adminService:AdministrateurService,
    private firestore: AngularFirestore, private associationService: AssociationService) { }

  ngOnInit(): void {
      this.selectedPageSize = '10';
      this.getActualites();
    }


    getActualites(): void {
      this.actualiteService.getPendingDemandesActualites().subscribe(demandesActualites => {
        this.demandesActualites = demandesActualites;
        this.getAssociationsIds();
        this.chercherActualite();
      });
    }

    chercherActualite(): void {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.filteredDemandeActualiteList = this.demandesActualites.filter((demandeActualite, index) =>
        index >= startIndex && index < endIndex &&
        (demandeActualite.titre.toLowerCase().includes(this.searchTerm.toLowerCase())&&
        (!this.selectedAssociation || this.getAssociationNameById(demandeActualite.id_association) === this.selectedAssociation) 
      ))
    }

    onPageChange(page: number): void {
      this.currentPage = page;
      this.chercherActualite();
    }
  
    onPageSizeChange(): void {
      this.pageSize = +this.selectedPageSize; // Convertit la chaîne en nombre
      this.currentPage = 1; // Réinitialise à la première page
      this.chercherActualite(); // Réapplique la pagination avec la nouvelle taille de page
      this.getTotalPages(); // Recalcule le nombre total de pages
    }
    
  
    getTotalPages(): number {
      return Math.ceil(this.demandesActualites.length / this.pageSize);
    }
  
    afficherImage(url: string): void {
      this.imageAffichee = url; // Afficher l'image dans la lightbox
    }
  
    cacherImage(): void {
      this.imageAffichee = ''; // Cacher l'image en vidant l'URL
    }

    refuserActualite(selectedDemandeActualite: DemandeActualite): void {

      Swal.fire({
        title: `Vous voulez refuser la demande d'ajout de la publication : ${selectedDemandeActualite.titre} ?`,
        text: "La demande sera refusée définitivement",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, refuser",
      }).then((result) => {
        if (result.isConfirmed) {
          if (selectedDemandeActualite.id) {
            this.updateDemandeEtat(selectedDemandeActualite.id, "refusé").then(() => {
              console.log(selectedDemandeActualite.id_actualite);
              if (selectedDemandeActualite.id_actualite) {
                this.actualiteService.deleteActualiteById(selectedDemandeActualite.id_actualite).then(() => {
                  Swal.fire({
                    title: "Refusé!",
                    text: `La demande de ${selectedDemandeActualite.titre} a été refusée.`,
                    icon: "success"
                  });
                }).catch(error => {
                  console.error('Erreur lors de la suppression de l\'actualité:', error);
                  Swal.fire({
                    title: "Erreur",
                    text: "Une erreur s'est produite lors du refus de la demande.",
                    icon: "error"
                  });
                });
              } else {
                console.error('ID de l\'actualité indéfini.');
                Swal.fire({
                  title: "Erreur",
                  text: "ID de l'actualité indéfini.",
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

    accepterActualite(selectedDemandeActualite: DemandeActualite): void {
      if (!selectedDemandeActualite || !selectedDemandeActualite.id_actualite) {
        console.error('La demande de l\'actualité ou l\'ID de l\'actualité est indéfinie.');
        Swal.fire({
          title: "Erreur",
          text: "La demande de l'actualité ou l'ID de l'actualité est indéfinie.",
          icon: "error"
        });
        return;
      }
    
      Swal.fire({
        title: `Vous voulez accepter la demande de ${selectedDemandeActualite.titre} ?`,
        text: "La demande sera acceptée définitivement",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, accepter",
      }).then((result) => {
        if (result.isConfirmed) {
          // Mettre à jour l'état de la demande à "accepté"
          if (selectedDemandeActualite.id) {
            this.updateDemandeEtat(selectedDemandeActualite.id, "accepté").then(() => {
              // Mettre à jour l'état de l'association à "accepté"
              if (selectedDemandeActualite.id_actualite) {
                this.updateActualiteEtat(selectedDemandeActualite.id_actualite, "accepté").then(() => {
                  Swal.fire({
                    title: "Accepté!",
                    text: `La demande de ${selectedDemandeActualite.titre} a été acceptée.`,
                    icon: "success"
                  });
                }).catch(error => {
                  console.error('Erreur lors de la mise à jour de l\'état de l\'association:', error);
                  Swal.fire({
                    title: "Erreur",
                    text: "Une erreur s'est produite lors de l'acceptation de la demande.",
                    icon: "error"
                  });
                });
              } else {
                console.error('ID de l\'association indéfini.');
                Swal.fire({
                  title: "Erreur",
                  text: "ID de l'association indéfini.",
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
    

    updateDemandeEtat(id: string, etat: string): Promise<void> {
      const demandeRef = this.firestore.collection('DemandeActualite').doc(id);
      return demandeRef.update({ etat: etat });
    }
  
    updateActualiteEtat(actualiteId: string, etat: string): Promise<void> {
      const demandeRef = this.firestore.collection('Actualite').doc(actualiteId);
      return demandeRef.update({ etat: etat });
    }

    getAssociationsIds(): void {
      this.associationsIds = Array.from(new Set(
        this.demandesActualites
          .map(demandeActualite => demandeActualite.id_association)
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

}
