import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Donateur } from 'src/app/interfaces/donateur';
import { DonateurService } from 'src/app/services/donateur.service';

@Component({
  selector: 'app-profil-donateur',
  templateUrl: './profil-donateur.component.html',
  styleUrls: ['./profil-donateur.component.css']
})
export class ProfilDonateurComponent {


  constructor(public service:DonateurService ,private route:ActivatedRoute, private router:Router){}


  id!: string;
  data: Donateur |undefined;
  
  
  selectedDonateur!: Donateur |undefined; 
  
  
   ngOnInit(): void {
    this.service.compteDonateur=true;
        this.service.modifierMdp=false;
        this.service.modifiercompte=false;
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      this.service.id=this.id;
      console.log(this.id);
       this.getDonateurById(this.id); 
     });
     
  
   
   }
   getDonateurById(id: string){
    this.service.getDonateurById(id).subscribe(
      (data) => {
        this.selectedDonateur = data; 
        console.log(data);
      },
      error => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }
  
  
  
  
    
}

