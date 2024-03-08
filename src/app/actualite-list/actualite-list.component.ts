import { Component } from '@angular/core';
import { ActualiteService } from '../shared/actualite.service';
import { Actualite } from '../actualite';

@Component({
  selector: 'app-actualite-list',
  templateUrl: './actualite-list.component.html',
  styleUrls: ['./actualite-list.component.css']
})
export class ActualiteListComponent {


  constructor(public service:ActualiteService){}


  
  actualites:Actualite[]=[];
  
  ngOnInit():void{
    this.service.getActualites().subscribe((res)=>{
     this.actualites=res;
     console.log(this.actualites);
   })
   }
  

  
  
   toggleShowDetails() {
    this.service.showDetails = true;
    localStorage.setItem('service.showDetails', 'true');
  }
  
  
  }
  
  
  
