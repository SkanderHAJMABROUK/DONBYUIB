import { Component } from '@angular/core';
import { AuthentificationService } from '../shared/associationService.service';
import { Association } from '../association';


@Component({
  selector: 'app-association-list',
  templateUrl: './association-list.component.html',
  styleUrls: ['./association-list.component.css']
})
export class AssociationListComponent {
  constructor(public service:AuthentificationService){}
  associations:any;


  
  
  ngOnInit():void{
    this.service.getAssociations().subscribe((res)=>{
     this.associations=res;
   })
   }




}
