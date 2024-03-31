import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Collecte } from 'src/app/interfaces/collecte';
import { CollecteService } from 'src/app/services/collecte.service';
import { faList, faTrash, faPenToSquare, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { AssociationService } from 'src/app/services/association.service';
import { Observable, map } from 'rxjs';
import { AdministrateurService } from 'src/app/services/administrateur.service';


@Component({
  selector: 'app-crud-collectes',
  templateUrl: './crud-collectes.component.html',
  styleUrls: ['./crud-collectes.component.css']
})
export class CrudCollectesComponent implements OnInit{

  faList = faList;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;

  selectedEtat: string = ''; 
  etats: string[] = []; // Liste des états possibles
  collectes: Collecte[] = [];
  associationsNames: string[] = [];
  filteredCollecteList: Collecte[] = [];
  searchTerm: string = '';
  selectedCollecte: Collecte = {} as Collecte;
  pageSize: number = 10;
  currentPage: number = 1;
  selectedPageSize: string = '10'; // Par défaut, la taille de la page est définie sur 10
  selectedAssociation: string = ''; 
  associationsIds : string[] = []; // Liste des états possibles
  imageAffichee: string = ''; // URL de l'image affichée dans la lightbox

  selectedTri: string = 'none'; // Par défaut, aucun tri sélectionné


  constructor(private collecteService: CollecteService, private associationService:AssociationService,private router: Router,public adminService:AdministrateurService) { }

  ngOnInit(): void {
    this.selectedPageSize = '10';
    this.getCollectes();             
  }

  getEtats(): void {
    // Exclure les valeurs nulles et vides
    this.etats = Array.from(new Set(this.collectes
      .map(collecte => collecte.etat)
      .filter(etat => !!etat))); // Filtre les valeurs nulles ou vides
    }

  getAssociationsIds(): void {
    this.associationsIds = Array.from(new Set(
      this.collectes
        .map(collecte => collecte.id_association)
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
  
  
  getCollectes():void {
    this.collecteService.getCollectes().subscribe(collectes => {
      this.collectes = collectes;
      this.getEtats(); // Initialise la liste des états
      this.getAssociationsIds(); // Initialise la liste des états
      this.chercherCollecte();
    });
  }

  chercherCollecte(): void {

    // Pagination
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.filteredCollecteList = this.filteredCollecteList.slice(startIndex, endIndex);

    this.filteredCollecteList = this.collectes.filter((collecte, index) =>
      index >= startIndex && index < endIndex &&
      (collecte.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (!this.selectedAssociation || this.getAssociationNameById(collecte.id_association) === this.selectedAssociation) &&
      (!this.selectedEtat || collecte.etat === this.selectedEtat)
    ))

    // Tri
  switch (this.selectedTri) {
    case 'montantAsc':
      this.filteredCollecteList = this.filteredCollecteList.sort((a, b) => a.montant - b.montant);
      break;
    case 'montantDesc':
      this.filteredCollecteList = this.filteredCollecteList.sort((a, b) => b.montant - a.montant);
      break;
    case 'plusRecents':
      this.filteredCollecteList = this.filteredCollecteList.sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());
      break;
    case 'plusAnciens':
      this.filteredCollecteList = this.filteredCollecteList.sort((a, b) => new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime());
      break;
    case 'plusLonguesDurees':
      this.filteredCollecteList = this.filteredCollecteList.sort((a, b) => new Date(b.date_fin).getTime() - new Date(b.date_debut).getTime() - (new Date(a.date_fin).getTime() - new Date(a.date_debut).getTime()));
      break;
    case 'plusCourtesDurees':
      this.filteredCollecteList = this.filteredCollecteList.sort((a, b) => new Date(a.date_fin).getTime() - new Date(a.date_debut).getTime() - (new Date(b.date_fin).getTime() - new Date(b.date_debut).getTime()));
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
    return Math.ceil(this.collectes.length / this.pageSize);
  }

  afficherImage(url: string): void {
    this.imageAffichee = url; // Afficher l'image dans la lightbox
  }

  cacherImage(): void {
    this.imageAffichee = ''; // Cacher l'image en vidant l'URL
  }

  afficherDetails(collecte: Collecte) {
    if(collecte.id){
    this.collecteService.getCollecteById(collecte.id).subscribe((response) => {
      this.selectedCollecte = response!;
      this.adminService.collecteDetailShowModal = true;
      console.log(response)
    });
  }
}

modifierCollecte(collecte:Collecte){
  if(collecte.id){
    this.collecteService.getCollecteById(collecte.id).subscribe((response) => {
      this.selectedCollecte = response!;
      this.adminService.collecteModifierShowModal = true;
    });
  }
}

}
