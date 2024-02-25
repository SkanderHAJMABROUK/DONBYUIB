import { Component } from '@angular/core';
import { AuthentificationService } from '../shared/authentification.service';
import { Association } from '../association';

@Component({
  selector: 'app-association-list',
  templateUrl: './association-list.component.html',
  styleUrls: ['./association-list.component.css']
})
export class AssociationListComponent {
  constructor(private service:AuthentificationService){}
  associations:Association[]=[];
  
  selectedAssociation: Association | null = null; 
  showAssociationDetails(association: Association): void {
    this.selectedAssociation = association;
  }
//  ngOnInit():void{
//     this.service.getAssociations().subscribe((res)=>{
//       this.associations=res;
//     })
//    }


}
