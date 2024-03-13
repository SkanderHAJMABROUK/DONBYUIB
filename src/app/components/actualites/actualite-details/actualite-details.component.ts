import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Options } from 'ngx-slider-v2';
import { Actualite } from 'src/app/interfaces/actualite';
import { ActualiteService } from 'src/app/services/actualite.service';

@Component({
  selector: 'app-actualite-details',
  templateUrl: './actualite-details.component.html',
  styleUrls: ['./actualite-details.component.css']
})
export class ActualiteDetailsComponent {

  constructor(public service:ActualiteService,public route:ActivatedRoute){}


  id!: string;
  data: Actualite |undefined;
  selectedActualite!: Actualite |undefined; 




   ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      console.log(this.id)
       this.getActualiteById(this.id); 
     });
   }
   

   
   getActualiteById(id: string){
    this.service.getActualiteById(id).subscribe({
      next: (data: Actualite | undefined) => {
        if (data !== undefined) {
          this.selectedActualite = data; 
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
  



}
