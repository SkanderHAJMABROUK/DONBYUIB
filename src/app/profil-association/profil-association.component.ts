import { Component } from '@angular/core';
import { AssociationService } from '../shared/associationService.service';
import { Association } from '../association';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profil-association',
  templateUrl: './profil-association.component.html',
  styleUrls: ['./profil-association.component.css']
})
export class ProfilAssociationComponent {

constructor(public service:AssociationService ,private route:ActivatedRoute){}


id!: string;
data: Association |undefined;

 ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.id = params['id']; 
    console.log(this.id)
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

selectedAssociation!: Association |undefined; 

modifier:boolean=false;

  

}
