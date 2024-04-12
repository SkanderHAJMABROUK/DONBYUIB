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
  this.service.getAcceptedCollectes().subscribe((res)=>{
   this.collectes=res;
 })
 }



 toggleIconState(collecteId: string, state: boolean): void {
  this.collecteHoverState.set(collecteId, state);
}

 toggleShowDetails() {
  this.service.showDetails = true;
  localStorage.setItem('service.showDetails', 'true');
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


}


