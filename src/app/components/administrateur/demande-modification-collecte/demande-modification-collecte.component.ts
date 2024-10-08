import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssociationService } from 'src/app/services/association.service';
import {
  faEye,
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DemandeModificationCollecte } from 'src/app/interfaces/demande-modification-collecte';
import { CollecteService } from 'src/app/services/collecte.service';

@Component({
  selector: 'app-demande-modification-collecte',
  templateUrl: './demande-modification-collecte.component.html',
  styleUrls: ['./demande-modification-collecte.component.css'],
})
export class DemandeModificationCollecteComponent implements OnInit {
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faEye = faEye;

  associationsNames: string[] = [];
  selectedAssociation: string = '';
  associationsIds: string[] = [];

  demandesModificationsCollectes: DemandeModificationCollecte[] = [];
  filteredDemandeModificationCollecteList: DemandeModificationCollecte[] = [];
  searchTerm: string = '';
  selectedDemandeModificationCollecte: DemandeModificationCollecte =
    {} as DemandeModificationCollecte;
  pageSize: number = 10;
  currentPage: number = 1;
  selectedPageSize: string = '10';
  selectedTri: string = 'none';

  constructor(
    private router: Router,
    public adminService: AdministrateurService,
    private firestore: AngularFirestore,
    private associationService: AssociationService,
    private collecteService: CollecteService,
  ) {}

  ngOnInit(): void {
    this.selectedPageSize = '10';
    this.getDemandes();
    this.adminService.demandeModificationCollecteDetails = false;
  }

  getDemandes(): void {
    this.collecteService
      .getPendingDemandesModificationsCollectes()
      .subscribe((demandesModificationsCollectes) => {
        this.demandesModificationsCollectes = demandesModificationsCollectes;
        this.getAssociationsIds();
        this.chercherDemande();
      });
  }

  chercherDemande(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredDemandeModificationCollecteList =
      this.demandesModificationsCollectes.filter(
        (demandeModificationCollecte, index) =>
          index >= startIndex &&
          index < endIndex &&
          demandeModificationCollecte.nom
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) &&
          (!this.selectedAssociation ||
            this.getAssociationNameById(
              demandeModificationCollecte.id_association,
            ) === this.selectedAssociation),
      );

    // Tri
    switch (this.selectedTri) {
      case 'plusRecents':
        this.filteredDemandeModificationCollecteList =
          this.filteredDemandeModificationCollecteList.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
        break;
      case 'plusAnciens':
        this.filteredDemandeModificationCollecteList =
          this.filteredDemandeModificationCollecteList.sort(
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
      this.demandesModificationsCollectes.length / this.pageSize,
    );
  }

  getAssociationsIds(): void {
    this.associationsIds = Array.from(
      new Set(
        this.demandesModificationsCollectes
          .map(
            (demandeModificationCollecte) =>
              demandeModificationCollecte.id_association,
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

  afficherModifications(demande: DemandeModificationCollecte) {
    if (demande.id) {
      this.collecteService
        .getDemandeModificationCollecteById(demande.id)
        .subscribe((response) => {
          this.selectedDemandeModificationCollecte = response!;
          this.adminService.demandeModificationCollecteDetails = true;
          console.log(response);
        });
    }
  }
}
