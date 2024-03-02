import { Component } from '@angular/core';
import { Association } from '../association';
import { AssociationService } from '../shared/associationService.service';
import { faSuitcaseMedical, faEarthAfrica , faGraduationCap , faBaby , faPaw , faHandshakeAngle , faHandHoldingDollar} from '@fortawesome/free-solid-svg-icons';


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
  faHandHoldingDollar = faHandHoldingDollar;

  associationHoverState: Map<string, boolean> = new Map();
  
  associations:Association[]=[];
  categorySelected: string | null = null;

  
  
  filterByCategory(cat: string): void {
    this.categorySelected = cat;
    console.log(this.categorySelected);
    this.service.getAssociations().subscribe((res: Association[]) => {
      this.associations = res.filter((association: Association) => {
        return association.categorie === cat;
      });
    });
  }

  toggleIconState(associationId: string, state: boolean): void {
    this.associationHoverState.set(associationId, state);
  }
  
  ngOnInit():void{
    this.service.getAssociations().subscribe((res)=>{
     this.associations=res;
     

   })
   }

   toggleShowDetails() {
    this.service.showDetails = true;
    localStorage.setItem('service.showDetails', 'true');
  }



}
