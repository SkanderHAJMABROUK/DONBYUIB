import { Component } from '@angular/core';
import { CollecteService } from '../../../services/collecte.service';
import { Collecte } from '../../../interfaces/collecte';
import { faBaby, faEarthAfrica, faGraduationCap, faHandHoldingDollar, faHandshakeAngle, faPaw, faSuitcaseMedical } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-collecte-list',
  templateUrl: './collecte-list.component.html',
  styleUrls: ['./collecte-list.component.css']
})
export class CollecteListComponent {

constructor(public service:CollecteService){}


faSuitcaseMedical = faSuitcaseMedical; 
faEarthAfrica=faEarthAfrica;
faGraduationCap=faGraduationCap; 
faBaby=faBaby;
faPaw=faPaw;
faHandshakeAngle=faHandshakeAngle;
faHandHoldingDollar = faHandHoldingDollar;

collecteHoverState: Map<string, boolean> = new Map();


collectes:Collecte[]=[];

ngOnInit():void{

 this.getAcceptedCollecte();
 }

 getAcceptedCollecte() {
  this.service.getAcceptedCollectes().subscribe((res: Collecte[]) => {
    this.collectes = res;
    this.collectes.forEach(collecte => {
      this.checkIfCollecteIsCompleted(collecte);
    });
  });
}

checkIfCollecteIsCompleted(collecte: Collecte): void {
  const now = new Date();
  const endDate = new Date(collecte.date_fin);
  if (endDate < now || collecte.cumul >= collecte.montant) {
    collecte.etat = 'Terminée';
    // Mettre à jour la collecte dans la base de données
    this.service.updateCollecte(collecte)
      .then(() => {
        console.log('État de la collecte mis à jour avec succès');
      })
      .catch(err => {
        console.error('Erreur lors de la mise à jour de l\'état de la collecte', err);
      });
  }
}

 toggleIconState(collecteId: string, state: boolean): void {
  this.collecteHoverState.set(collecteId, state);
}

 toggleShowDetails() {
  this.service.showDetails = true;
  localStorage.setItem('service.showDetails', 'true');
}

getProgressPercentage(collecte: any): number {
  if (collecte && collecte.montant && collecte.cumul !== undefined) {
    const montant = collecte.montant;
    const cumul = collecte.cumul;
    if (montant > 0) {
      return Math.floor((cumul / montant) * 100);
    } else {
      return 0;
    }
  } else {
    return 0;
  }
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


}


