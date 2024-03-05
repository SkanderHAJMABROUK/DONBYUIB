import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Association } from 'src/app/association';
import { Collecte } from 'src/app/collecte';
import { AssociationService } from 'src/app/shared/associationService.service';
import { CollecteService } from 'src/app/shared/collecte.service';
import { DonateurService } from 'src/app/shared/donateur.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit{


  constructor(public serviceAssociation:AssociationService,public serviceCollecte:CollecteService,public route:ActivatedRoute){}

  id!: string;
  data: Association |undefined;
  selectedAssociation!: Association |undefined; 


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      console.log(this.id)
       this.getAssociationById(this.id); 
     });
   }
   
   getAssociationById(id: string){
    this.serviceAssociation.getAssociationById(id).subscribe({
      next: (data: Association | undefined) => {
        if (data !== undefined) {
          this.selectedAssociation = data; 
          localStorage.setItem('service.showDetails', 'true');
          console.log(data);
          console.log(this.serviceAssociation.showDetails)
        } else {
          console.error('Erreur: Aucune donnée n\'a été renvoyée.');
        }
      },
      error: error => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    });
  }
  
  logOut(){
    this.serviceAssociation.logOut();
    
   }



   collectes:Collecte[]=[];
   
getCollectesByAssociationId(){
  const associationId=this.serviceCollecte.getAssociationIdFromUrl();
  this.serviceCollecte.getCollectesByAssociationId(associationId).subscribe((res)=>{
    this.collectes=res;
    console.log(this.collectes)
  })
}


}
