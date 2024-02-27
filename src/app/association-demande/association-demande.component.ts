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
  // associations:any=[];
  // associationId: string ="";
  // associationData: any;

  id!: string;
  data: any;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      console.log(this.id)
       this.getAssociationById(this.id); 
    });
  }
  getAssociationById(id: string) {
   this.service.getAssociationById(id).subscribe(data => {
    this.data = data; 
   });
   }

  // selectedAssociation !: Association ; 
 


  // showAssociationDetails(associationId: string): void {
  //   this.service.getAssociationById(associationId).subscribe(
  //     (association) => {
  //       if (association) {
  //         this.selectedAssociation = association as Association; // Assertion de type
  //         console.log(this.selectedAssociation);
  //       } else {
  //         console.log("Association introuvable");
  //       }
  //     },
  //     (error) => {
  //       console.error("Une erreur s'est produite lors de la récupération des détails de l'association:", error);
  //     }
  //   );
  // }
 
  // showAssociationDetails(association: Association): void {
  //   this.selectedAssociation = association;
    
  //   if (association.id !== undefined) { 
  //     this.service.getAssociationById(association.id).subscribe(
  //       (associationDetails) => {
  //         if (associationDetails) {

  //           console.log(associationDetails);
  //         } else {
  //           console.log("Association introuvable");
  //         }
  //       },
  //       (error) => {
  //         console.error("Une erreur s'est produite lors de la récupération des détails de l'association:", error);
  //       }
  //     );
  //   } else {
  //     console.error("L'association sélectionnée ne contient pas d'ID.");
  //   }
  // }




}