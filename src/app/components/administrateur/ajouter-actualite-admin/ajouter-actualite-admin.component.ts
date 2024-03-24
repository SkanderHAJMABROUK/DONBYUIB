import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActualiteService } from 'src/app/services/actualite.service';
import { AssociationService } from 'src/app/services/associationService.service';

@Component({
  selector: 'app-ajouter-actualite-admin',
  templateUrl: './ajouter-actualite-admin.component.html',
  styleUrls: ['./ajouter-actualite-admin.component.css']
})
export class AjouterActualiteAdminComponent {



 
  protected aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;
  showSuccessMessage: boolean = false;


  constructor(private formBuilder: FormBuilder, public service: ActualiteService, private router: Router,public serviceAssociation:AssociationService,
    private spinner:NgxSpinnerService) {}

  ngOnInit(): void {
   
    this.aFormGroup = this.formBuilder.group(
      {

        titre: ['', Validators.required],
        description: ['', Validators.required],
        image: ['', [Validators.required]],

      }
    );
  }

  onCoverFileSelected(event: any) {
    console.log('La fct change est appelé');
    const file: File = event?.target?.files[0]; 
    if (file) {
        this.aFormGroup.get('image')?.setValue(file);
    } else {
        console.error('Aucun fichier sélectionné');
    }
}

  

  async onSubmit(): Promise<void>{
    console.log("Fonction onSubmit() appelée");
    if (this.aFormGroup.valid) {

      this.spinner.show();

      console.log("Formulaire valide");

      // Upload cover file
      const coverFile = this.aFormGroup.value.image;
      const coverDownloadUrl = await this.service.uploadCover(coverFile);
      if (!coverDownloadUrl) {
        console.error('Failed to upload cover file.');
        // Handle error appropriately, e.g., show error message to user
        return;
      }
      console.log('Cover file uploaded. Download URL:', coverDownloadUrl);

     
      this.service.ajouterActualite({...this.aFormGroup.value,
        image: coverDownloadUrl
       })
        .then(() => {
          console.log('Données de lactualité ajoutées avec succès dans Firebase Firestore.');
          // Réinitialiser le formulaire après l'ajout des données
          this.aFormGroup.reset();
          this.router.navigate(['/liste-actualites-association'],{ replaceUrl: true });
          this.showSuccessMessage = true;
          this.showErrorNotification = false;
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout des données de lactualité dans Firebase Firestore:', error);
        });

        this.spinner.hide();
        
    } else {
      this.showErrorNotification = true;
      this.showSuccessMessage = false;
      console.log("Formulaire invalide");
      // Afficher un message d'erreur ou effectuer d'autres actions pour gérer les erreurs de validation
    }
  }
  
  
}

