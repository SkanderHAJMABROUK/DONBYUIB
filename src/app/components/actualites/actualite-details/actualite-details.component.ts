import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  commentaireAjout: boolean = false;
  constructor(public service: ActualiteService, public donateurService: DonateurService, public route: ActivatedRoute, private formBuilder: FormBuilder) { }

  id!: string;
  data: Actualite | undefined;
  selectedActualite!: Actualite | undefined;
  commentaires: Commentaire[] = [];
  showAllComments: boolean = false;
  donateursPhotos: string[] = [];
  donateursNoms: string[] = [];
  donateursPrenoms: string[] = [];
  donateursIds: string[] = [];

  ngOnInit(): void {
    this.commentaireForm = this.formBuilder.group({
      contenu: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      this.id = params['id'];
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
          this.getDonateursIds();
        },
        error: (error) => {
          console.error('Error fetching comments:', error);
        }
      });
  }

  getActualiteById(id: string) {
    this.service.getActualiteById(id).subscribe({
      next: (data: Actualite | undefined) => {
        if (data !== undefined) {
          this.selectedActualite = data;
        } else {
          console.error('No data returned for actualite ID:', id);
        }
      },
      error: error => {
        console.error('Error fetching actualite data:', error);
      }
    });
  }

  ajouterCommentaire(): void {
    const idDonateur = this.donateurService.id;
    const idActualite = this.id;
    const contenu = this.commentaireForm.get('contenu')?.value;
    if (idDonateur) {
      this.donateurService.ajouterCommentaire(idDonateur, idActualite, contenu).subscribe({
        next: (commentaire) => {
          this.commentaireAjout = true;
          console.log('Commentaire ajouté avec succès :', commentaire);
          this.getComments();
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du commentaire :', error);
        }
      });

      this.commentaireForm.reset();
    }
  }

  getDonateursIds(): void {
    this.donateursIds = Array.from(new Set(
      this.commentaires.map(commentaire => commentaire.id_donateur)
    )) as string[];

    this.getDonateursPhotosByIds();
    this.getDonateursNomsByIds();
    this.getDonateursPrenomsByIds();
    
  }

  getDonateursPhotosByIds(): void {
    this.donateursPhotos = []; // Clear existing photos

    for (let id of this.donateursIds) {
      this.donateurService.getDonateurPhotoById(id).subscribe(photo => {
        this.donateursPhotos.push(photo ?? ''); // Push photo to the array
      });
    }
  }

  getDonateurPhotoById(id: string | undefined): string | undefined {
    if (!id) {
      return undefined;
    }

    const index = this.donateursIds.indexOf(id);

    if (index !== -1) {
      return this.donateursPhotos[index];
    } else {
      console.log('Donateur ID not found:', id);
      return undefined;
    }
  }


  getDonateursNomsByIds(): void {
    this.donateursNoms = []; // Clear existing photos

    for (let id of this.donateursIds) {
      this.donateurService.getDonateurNomById(id).subscribe(nom => {
        this.donateursNoms.push(nom ?? ''); // Push photo to the array
      });
    }
  }

  getDonateurNomById(id: string | undefined): string | undefined {
    if (!id) {
      return undefined;
    }

    const index = this.donateursIds.indexOf(id);

    if (index !== -1) {
      return this.donateursNoms[index];
    } else {
      console.log('Donateur ID not found:', id);
      return undefined;
    }
  }



  getDonateursPrenomsByIds(): void {
    this.donateursPrenoms = []; // Clear existing photos

    for (let id of this.donateursIds) {
      this.donateurService.getDonateurPrenomById(id).subscribe(prenom => {
        this.donateursPrenoms.push(prenom ?? ''); // Push photo to the array
      });
    }
  }

  getDonateurPrenomById(id: string | undefined): string | undefined {
    if (!id) {
      return undefined;
    }

    const index = this.donateursIds.indexOf(id);

    if (index !== -1) {
      return this.donateursPrenoms[index];
    } else {
      console.log('Donateur ID not found:', id);
      return undefined;
    }
  }

}
