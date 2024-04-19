import { Component, EventEmitter, Input, Output} from '@angular/core';
import { AssociationService } from '../../services/association.service';
import { Association } from '../../interfaces/association';
import { faBaby, faEarthAfrica, faGraduationCap, faHandshakeAngle, faPaw, faSuitcaseMedical } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css']
})
export class CategorieComponent {
  constructor(private service:AssociationService){}

  faSuitcaseMedical = faSuitcaseMedical; 
  faEarthAfrica=faEarthAfrica;
  faGraduationCap=faGraduationCap; 
  faBaby=faBaby;
  faPaw=faPaw;
  faHandshakeAngle=faHandshakeAngle;

  @Output() categorySelected = new EventEmitter<string>();

  selectedCategory: string | null = null;
  selectedIconIndex: number | null = null;

  selectCategory(cat: string, index: number): void {
    console.log('Function selectCategory called')
    if (this.selectedCategory === cat) {
      this.unselectCategory();
    } else {
      this.selectedCategory = cat;
      this.selectedIconIndex = index;
      this.categorySelected.emit(cat);
    }
  }

  unselectCategory(): void {
    console.log('Function unselectCategory called')
    this.categorySelected.emit(undefined);
    this.selectedCategory = null;
    this.selectedIconIndex = null;
  }
}
