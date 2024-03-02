import { Component } from '@angular/core';
import { CollecteService } from '../shared/collecte.service';
import { Collecte } from '../collecte';

@Component({
  selector: 'app-collecte-list',
  templateUrl: './collecte-list.component.html',
  styleUrls: ['./collecte-list.component.css']
})
export class CollecteListComponent {

constructor(public service:CollecteService){}

collectes:Collecte[]=[];

ngOnInit():void{
  this.service.getCollectes().subscribe((res)=>{
   this.collectes=res;
   console.log(this.collectes);
 })
 }

}


