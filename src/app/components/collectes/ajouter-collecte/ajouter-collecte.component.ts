import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { CollecteService } from '../../../services/collecte.service';
import { AssociationService } from '../../../services/associationService.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-ajouter-collecte',
  templateUrl: './ajouter-collecte.component.html',
  styleUrls: ['./ajouter-collecte.component.css']
})
export class AjouterCollecteComponent implements OnInit{


 
  protected aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;
  showSuccessMessage: boolean = false;


  constructor(private formBuilder: FormBuilder, public service: CollecteService, private router: Router,public serviceAssociation:AssociationService,
    private spinner:NgxSpinnerService) {}

  ngOnInit(): void {
   
    this.aFormGroup = this.formBuilder.group(
      {

        nom: ['', Validators.required],
        description: ['', Validators.required],
        montant: ['', Validators.required],
        image: ['', Validators.required],
        date_debut: ['', Validators.required],
        date_fin: ['', Validators.required]

    
      }
    );
  }

  onLogoFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.aFormGroup.get('image')?.setValue(file);
  }
  

  async onSubmit(): Promise<void>{
    console.log("Fonction onSubmit() appelée");
    if (this.aFormGroup.valid) {

      console.log("Formulaire valide");
      this.spinner.show();

      // Upload logo file
      const logoFile = this.aFormGroup.value.image;
      const logoDownloadUrl = await this.service.uploadLogo(logoFile);
      if (!logoDownloadUrl) {
        console.error('Failed to upload logo file.');
        // Handle error appropriately, e.g., show error message to user
        return;
      }
      console.log('Logo file uploaded. Download URL:', logoDownloadUrl);
   
      this.service.ajouterCollecte({...this.aFormGroup.value,
        image: logoDownloadUrl,
       })
        .then(() => {
          console.log('Données de la collecte ajoutées avec succès dans Firebase Firestore.');
          // Réinitialiser le formulaire après l'ajout des données
          this.aFormGroup.reset();
          // this.router.navigate(['/demande-association']);
          this.showSuccessMessage = true;

        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout des données de la collecte dans Firebase Firestore:', error);
        });

        this.spinner.hide();
        
    } else {
      this.showErrorNotification = true;
      console.log("Formulaire invalide");
      // Afficher un message d'erreur ou effectuer d'autres actions pour gérer les erreurs de validation
    }
  }
   
}
