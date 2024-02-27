import { Component } from '@angular/core';
import { Association } from '../association';
import { AssociationService } from '../shared/associationService.service';
import { faSuitcaseMedical, faEarthAfrica , faGraduationCap , faBaby , faPaw , faHandshakeAngle} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-association-list',
  templateUrl: './association-list.component.html',
  styleUrls: ['./association-list.component.css']
})
export class AssociationListComponent {
  constructor(public service:AssociationService){}

  faSuitcaseMedical = faSuitcaseMedical; 
  faEarthAfrica=faEarthAfrica;
  faGraduationCap=faGraduationCap; 
  faBaby=faBaby;
  faPaw=faPaw;
  faHandshakeAngle=faHandshakeAngle;

  
  associations:any;
  
  ngOnInit():void{
    this.service.getAssociations().subscribe((res)=>{
     this.associations=res;
   })
   }

   filterByCategory(cat: string): void {
    // Reset associations to show all associations
    this.service.getAssociations().subscribe((res: Association[]) => {
      this.associations = res;
  
      // Filter associations based on the selected category
      this.associations = this.associations.filter((association: Association) => {
        // Assuming each association has a 'category' property
        return association.categorie === cat;
      });
    });
  }
  




}
