import { Component } from '@angular/core';
import { CollecteService } from '../shared/collecte.service';
import { Collecte } from '../collecte';
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
  this.service.getCollectes().subscribe((res)=>{
   this.collectes=res;
   console.log(this.collectes);
 })
 }



 toggleIconState(collecteId: string, state: boolean): void {
  this.collecteHoverState.set(collecteId, state);
}





 toggleShowDetails() {
  this.service.showDetails = true;
  localStorage.setItem('service.showDetails', 'true');
}


}


