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
  selectedAssociation!: Association |undefined; 
  donationAmount: number = 0;
  paymentSuccessful!: string|null;
  orderId: string = ''; 
  orderStatus: number = 0; 
  
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

     this.paymentSuccessful = localStorage.getItem('PaymentStatus')// Retrieve payment status from localStorage
     console.log('oninit'+this.paymentSuccessful)
     this.orderId = localStorage.getItem('orderId') || '';
     console.log('order id',this.orderId);

   }

   
   getAssociationById(id: string){
    this.service.getAssociationById(id).subscribe({
      next: (data: Association | undefined) => {
        if (data !== undefined) {
          this.selectedAssociation = data; 
          localStorage.setItem('service.showDetails', 'true');
          console.log(data);
          console.log(this.service.showDetails);
          // Call getOrderStatus here since selectedAssociation is now populated
          if (this.orderId) {
            this.getOrderStatus(this.orderId);
          }
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

  const returnUrl = `https://localhost:4200/listeAssociations/details/${this.id}`;
  const randomIdentifier = Math.random().toString(36).substring(2, 10);

    this.paymentService.authorizePayment(randomIdentifier, this.donationAmount, returnUrl)
    .subscribe(response => {     
      window.open(response.formUrl, '_blank');
      localStorage.setItem('orderId', response.orderId);
      this.orderId = response.orderId;

      this.confirmPayment(response.orderId, this.donationAmount);

    }, error => {
      console.error('Authorization failed:', error);
    });
}

confirmPayment(orderId: string, amount: number): void {
  // Step 2: Confirmation
  this.paymentService.confirmPayment(orderId, amount)
    .subscribe(response => {
      if (this.selectedAssociation && this.selectedAssociation.id) {
        console.log('Selected Association:', this.selectedAssociation);
        // Pas besoin d'ajouter le don ici
        const date = new Date();
        this.paymentService.addDonAssociation(this.selectedAssociation.id, amount, date, this.donateurId)
          .then(() => {
            console.log('Don ajouté avec succès à la collection DonAssociation');
            this.paymentSuccessful = localStorage.getItem('PaymentStatus')// Retrieve payment status from localStorage
            console.log('confimed '+this.paymentSuccessful)
            console.log('Don ajouté avec succès à la collection');
            window.close();

          })
          .catch(error => {
            console.error('Erreur lors de l\'ajout du don à la collection :', error);
          });      } else {
        console.error('Erreur: Aucune association sélectionnée ou ID non défini.');
      }
      console.log('Payment confirmed:', response);
    }, error => {
      // Handle error
      console.error('Confirmation failed:', error);
    });
}

getOrderStatus(orderId: string): void {
  this.paymentService.getOrderStatus(orderId)
    .subscribe(response => {
      // Extract order status
      console.log(response);
      this.orderStatus = response.OrderStatus as number;
      console.log('order status in function', this.orderStatus);

      if (this.orderStatus == 2) {
        this.showSuccessMessage();
      } 
    }, error => {
      console.error('Error fetching order status:', error);
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
  } else {
    console.log('selectedAssociation is null or undefined');
  };
  localStorage.removeItem('orderId');
}

validateDonationAmount() {
  if (this.donationAmount === 0) {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "Le montant du don ne peut pas être zéro!",
      showConfirmButton: false,
      timer: 1500
    });
    } else {
    this.initiatePayment();
  }
}

}