import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DemandeActualite } from 'src/app/interfaces/demande-actualite';
import { AssociationService } from 'src/app/services/associationService.service';
import { faList, faCheck, faXmark, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import Swal from 'sweetalert2';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActualiteService } from 'src/app/services/actualite.service';
import { Observable } from 'rxjs';

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

  showConfirmationModal: boolean = false;

  demandesActualites: DemandeActualite[] = [];
  filteredDemandeActualiteList: DemandeActualite[] = [];
  searchTerm: string = '';
  selectedDemandeActualite: DemandeActualite = {} as DemandeActualite;
  pageSize: number = 10;
  currentPage: number = 1;
  selectedPageSize: string = '10'; // Par défaut, la taille de la page est définie sur 10
  imageAffichee: string = ''; // URL de l'image affichée dans la lightbox

  constructor(private actualiteService: ActualiteService, private router: Router, public adminService:AdministrateurService,
    private firestore: AngularFirestore, private associationService: AssociationService) { }

  ngOnInit(): void {
      this.selectedPageSize = '10';
      this.getActualites();
    }

    getActualites(): void {
      this.actualiteService.getPendingDemandesActualites().subscribe(demandesActualites => {
        this.demandesActualites = demandesActualites;
        this.chercherActualite();
      });
    }

    chercherActualite(): void {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.filteredDemandeActualiteList = this.demandesActualites.filter((demandeActualite, index) =>
        index >= startIndex && index < endIndex &&
        (demandeActualite.titre.toLowerCase().includes(this.searchTerm.toLowerCase())
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
          // Mettre à jour l'état de la demande à "refusé"
          if (selectedDemandeActualite.id) {
            this.updateDemandeEtat(selectedDemandeActualite.id, "refusé").then(() => {
              // Supprimer l'association correspondante
              if (selectedDemandeActualite.id_actualite) {
                this.actualiteService.deleteActualiteById(selectedDemandeActualite.id_actualite).then(() => {
                  Swal.fire({
                    title: "Refusé!",
                    text: `La demande de ${selectedDemandeActualite.titre} a été refusée.`,
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

    updateDemandeEtat(id: string, etat: string): Promise<void> {
      const demandeRef = this.firestore.collection('DemandeActualite').doc(id);
      return demandeRef.update({ etat: etat });
    }
  
    updateActualiteEtat(actualiteId: string, etat: string): Promise<void> {
      const demandeRef = this.firestore.collection('Actualite').doc(actualiteId);
      return demandeRef.update({ etat: etat });
    }


}