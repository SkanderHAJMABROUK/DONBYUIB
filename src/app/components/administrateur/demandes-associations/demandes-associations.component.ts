import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DemandeAssociation } from 'src/app/interfaces/demande-association';
import { AssociationService } from 'src/app/services/associationService.service';
import { faList, faCheck, faXmark, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import Swal from 'sweetalert2';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-demandes-associations',
  templateUrl: './demandes-associations.component.html',
  styleUrls: ['./demandes-associations.component.css']
})
export class DemandesAssociationsComponent {

  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faList = faList;
  faCheck = faCheck;
  faXmark = faXmark;

  showConfirmationModal: boolean = false;

  demandesAssociations: DemandeAssociation[] = [];
  filteredDemandeAssociationList: DemandeAssociation[] = [];
  searchTerm: string = '';
  selectedDemandeAssociation: DemandeAssociation = {} as DemandeAssociation;
  pageSize: number = 10;
  currentPage: number = 1;
  selectedPageSize: string = '10'; // Par défaut, la taille de la page est définie sur 10
  categories: string[] = [];
  selectedCategorie: string = '';
  imageAffichee: string = ''; // URL de l'image affichée dans la lightbox

  constructor(private associationService: AssociationService, private router: Router, public adminService:AdministrateurService,
    private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.selectedPageSize = '10';
    this.getAssociations();
  }


  getCategories(){
    this.categories = Array.from(new Set(this.demandesAssociations
      .map(demandeAssociation => demandeAssociation.categorie)
      .filter(categorie => !!categorie)));
  }

  getAssociations(): void {
    this.associationService.getPendingDemandesAssociations().subscribe(demandesAssociations => {
      this.demandesAssociations = demandesAssociations;
      this.getCategories();
      this.chercherAssociation();
    });
  }

  chercherAssociation(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredDemandeAssociationList = this.demandesAssociations.filter((demandeAssociation, index) =>
      index >= startIndex && index < endIndex &&
      (demandeAssociation.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (!this.selectedCategorie || demandeAssociation.categorie === this.selectedCategorie)
    ))
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.chercherAssociation();
  }

  onPageSizeChange(): void {
    this.pageSize = +this.selectedPageSize; // Convertit la chaîne en nombre
    this.currentPage = 1; // Réinitialise à la première page
    this.chercherAssociation(); // Réapplique la pagination avec la nouvelle taille de page
    this.getTotalPages(); // Recalcule le nombre total de pages
  }
  

  getTotalPages(): number {
    return Math.ceil(this.demandesAssociations.length / this.pageSize);
  }

  afficherImage(url: string): void {
    this.imageAffichee = url; // Afficher l'image dans la lightbox
  }

  cacherImage(): void {
    this.imageAffichee = ''; // Cacher l'image en vidant l'URL
  }

  refuserAssociation(selectedDemandeAssociation: DemandeAssociation): void {

    Swal.fire({
      title: `Vous voulez refuser la demande de ${selectedDemandeAssociation.nom} ?`,
      text: "La demande sera refusée définitivement",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, refuser",
    }).then((result) => {
      if (result.isConfirmed) {
        // Mettre à jour l'état de la demande à "refusé"
        if (selectedDemandeAssociation.id) {
          this.updateDemandeEtat(selectedDemandeAssociation.id, "refusé").then(() => {
            // Supprimer l'association correspondante
            if (selectedDemandeAssociation.id_association) {
              this.associationService.deleteAssociationById(selectedDemandeAssociation.id_association).then(() => {
                Swal.fire({
                  title: "Refusé!",
                  text: `La demande de ${selectedDemandeAssociation.nom} a été refusée.`,
                  icon: "success"
                });
              }).catch(error => {
                console.error('Erreur lors de la suppression de l\'association:', error);
                Swal.fire({
                  title: "Erreur",
                  text: "Une erreur s'est produite lors du refus de la demande.",
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
  
  accepterAssociation(selectedDemandeAssociation: DemandeAssociation): void {
    if (!selectedDemandeAssociation || !selectedDemandeAssociation.id_association) {
      console.error('La demande de l\'association ou l\'ID de l\'association est indéfinie.');
      Swal.fire({
        title: "Erreur",
        text: "La demande de l'association ou l'ID de l'association est indéfinie.",
        icon: "error"
      });
      return;
    }
  
    Swal.fire({
      title: `Vous voulez accepter la demande de ${selectedDemandeAssociation.nom} ?`,
      text: "La demande sera acceptée définitivement",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, accepter",
    }).then((result) => {
      if (result.isConfirmed) {
        // Mettre à jour l'état de la demande à "accepté"
        if (selectedDemandeAssociation.id) {
          this.updateDemandeEtat(selectedDemandeAssociation.id, "accepté").then(() => {
            // Mettre à jour l'état de l'association à "actif"
            if (selectedDemandeAssociation.id_association) {
              this.updateAssociationEtat(selectedDemandeAssociation.id_association, "actif").then(() => {
                Swal.fire({
                  title: "Accepté!",
                  text: `La demande de ${selectedDemandeAssociation.nom} a été acceptée.`,
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
    const demandeRef = this.firestore.collection('DemandeAssociation').doc(id);
    return demandeRef.update({ etat: etat });
  }

  updateAssociationEtat(associationId: string, etat: string): Promise<void> {
    const demandeRef = this.firestore.collection('Association').doc(associationId);
    return demandeRef.update({ etat: etat });
  }

}
