import { Component } from '@angular/core';
import { Association } from '../association';
import { AssociationService } from '../shared/associationService.service';

@Component({
  selector: 'app-association-list',
  templateUrl: './association-list.component.html',
  styleUrls: ['./association-list.component.css']
})
export class AssociationListComponent {
  constructor(public service:AssociationService){}

  
  associations:any;
  
  ngOnInit():void{
    this.service.getAssociations().subscribe((res)=>{
     this.associations=res;
   })
   }




}
