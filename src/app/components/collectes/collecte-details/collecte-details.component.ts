import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Options } from 'ngx-slider-v2';
import { Collecte } from 'src/app/interfaces/collecte';
import { CollecteService } from 'src/app/services/collecte.service';

@Component({
  selector: 'app-collecte-details',
  templateUrl: './collecte-details.component.html',
  styleUrls: ['./collecte-details.component.css']
})
export class CollecteDetailsComponent {
  constructor(public service:CollecteService,public route:ActivatedRoute){}

  value=0;
  options:Options={
    floor: 0,
    ceil: 2000
  }
  id!: string;
  data: Collecte |undefined;
  selectedCollecte!: Collecte |undefined; 
  donationAmount: number = 0;



   ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      console.log(this.id)
       this.getCollecteById(this.id); 
     });
   }
   

   
   getCollecteById(id: string){
    this.service.getCollecteById(id).subscribe({
      next: (data: Collecte | undefined) => {
        if (data !== undefined) {
          this.selectedCollecte = data; 
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
  


  getProgressWidth(collecte: any): string {
    const progressPercentage = (collecte.montant / collecte.objectif) * 100;
    return progressPercentage + '%';
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

donate() {
  // Vous pouvez ajouter ici le code pour envoyer le montant à votre backend, par exemple
  console.log(`Vous faites un don de ${this.donationAmount} DT`);
}

}
