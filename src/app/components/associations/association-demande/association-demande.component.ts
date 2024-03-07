import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Association } from '../../../interfaces/association';
import { AssociationService } from '../../../services/associationService.service';
import { faSquarePhone, faAt} from '@fortawesome/free-solid-svg-icons';
import { Options } from 'ngx-slider-v2';


@Component({
  selector: 'app-association-demande',
  templateUrl: './association-demande.component.html',
  styleUrls: ['./association-demande.component.css']
})
export class AssociationDemandeComponent implements OnInit{
  constructor(public service:AssociationService,public route:ActivatedRoute){}

  value=0;
  options:Options={
    floor: 0,
    ceil: 2000
  }
  id!: string;
  data: Association |undefined;
  selectedAssociation!: Association |undefined; 
  donationAmount: number = 0;

  
  faSquarePhone = faSquarePhone; 
  faAt = faAt;

   ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      console.log(this.id)
       this.getAssociationById(this.id); 
     });
   }
   

   
   getAssociationById(id: string){
    this.service.getAssociationById(id).subscribe({
      next: (data: Association | undefined) => {
        if (data !== undefined) {
          this.selectedAssociation = data; 
          localStorage.setItem('service.showDetails', 'true');
          console.log(data);
          console.log(this.service.showDetails)
        } else {
          console.error('Erreur: Aucune donnée n\'a été renvoyée.');
        }
      },
      error: error => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    });
  }
  




// Method to update donation amount from button click
updateDonationAmountFromButton(amount: number) {
  this.donationAmount = amount;
}

// Method to update donation amount from slider
updateDonationAmountFromSlider(event: any) {
  this.donationAmount = event.value;
}

donate() {
  // Vous pouvez ajouter ici le code pour envoyer le montant à votre backend, par exemple
  console.log(`Vous faites un don de ${this.donationAmount} DT`);
}



}