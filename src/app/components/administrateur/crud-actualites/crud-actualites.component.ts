import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actualite } from 'src/app/interfaces/actualite';
import { ActualiteService } from 'src/app/services/actualite.service';
import { faList, faTrash, faPenToSquare, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { AssociationService } from 'src/app/services/associationService.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-crud-actualites',
  templateUrl: './crud-actualites.component.html',
  styleUrls: ['./crud-actualites.component.css']
})
export class CrudActualitesComponent implements OnInit{

  faList = faList;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;

  selectedEtat: string = ''; // Par défaut, aucun état sélectionné
  etats: string[] = []; // Liste des états possibles
  actualites: Actualite[] = [];
  associationsNames: string[] = [];
  filteredActualiteList: Actualite[] = [];
  searchTerm: string = '';
  selectedActualite: Actualite = {} as Actualite;
  pageSize: number = 10;
  currentPage: number = 1;
  selectedPageSize: string = '10'; // Par défaut, la taille de la page est définie sur 10
  selectedAssociation: string = ''; // Par défaut, aucun état sélectionné
  associationsIds : string[] = []; // Liste des états possibles
  imageAffichee: string = ''; // URL de l'image affichée dans la lightbox

  selectedTri: string = 'none'; // Par défaut, aucun tri sélectionné

  constructor(private actualiteService: ActualiteService, private associationService:AssociationService,private router: Router) { }

  ngOnInit(): void {
    this.selectedPageSize = '10';
    this.getActualites();             
  }

  getEtats(): void {
    // Exclure les valeurs nulles et vides
    this.etats = Array.from(new Set(this.actualites
      .map(actualite => actualite.etat)
      .filter(etat => !!etat))); // Filtre les valeurs nulles ou vides
  }

  getAssociationsIds(): void {
    this.associationsIds = Array.from(new Set(
      this.actualites
        .map(actualite => actualite.id_association)
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
  
    // Subscribe to each observable and handle the emitted names accordingly
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

  getActualites():void {
    this.actualiteService.getActualites().subscribe(actualites => {
      this.actualites = actualites;
      this.getEtats(); // Initialise la liste des états
      this.getAssociationsIds(); // Initialise la liste des états
      this.chercherActualite();
    });
  }

  chercherActualite(): void {

    // Pagination
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.filteredActualiteList = this.filteredActualiteList.slice(startIndex, endIndex);

    this.filteredActualiteList = this.actualites.filter((actualite, index) =>
      index >= startIndex && index < endIndex &&
      (actualite.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (!this.selectedAssociation || this.getAssociationNameById(actualite.id_association) === this.selectedAssociation) &&
      (!this.selectedEtat || actualite.etat === this.selectedEtat)
    ))

    // Tri
    switch (this.selectedTri) {
      case 'plusRecents':
        this.filteredActualiteList = this.filteredActualiteList.sort((a, b) => new Date(b.date_publication).getTime() - new Date(a.date_publication).getTime());
        break;
      case 'plusAnciens':
        this.filteredActualiteList = this.filteredActualiteList.sort((a, b) => new Date(a.date_publication).getTime() - new Date(b.date_publication).getTime());
        break;
      default:
        break;
    }
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
    return Math.ceil(this.actualites.length / this.pageSize);
  }

  afficherImage(url: string): void {
    this.imageAffichee = url; // Afficher l'image dans la lightbox
  }

  cacherImage(): void {
    this.imageAffichee = ''; // Cacher l'image en vidant l'URL
  }



}
