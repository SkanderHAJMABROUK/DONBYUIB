import { Component } from '@angular/core';
import { ActualiteService } from '../../../services/actualite.service';
import { Actualite } from '../../../interfaces/actualite';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Association } from 'src/app/interfaces/association';
import { AssociationService } from 'src/app/services/association.service';


@Component({
  selector: 'app-actualite-list',
  templateUrl: './actualite-list.component.html',
  styleUrls: ['./actualite-list.component.css']
})
export class ActualiteListComponent {


  constructor(public actualiteService:ActualiteService,
    public associationService:AssociationService
  ){}

  customOptions: OwlOptions = {
    autoplay: true,
    autoplayTimeout:4000,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    center: true,
    navText: ['Précédent','Suivant'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }


  actualites:Actualite[]=[];
  associations:Association[]=[];
  
  ngOnInit():void{
    this.actualiteService.getAcceptedActualites().subscribe((res)=>{
     this.actualites=res;
     console.log(this.actualites);
   })
   this.associationService.getActiveAssociations().subscribe((res)=>{
    this.associations=res;
    console.log(this.associations);
  })
   }
    
   toggleShowDetails() {
    this.actualiteService.showDetails = true;
    localStorage.setItem('service.showDetails', 'true');
  }
  
  
  }
  
  
  
