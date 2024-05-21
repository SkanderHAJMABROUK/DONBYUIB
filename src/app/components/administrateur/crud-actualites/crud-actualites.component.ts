import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actualite } from 'src/app/interfaces/actualite';
import { ActualiteService } from 'src/app/services/actualite.service';
import { faList, faTrash, faPenToSquare, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { AssociationService } from 'src/app/services/association.service';
import { Observable, map } from 'rxjs';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import Swal from 'sweetalert2';

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

  constructor(private actualiteService: ActualiteService, private associationService:AssociationService,private router: Router,public adminService:AdministrateurService) { }

  ngOnInit(): void {
    this.selectedPageSize = '10';
    this.getActualites();             
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
    this.actualiteService.getAcceptedActualites().subscribe(actualites => {
      this.actualites = actualites;
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
      (!this.selectedAssociation || this.getAssociationNameById(actualite.id_association) === this.selectedAssociation)
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

  afficherDetails(actualite: Actualite) {
    if(actualite.id){
    this.actualiteService.getActualiteById(actualite.id).subscribe((response) => {
      this.selectedActualite = response!;
      this.adminService.actualiteDetailShowModal = true;
      console.log(response)
    });
  }
}

modifierActualite(actualite:Actualite){
  if(actualite.id){
    this.actualiteService.getActualiteById(actualite.id).subscribe((response) => {
      this.selectedActualite = response!;
      this.adminService.actualiteModifierShowModal = true;
    });
  }
}

supprimerActualite(actualite: Actualite) {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: 'Vous ne pourrez pas revenir en arrière !',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimez-le !',
    cancelButtonText: 'Non, annulez !'

  }).then((result) => {
    if (result.isConfirmed) {
      this.adminService.deleteActualiteByAdmin(actualite)
        .then(() => {
          Swal.fire({
            title: 'Supprimé !',
            text: 'Votre fichier a été supprimé.',
            icon: 'success'
          });
        })
        .catch(error => {
          console.error('Erreur lors de la suppression de l\'actualité :', error);
        });
    }
  });
}

}
