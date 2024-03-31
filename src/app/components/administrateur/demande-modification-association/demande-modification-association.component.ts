import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DemandeModificationAssociation } from 'src/app/interfaces/demande-modification-association';
import { AssociationService } from 'src/app/services/association.service';
import { faList, faCheck, faXmark, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import Swal from 'sweetalert2';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Component({
  selector: 'app-demande-modification-association',
  templateUrl: './demande-modification-association.component.html',
  styleUrls: ['./demande-modification-association.component.css']
})
export class DemandeModificationAssociationComponent {

  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faList = faList;
  faCheck = faCheck;
  faXmark = faXmark;
  
  associationsNames: string[] = [];
  selectedAssociation: string = '';
  associationsIds : string[] = []; 

  demandesModificationsAssociations: DemandeModificationAssociation[] = [];
  filteredDemandeModificationAssociationList: DemandeModificationAssociation[] = [];
  searchTerm: string = '';
  selectedDemandeModificationAssociation: DemandeModificationAssociation = {} as DemandeModificationAssociation;
  pageSize: number = 10;
  currentPage: number = 1;
  selectedPageSize: string = '10'; 
  selectedTri: string = 'none'; // Par défaut, aucun tri sélectionné

  constructor(private router: Router, public adminService:AdministrateurService,
    private firestore: AngularFirestore, private associationService: AssociationService) { }

  ngOnInit(): void {
    this.selectedPageSize = '10';
    this.getDemandes();
  }

  getDemandes(): void {
    this.associationService.getPendingDemandesModificationsAssociations().subscribe(demandesModificationsAssociations => {
      this.demandesModificationsAssociations = demandesModificationsAssociations;
      this.getAssociationsIds();
      this.chercherDemande();
    });
  }

  chercherDemande(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredDemandeModificationAssociationList = this.demandesModificationsAssociations.filter((demandeModificationAssociation, index) =>
      index >= startIndex && index < endIndex &&
      (demandeModificationAssociation.nom.toLowerCase().includes(this.searchTerm.toLowerCase())&&
      (!this.selectedAssociation || this.getAssociationNameById(demandeModificationAssociation.id_association) === this.selectedAssociation) 
    ))

    // Tri
  switch (this.selectedTri) {
    case 'plusRecents':
      this.filteredDemandeModificationAssociationList = this.filteredDemandeModificationAssociationList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    case 'plusAnciens':
      this.filteredDemandeModificationAssociationList = this.filteredDemandeModificationAssociationList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      break;
    default:
      break;
  }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.chercherDemande();
  }

  onPageSizeChange(): void {
    this.pageSize = +this.selectedPageSize; // Convertit la chaîne en nombre
    this.currentPage = 1; // Réinitialise à la première page
    this.chercherDemande(); // Réapplique la pagination avec la nouvelle taille de page
    this.getTotalPages(); // Recalcule le nombre total de pages
  }
  

  getTotalPages(): number {
    return Math.ceil(this.demandesModificationsAssociations.length / this.pageSize);
  }

  updateDemandeEtat(id: string, etat: string): Promise<void> {
    const demandeRef = this.firestore.collection('DemandeModificationAssociation').doc(id);
    return demandeRef.update({ etat: etat });
  }

  getAssociationsIds(): void {
    this.associationsIds = Array.from(new Set(
      this.demandesModificationsAssociations
        .map(demandeModificationAssociation => demandeModificationAssociation.id_association)
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
