import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Association } from '../../../interfaces/association';
import { AssociationService } from '../../../services/association.service';
import { faSquarePhone, faAt} from '@fortawesome/free-solid-svg-icons';
import { Options } from 'ngx-slider-v2';
import { PaymentService } from 'src/app/services/payment.service';
import { DonateurService } from 'src/app/services/donateur.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-association-demande',
  templateUrl: './association-demande.component.html',
  styleUrls: ['./association-demande.component.css']
})
export class AssociationDemandeComponent implements OnInit{

  constructor(public service:AssociationService,
    public route:ActivatedRoute,
    private paymentService: PaymentService,
    public router:Router, 
    private donateurService:DonateurService){}

  value=0;
  options:Options={
    floor: 0,
    ceil: 2000
  }
  donateurId!: string;
  id!: string;
  data: Association |undefined;
  selectedAssociation!: Association |undefined; 
  donationAmount: number = 0;
  donTransmis:boolean = false;
  
  faSquarePhone = faSquarePhone; 
  faAt = faAt;

   ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      console.log(this.id)
       this.getAssociationById(this.id); 
     });

     this.donateurId=this.donateurService.id;
     console.log('donateur',this.donateurId);

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

initiatePayment(): void {
  const returnUrl = `http://localhost:4200/listeAssociations/details/${this.id}`;

  // Step 1: Authorization
  this.paymentService.authorizePayment('100L8651', this.donationAmount, returnUrl)
    .subscribe(response => {
      // Handle authorization response, redirect user to formUrl in the same tab
      window.location.href = response.formUrl;
    }, error => {
      // Handle error
      console.error('Authorization failed:', error);
    });
}

confirmPayment(orderId: string, amount: number): void {
  // Step 2: Confirmation
  this.paymentService.confirmPayment(orderId, amount)
    .subscribe(response => {
      if (this.selectedAssociation && this.selectedAssociation.id) {
        // Add the donation to the 'DonAssociation' collection
        const date = new Date();
        this.paymentService.addDonAssociation(this.selectedAssociation.id, amount, date, this.donateurId)
          .then(() => {
            console.log('Don ajouté avec succès à la collection DonAssociation');
            window.close();

          })
          .catch(error => {
            console.error('Erreur lors de l\'ajout du don à la collection DonAssociation :', error);
            localStorage.setItem('donation','false');
          });
      } else {
        console.error('Erreur: Aucune association sélectionnée.');
      }
      console.log('Payment confirmed:', response);
    }, error => {
      // Handle error
      console.error('Confirmation failed:', error);
    });
}

  showSuccessMessage() {
    if (this.selectedAssociation) {
      const nomAssociation = this.selectedAssociation.nom;
      const imageAssociation = this.selectedAssociation.logo;
  
      Swal.fire({
        title: "Félicitations!",
        text: `Votre don à ${nomAssociation} a été transmis avec succès`,
        imageUrl: imageAssociation,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Oops!"
      });
    }
  }

}