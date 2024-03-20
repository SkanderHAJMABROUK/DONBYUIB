import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Donateur } from 'src/app/interfaces/donateur';
import { DonateurService } from 'src/app/services/donateur.service';
import { faList, faTrash, faPenToSquare, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { AdministrateurService } from 'src/app/services/administrateur.service';

@Component({
  selector: 'app-crud-utilisateurs',
  templateUrl: './crud-utilisateurs.component.html',
  styleUrls: ['./crud-utilisateurs.component.css']
})
export class CrudUtilisateursComponent implements OnInit {

  faList = faList;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;

  donateurs: Donateur[] = [];
  filteredDonateurList: Donateur[] = [];
  searchTerm: string = '';
  selectedDonateur: Donateur = {} as Donateur;
  pageSize: number = 10;
  currentPage: number = 1;
  selectedPageSize: string = '10'; // Par défaut, la taille de la page est définie sur 10
  selectedEtat: string = ''; // Par défaut, aucun état sélectionné
  etats: string[] = []; // Liste des états possibles
  imageAffichee: string = ''; // URL de l'image affichée dans la lightbox

  constructor(private serviceDonateur: DonateurService, private router: Router,public serviceAdmin:AdministrateurService) { }

  ngOnInit(): void {
    this.selectedPageSize = '10';
    this.getDonateurs();
  }

  getEtats(): void {
    // Exclure les valeurs nulles et vides
    this.etats = Array.from(new Set(this.donateurs
      .map(donateur => donateur.etat)
      .filter(etat => !!etat))); // Filtre les valeurs nulles ou vides
  
    console.log('Etats', this.etats); // Récupère les états uniques parmi les donateurs
  }
  

  getDonateurs(): void {
    this.serviceDonateur.getDonateurs().subscribe(donateurs => {
      this.donateurs = donateurs;
      this.getEtats(); // Initialise la liste des états
      this.chercherDonateur();
    });
  }

  chercherDonateur(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredDonateurList = this.donateurs.filter((donateur, index) =>
      index >= startIndex && index < endIndex &&
      (donateur.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      donateur.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (!this.selectedEtat || donateur.etat === this.selectedEtat)
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.chercherDonateur();
  }

  onPageSizeChange(): void {
    this.pageSize = +this.selectedPageSize; // Convertit la chaîne en nombre
    this.currentPage = 1; // Réinitialise à la première page
    this.chercherDonateur(); // Réapplique la pagination avec la nouvelle taille de page
    this.getTotalPages(); // Recalcule le nombre total de pages
  }
  

  getTotalPages(): number {
    return Math.ceil(this.donateurs.length / this.pageSize);
  }

  afficherImage(url: string): void {
    this.imageAffichee = url; // Afficher l'image dans la lightbox
  }

  cacherImage(): void {
    this.imageAffichee = ''; // Cacher l'image en vidant l'URL
  }
 

}
