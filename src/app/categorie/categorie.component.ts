import { Component, EventEmitter, Input, Output} from '@angular/core';
import { AssociationService } from '../shared/associationService.service';
import { Association } from '../association';
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

  selectCategory(cat: string): void {
    this.categorySelected.emit(cat);
  }

}
