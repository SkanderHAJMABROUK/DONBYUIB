import { Component } from '@angular/core';
import { AssociationService } from '../shared/associationService.service';
import { Association } from '../association';

@Component({
  selector: 'app-profil-association',
  templateUrl: './profil-association.component.html',
  styleUrls: ['./profil-association.component.css']
})
export class ProfilAssociationComponent {

constructor(public service:AssociationService){}

associations:Association[]=[];


  ngOnInit():void{
    
   }

}
