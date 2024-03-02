import { Component } from '@angular/core';
import { AssociationService } from '../shared/associationService.service';
import { Association } from '../association';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profil-association',
  templateUrl: './profil-association.component.html',
  styleUrls: ['./profil-association.component.css']
})
export class ProfilAssociationComponent {

constructor(public service:AssociationService ,private route:ActivatedRoute, private router:Router){}


id!: string;
data: Association |undefined;

selectedAssociation!: Association |undefined; 

modifier:boolean=false;

 ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.id = params['id']; 
    this.service.id=this.id;
    console.log(this.id);
     this.getAssociationById(this.id); 
   });

  
 }
 getAssociationById(id: string){
  this.service.getAssociationById(id).subscribe(
    (data) => {
      this.selectedAssociation = data; 
      console.log(data);
    },
    error => {
      console.error('Erreur lors de la récupération des données :', error);
    }
  );
}

logOut(){
 this.service.logOut();
 
}



  

}
