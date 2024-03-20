import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Association } from 'src/app/interfaces/association';
import { AssociationService } from 'src/app/services/associationService.service';
import { faList, faTrash, faPenToSquare, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-crud-associations',
  templateUrl: './crud-associations.component.html',
  styleUrls: ['./crud-associations.component.css']
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
  etats: string[] = []; // Liste des états possibles
  categories: string[] = [];
  selectedCategorie: string = '';
  imageAffichee: string = ''; // URL de l'image affichée dans la lightbox

  constructor(private associationService: AssociationService, private router: Router) { }

  ngOnInit(): void {
    this.selectedPageSize = '10';
    this.getAssociations();
  }

  getEtats(): void {
    // Exclure les valeurs nulles et vides
    this.etats = Array.from(new Set(this.associations
      .map(association => association.etat)
      .filter(etat => !!etat))); // Filtre les valeurs nulles ou vides
  
    console.log('Etats', this.etats); // Récupère les états uniques parmi les donateurs
  }

  getCategories(){
    this.categories = Array.from(new Set(this.associations
      .map(association => association.categorie)
      .filter(categorie => !!categorie)));
  }

  getAssociations(): void {
    this.associationService.getAssociations().subscribe(associations => {
      this.associations = associations;
      this.getEtats(); // Initialise la liste des états
      this.getCategories();
      this.chercherAssociation();
    });
  }

  chercherAssociation(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredAssociationList = this.associations.filter((association, index) =>
      index >= startIndex && index < endIndex &&
      (association.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (!this.selectedEtat || association.etat === this.selectedEtat) &&
      (!this.selectedCategorie || association.categorie === this.selectedCategorie)
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
    return Math.ceil(this.associations.length / this.pageSize);
  }

  afficherImage(url: string): void {
    this.imageAffichee = url; // Afficher l'image dans la lightbox
  }

  cacherImage(): void {
    this.imageAffichee = ''; // Cacher l'image en vidant l'URL
  }


}