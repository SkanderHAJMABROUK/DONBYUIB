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

  selectCategory(cat: string): void {
    console.log('Fct select appelé')
    this.categorySelected.emit(cat);
    if(!cat){console.log('no cat')} else{
    console.log(cat);
  }}

}
