import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Association } from '../association';
import { AssociationService } from '../shared/associationService.service';

@Component({
  selector: 'app-association-demande',
  templateUrl: './association-demande.component.html',
  styleUrls: ['./association-demande.component.css']
})
export class AssociationDemandeComponent {
  constructor(public service:AssociationService,public route:ActivatedRoute){}


  id!: string;
  data: Association |undefined;

   ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      console.log(this.id)
       this.getAssociationById(this.id); 
     });
   }
   getAssociationById(id: string){
    this.service.getAssociationById(id).subscribe(
      (data) => {
        this.selectedAssociation = data; 
        console.log(data);
      },
      error => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

 selectedAssociation!: Association |undefined; 
 
}