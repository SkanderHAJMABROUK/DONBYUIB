import { Component, Input } from '@angular/core';
import { AuthentificationService } from '../shared/authentification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Association } from '../association';

@Component({
  selector: 'app-association-demande',
  templateUrl: './association-demande.component.html',
  styleUrls: ['./association-demande.component.css']
})
export class AssociationDemandeComponent {
  constructor(private service:AuthentificationService,public route:ActivatedRoute){}
  associations:any=[];
  associationId: string ="";
  associationData: any;




  selectedAssociation !: Association ; 
  showDetails=false;




  showAssociationDetails(association: Association): void {
    this.selectedAssociation = association;
    if (association.id !== undefined) { 
      this.service.getAssociationById(association.id).subscribe(
        (associationDetails) => {
          if (associationDetails) {
            this.showDetails=true;

            console.log(associationDetails);
          } else {
            console.log("Association introuvable");
          }
        },
        (error) => {
          console.error("Une erreur s'est produite lors de la récupération des détails de l'association:", error);
        }
      );
    } else {
      console.error("L'association sélectionnée ne contient pas d'ID.");
    }
  }

}