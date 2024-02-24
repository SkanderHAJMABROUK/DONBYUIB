import { Component } from '@angular/core';
import { AuthentificationService } from '../shared/authentification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-association-demande',
  templateUrl: './association-demande.component.html',
  styleUrls: ['./association-demande.component.css']
})
export class AssociationDemandeComponent {
  constructor(private service:AuthentificationService,public route:ActivatedRoute){}
  associations:any=[];
  associationId: string ="";
  associationData: any;


  // getAssociations(){
  //   this.service.getAssociations().subscribe((res)=>{
  //     this.associations=res;
  //   })
  // }





  ngOnInit():void{
    this.route.params.subscribe((params: { [x: string]: any; }) => {
      this.associationId = params['id'];this.service.getAssociationById(this.associationId)
      .then(doc => {
        if (doc.exists()) {
          this.associationData = doc.data();
        } else {
          console.log('Aucune association trouvée avec cet ID.');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données de l\'association:', error);
      });
  });
}
}