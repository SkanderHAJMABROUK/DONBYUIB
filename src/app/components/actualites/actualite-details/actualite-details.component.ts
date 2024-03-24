import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Options } from 'ngx-slider-v2';
import { Actualite } from 'src/app/interfaces/actualite';
import { Commentaire } from 'src/app/interfaces/commentaire';
import { ActualiteService } from 'src/app/services/actualite.service';
import { DonateurService } from 'src/app/services/donateur.service';

@Component({
  selector: 'app-actualite-details',
  templateUrl: './actualite-details.component.html',
  styleUrls: ['./actualite-details.component.css']
})
export class ActualiteDetailsComponent {
  commentaireForm!: FormGroup; 
  commentaireAjout:boolean=false;
  constructor(public service:ActualiteService,public donateurService:DonateurService,public route:ActivatedRoute,private formBuilder: FormBuilder){}


  id!: string;
  data: Actualite |undefined;
  selectedActualite!: Actualite |undefined; 
  commentaires: Commentaire[] = [];
  showAllComments: boolean = false;





   ngOnInit(): void {
    this.commentaireForm = this.formBuilder.group({
      contenu: ['', Validators.required] 
    });

    this.route.params.subscribe(params => {
      this.id = params['id']; 
      console.log(this.id)
       this.getActualiteById(this.id); 
     });

     this.getComments();
   }
   
   getComments(): void {
    this.donateurService.getComments().subscribe({
      next: (commentaires: Commentaire[]) => {
        this.commentaires = commentaires;
        console.log('Liste des commentaires :', this.commentaires);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des commentaires :', error);
      }
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
  ajouterCommentaire(): void {
    const idDonateur = this.donateurService.id; 
    console.log(idDonateur)
    const idActualite = this.id ;
   console.log(idActualite)
    const contenu = this.commentaireForm.get('contenu')?.value; 
    console.log(contenu)
    if(idDonateur){
    this.donateurService.ajouterCommentaire(idDonateur, idActualite, contenu).subscribe({
      next: (commentaire) => {
        this.commentaireAjout=true;
        console.log('Commentaire ajouté avec succès :', commentaire);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du commentaire :', error);
      }
    });

    this.commentaireForm.reset();
  }
}
 
  



}
