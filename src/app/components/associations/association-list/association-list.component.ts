import { Component } from '@angular/core';
import { Association } from '../../../interfaces/association';
import { AssociationService } from '../../../services/association.service';
import {
  faSuitcaseMedical,
  faEarthAfrica,
  faGraduationCap,
  faBaby,
  faPaw,
  faHandshakeAngle,
  faHandHoldingDollar,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-association-list',
  templateUrl: './association-list.component.html',
  styleUrls: ['./association-list.component.css'],
})
export class AssociationListComponent {
  constructor(public service: AssociationService) {}

  faSuitcaseMedical = faSuitcaseMedical;
  faEarthAfrica = faEarthAfrica;
  faGraduationCap = faGraduationCap;
  faBaby = faBaby;
  faPaw = faPaw;
  faHandshakeAngle = faHandshakeAngle;
  faHandHoldingDollar = faHandHoldingDollar;

  associationHoverState: Map<string, boolean> = new Map();

  associations: Association[] = [];
  categorySelected: string | null = null;
  searchTerm: string | null = null;

  applyFilters(): void {
    this.service.getActiveAssociations().subscribe((res: Association[]) => {
      let filtered = res;

      if (this.categorySelected) {
        filtered = filtered.filter((association: Association) => {
          return association.categorie === this.categorySelected;
        });
      }

      if (this.searchTerm) {
        filtered = filtered.filter((association: Association) => {
          return association.nom
            .toLowerCase()
            .includes(this.searchTerm?.toLowerCase() || '');
        });
      }

      this.associations = filtered;
    });
  }

  filterByCategory(cat: string): void {
    this.categorySelected = cat;
    this.applyFilters();
  }

  filterBySearchTerm(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  toggleIconState(associationId: string, state: boolean): void {
    this.associationHoverState.set(associationId, state);
  }

  ngOnInit(): void {
    this.service.getActiveAssociations().subscribe((res) => {
      this.associations = res;
    });
  }

  toggleShowDetails() {
    this.service.showDetails = true;
    localStorage.setItem('service.showDetails', 'true');
  }
}
