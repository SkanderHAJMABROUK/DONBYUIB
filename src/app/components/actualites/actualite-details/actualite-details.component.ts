import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Options } from 'ngx-slider-v2';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Actualite } from 'src/app/interfaces/actualite';
import { Commentaire } from 'src/app/interfaces/commentaire';
import { Donateur } from 'src/app/interfaces/donateur';
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
    this.donateurService.getComments()
        .pipe(
            map((commentaires: Commentaire[]) => commentaires.filter(commentaire => commentaire.id_actualite === this.id))
        )
        .subscribe({
            next: (commentaires: Commentaire[]) => {
                this.commentaires = commentaires;
              
                console.log('Liste des commentaires filtrés par ID d\'actualité :', this.commentaires);
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

 



donateursPhotos: string[] = [];
donateursIds : string[] = []; 
 

getDonateursIds(): void {
  this.donateursIds = Array.from(new Set(
    this.commentaires
      .map(commentaire => commentaire.id_donateur)
  )) as string[];

  this.getDonateursPhotosByIds(this.donateursIds);
}

getDonateursPhotosByIds(ids: string[]) {
  console.log(this.donateursIds)
  const observables: Observable<string | undefined>[] = ids.map(id =>
    this.donateurService.getDonateurPhotoById(id).pipe(
      map(photo => photo ?? undefined) )
  );

  observables.forEach((observable, index) =>
    observable.subscribe(photo => {
      console.log(`Observable ${index + 1} emitted value:`, photo); // Log emitted values
      if (photo !== undefined) {
        this.donateursPhotos.push(photo);
        console.log('Pushed photo:', photo); 
        console.log(this.donateursPhotos);
      }else{
        console.log('probleme')
      }
    })
  )
} 






getDonateurPhotoById(id: string | undefined): string |undefined{
  if (!id) {
    
    return undefined;
  }
  const index = this.donateursIds.indexOf(id);
  if (index !== -1) {
    
    return this.donateursPhotos[index];
  } else {
    console.log('ici' )
    return undefined;
  }
}




 }
