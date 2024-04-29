import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Admin } from 'src/app/interfaces/admin';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { Chart, registerables} from 'node_modules/chart.js'
Chart.register(...registerables)

@Component({
  selector: 'app-compte-admin',
  templateUrl: './compte-admin.component.html',
  styleUrls: ['./compte-admin.component.css']
})
export class CompteAdminComponent implements OnInit{


  constructor(public service:AdministrateurService ,private route:ActivatedRoute, private router:Router){}


  id!: string;
  data: Admin |undefined;
  
  
  selectedAdmin!: Admin |undefined; 
  
  
  
   ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      this.service.id=this.id;
      console.log(this.id);
       this.getAdminById(this.id); 
     });
  
   
   }
   getAdminById(id: string){
    this.service.getAdminById(id).subscribe(
      (data) => {
        this.selectedAdmin = data; 
        console.log(data);
      },
      error => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }
  
  
  
  
    
}

