import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActualiteService } from 'src/app/services/actualite.service';
import {
  faEye,
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DemandeModificationActualite } from 'src/app/interfaces/demande-modification-actualite';
import { AssociationService } from 'src/app/services/association.service';

@Component({
  selector: 'app-demande-modification-actualite',
  templateUrl: './demande-modification-actualite.component.html',
  styleUrls: ['./demande-modification-actualite.component.css'],
})
export class DemandeModificationActualiteComponent {
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faEye = faEye;

  associationsNames: string[] = [];
  selectedAssociation: string = '';
  associationsIds: string[] = [];

  demandesModificationsActualites: DemandeModificationActualite[] = [];
  filteredDemandeModificationActualiteList: DemandeModificationActualite[] = [];
  searchTerm: string = '';
  selectedDemandeModificationActualite: DemandeModificationActualite =
    {} as DemandeModificationActualite;
  pageSize: number = 10;
  currentPage: number = 1;
  selectedPageSize: string = '10';
  selectedTri: string = 'none';

  constructor(
    private router: Router,
    public adminService: AdministrateurService,
    private firestore: AngularFirestore,
    private associationService: AssociationService,
    private actualiteService: ActualiteService,
  ) {}

  ngOnInit(): void {
    this.selectedPageSize = '10';
    this.getDemandes();
    this.adminService.demandeModificationActualiteDetails = false;
  }

  getDemandes(): void {
    this.actualiteService
      .getPendingDemandesModificationsActualites()
      .subscribe((demandesModificationsActualites) => {
        this.demandesModificationsActualites = demandesModificationsActualites;
        this.getAssociationsIds();
        this.chercherDemande();
      });
  }

  chercherDemande(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredDemandeModificationActualiteList =
      this.demandesModificationsActualites.filter(
        (demandeModificationActualite, index) =>
          index >= startIndex &&
          index < endIndex &&
          demandeModificationActualite.titre
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) &&
          (!this.selectedAssociation ||
            this.getAssociationNameById(
              demandeModificationActualite.id_association,
            ) === this.selectedAssociation),
      );

    // Tri
    switch (this.selectedTri) {
      case 'plusRecents':
        this.filteredDemandeModificationActualiteList =
          this.filteredDemandeModificationActualiteList.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
        break;
      case 'plusAnciens':
        this.filteredDemandeModificationActualiteList =
          this.filteredDemandeModificationActualiteList.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );
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
    return Math.ceil(
      this.demandesModificationsActualites.length / this.pageSize,
    );
  }

  getAssociationsIds(): void {
    this.associationsIds = Array.from(
      new Set(
        this.demandesModificationsActualites
          .map(
            (demandeModificationActualite) =>
              demandeModificationActualite.id_association,
          )
          .filter(
            (id_association) =>
              id_association !== undefined && id_association !== null,
          ),
      ),
    ) as string[];

    this.getAssociationsNamesByIds(this.associationsIds); // Call function to fetch association names
  }

  getAssociationsNamesByIds(ids: string[]) {
    const observables: Observable<string | undefined>[] = ids.map((id) =>
      this.associationService.getAssociationNameById(id).pipe(
        map((name) => name ?? undefined), // Convert undefined values to Observable<undefined>
      ),
    );
    observables.forEach((observable, index) =>
      observable.subscribe((name) => {
        console.log(`Observable ${index + 1} emitted value:`, name); // Log emitted values
        if (name !== undefined) {
          this.associationsNames.push(name);
          console.log('Pushed name:', name); // Log pushed name
          console.log(this.associationsNames);
        }
      }),
    );
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

  afficherModifications(demande: DemandeModificationActualite) {
    if (demande.id) {
      this.actualiteService
        .getDemandeModificationActualiteById(demande.id)
        .subscribe((response) => {
          this.selectedDemandeModificationActualite = response!;
          this.adminService.demandeModificationActualiteDetails = true;
          console.log(response);
          console.log(this.adminService.demandeModificationActualiteDetails);
        });
    }
  }
}
