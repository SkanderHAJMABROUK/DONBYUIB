import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Association } from '../association';
import { AssociationService } from '../shared/associationService.service';
import { faPhoneFlip, faEnvelope} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-association-demande',
  templateUrl: './association-demande.component.html',
  styleUrls: ['./association-demande.component.css']
})
export class AssociationDemandeComponent implements OnInit{
  constructor(public service:AssociationService,public route:ActivatedRoute){}


  id!: string;
  data: Association |undefined;

  faPhoneFlip = faPhoneFlip; 
  faEnvelope = faEnvelope;

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

 donationAmount: number = 0;


 @ViewChild('donationRange') donationRange!: ElementRef<HTMLInputElement>;

 updateDonationAmountFromRange(value:string) {
  this.donationAmount = parseInt(value) || 0;
 
}


updateDonationAmountFromButton(amount: number) {
  this.donationAmount = amount;
}

donate() {
  // Vous pouvez ajouter ici le code pour envoyer le montant à votre backend, par exemple
  console.log(`Vous faites un don de ${this.donationAmount} DT`);
}



}