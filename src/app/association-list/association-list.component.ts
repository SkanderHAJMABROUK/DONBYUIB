import { Component } from '@angular/core';
import { AuthentificationService } from '../shared/authentification.service';

@Component({
  selector: 'app-association-list',
  templateUrl: './association-list.component.html',
  styleUrls: ['./association-list.component.css']
})
export class AssociationListComponent {
constructor(private service:AuthentificationService){}

associations:any=[];

refreshAssociations(){
  this.service.get().subscribe((res)=>{
    this.associations=res;
  })
}
ngOnInit(){
  this.refreshAssociations()
}
}
