import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Options } from 'ngx-slider-v2';
import { Collecte } from 'src/app/interfaces/collecte';
import { CollecteService } from 'src/app/services/collecte.service';
import { PaymentService } from 'src/app/services/payment.service';
import { DonateurService } from 'src/app/services/donateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-collecte-details',
  templateUrl: './collecte-details.component.html',
  styleUrls: ['./collecte-details.component.css']
})
export class CollecteDetailsComponent {

  constructor(public service:CollecteService,
    public route:ActivatedRoute,
    private paymentService: PaymentService,
    public router:Router, 
    private donateurService:DonateurService){}

  value=0;
  options:Options={
    floor: 0,
    ceil: 2000
  }

  id!: string;
  data: Collecte |undefined;
  selectedCollecte!: Collecte |undefined; 
  donationAmount: number = 0;
  orderId: string = ''; 
  orderStatus: number = 0;
  donateurId!: string;


   ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      console.log(this.id)
       this.getCollecteById(this.id); 
     });

     this.donateurId=this.donateurService.id;
     console.log('donateur',this.donateurId);

     this.orderId = localStorage.getItem('order-Id') || '';
     console.log('order id',this.orderId);
   }
   

   
   getCollecteById(id: string){
    this.service.getCollecteById(id).subscribe({
      next: (data: Collecte | undefined) => {
        if (data !== undefined) {
          this.selectedCollecte = data; 
          localStorage.setItem('service.showDetails', 'true');
          console.log(data);
          console.log(this.service.showDetails);
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
  
  
  getTimeRemaining(endDate: Date): string {
    const now = new Date();
    const endTime = new Date(endDate);
    const timeDiff = endTime.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
    if (daysRemaining <= 0) {
      return 'Terminée';
    } else if (daysRemaining === 1) {
      return '1 jour restant';
    } else {
      return daysRemaining + ' jours restants';
    }
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
  const returnUrl = `http://localhost:4200/listeCollectes/details/${this.id}`;
  const randomIdentifier = Math.random().toString(36).substring(2, 10);

  this.paymentService.authorizePayment(randomIdentifier, this.donationAmount, returnUrl)
    .subscribe(response => {     
      window.location.href = response.formUrl;
      localStorage.setItem('order-Id', response.orderId);
      this.orderId = response.orderId;

      this.confirmPayment(response.orderId, this.donationAmount);

    }, error => {
      console.error('Authorization failed:', error);
    });
}

confirmPayment(orderId: string, amount: number): void {
  this.paymentService.confirmPayment(orderId, amount)
    .subscribe(response => {
      if (this.selectedCollecte && this.selectedCollecte.id) {
        console.log('Selected Collecte:', this.selectedCollecte);
        const date = new Date();
        this.paymentService.addDonCollecte(this.selectedCollecte.id, amount, date, this.donateurId)
          .then(() => {
            console.log('Don ajouté avec succès à la collection');
            window.close();
          })
          .catch(error => {
            console.error('Erreur lors de l\'ajout du don à la collection :', error);
          });
      } else {
        console.error('Erreur: Aucune collecte sélectionnée ou ID non défini.');
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
  if (this.selectedCollecte) {
    const nomCollecte = this.selectedCollecte.nom;
    const imageCollecte = this.selectedCollecte.image;

    Swal.fire({
      title: "Félicitations!",
      text: `Votre don à la collecte '${nomCollecte}' a été transmis avec succès`,
      imageUrl: imageCollecte,
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: "Oops!"
    });
  } else {
    console.log('selectedCollecte is null or undefined');
  };
  localStorage.removeItem('order-Id');
}

validateDonationAmount() {
  console.log('montant don',this.donationAmount)
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
