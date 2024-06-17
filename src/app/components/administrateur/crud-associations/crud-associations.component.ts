import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Association } from 'src/app/interfaces/association';
import { AssociationService } from 'src/app/services/association.service';
import {
  faList,
  faTrash,
  faPenToSquare,
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-associations',
  templateUrl: './crud-associations.component.html',
  styleUrls: ['./crud-associations.component.css'],
})
export class CrudAssociationsComponent {
  faList = faList;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;

  associations: Association[] = [];
  filteredAssociationList: Association[] = [];
  searchTerm: string = '';
  selectedAssociation: Association = {} as Association;
  pageSize: number = 10;
  currentPage: number = 1;
  selectedPageSize: string = '10'; // Par défaut, la taille de la page est définie sur 10
  selectedEtat: string = ''; // Par défaut, aucun état sélectionné
  categories: string[] = [];
  selectedCategorie: string = '';
  imageAffichee: string = ''; // URL de l'image affichée dans la lightbox

  constructor(
    private associationService: AssociationService,
    private router: Router,
    public adminService: AdministrateurService,
  ) {}

  ngOnInit(): void {
    this.selectedPageSize = '10';
    this.getAssociations();
  }

  getCategories() {
    this.categories = Array.from(
      new Set(
        this.associations
          .map((association) => association.categorie)
          .filter((categorie) => !!categorie),
      ),
    );
  }

  getAssociations(): void {
    this.associationService
      .getActiveAssociations()
      .subscribe((associations) => {
        this.associations = associations;
        this.getCategories();
        this.chercherAssociation();
      });
  }

  chercherAssociation(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredAssociationList = this.associations.filter(
      (association, index) =>
        index >= startIndex &&
        index < endIndex &&
        association.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (!this.selectedEtat || association.etat === this.selectedEtat) &&
        (!this.selectedCategorie ||
          association.categorie === this.selectedCategorie),
    );
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
    return Math.ceil(this.associations.length / this.pageSize);
  }

  afficherImage(url: string): void {
    this.imageAffichee = url; // Afficher l'image dans la lightbox
  }

  cacherImage(): void {
    this.imageAffichee = ''; // Cacher l'image en vidant l'URL
  }

  afficherDetails(assocation: Association) {
    if (assocation.id) {
      this.associationService
        .getAssociationById(assocation.id)
        .subscribe((response) => {
          this.selectedAssociation = response!;
          this.adminService.associationDetailShowModal = true;
          console.log(response);
        });
    }
  }

  modifierAssociation(association: Association) {
    if (association.id) {
      this.associationService
        .getAssociationById(association.id)
        .subscribe((response) => {
          this.selectedAssociation = response!;
          this.adminService.associationModifierShowModal = true;
        });
    }
  }

  supprimerAssociation(association: Association) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous ne pourrez pas revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le !',
      cancelButtonText: 'Non, annulez !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService
          .deleteAssociationByAdmin(association)
          .then(() => {
            Swal.fire({
              title: 'Supprimé !',
              text: 'Votre fichier a été supprimé.',
              icon: 'success',
            });
          })
          .catch((error) => {
            console.error(
              "Erreur lors de la suppression de l'association :",
              error,
            );
          });
      }
    });
  }
}
