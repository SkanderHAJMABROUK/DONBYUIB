import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { AssociationService } from 'src/app/services/association.service';
import { CollecteService } from 'src/app/services/collecte.service';

@Component({
  selector: 'app-ajouter-collecte-admin',
  templateUrl: './ajouter-collecte-admin.component.html',
  styleUrls: ['./ajouter-collecte-admin.component.css']
})
export class AjouterCollecteAdminComponent {

 
  protected aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;
  showSuccessMessage: boolean = false;


  constructor(public service:AdministrateurService, private formBuilder: FormBuilder, public serviceCollecte: CollecteService, private router: Router,public serviceAssociation:AssociationService,
    private spinner:NgxSpinnerService) {}

  ngOnInit(): void {
   
    this.aFormGroup = this.formBuilder.group(
      {

        nom: ['', Validators.required],
        description: ['', Validators.required],
        montant: ['', Validators.required],
        image: ['', Validators.required],
        date_debut: ['', Validators.required],
        association: ['', Validators.required],
        date_fin: ['', Validators.required]

    
      }, { validator: this.dateFinSupDateDebutValidator }
    );
    this.getAssociations();
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
      const CoverFile = this.aFormGroup.value.image;
      const CoverDownloadUrl = await this.serviceCollecte.uploadCover(CoverFile);
      if (!CoverDownloadUrl) {
        console.error('Failed to upload logo file.');
        return;
      }
      console.log('Logo file uploaded. Download URL:', CoverDownloadUrl);

      this.getAssociationIdByName(this.aFormGroup.value.association).subscribe(associationId => {
        if (associationId) {
          console.log(associationId);
          this.serviceCollecte.ajouterCollecte({
            ...this.aFormGroup.value,
            image: CoverDownloadUrl,
            id_association: associationId
          })
          .then(() => {
            console.log('Données de la collecte ajoutées avec succès dans Firebase Firestore.');
            this.aFormGroup.reset();
            this.showSuccessMessage = true;
            this.showErrorNotification = false;
          })
          .catch(error => {
            console.error('Erreur lors de l\'ajout des données de la collecte dans Firebase Firestore:', error);
          })
          .finally(() => {
            this.spinner.hide();
          });
        }
      });
    } else {
      this.showErrorNotification = true;
      this.showSuccessMessage = false;
      console.log("Formulaire invalide");
    }
  
  }
  dateFinSupDateDebutValidator(control: FormGroup): ValidationErrors | null {
    const dateDebut = control.get('date_debut')?.value;
    const dateFin = control.get('date_fin')?.value;
  
    if (dateDebut && dateFin && new Date(dateFin) <= new Date(dateDebut)) {
      return { dateFinSupDateDebut: true };
    }
    
    return null;
  }
  associations: string[] = [];

  getAssociations() {
    this.serviceCollecte.getAssociations().subscribe(associations => {
      this.associations = associations;
    });
  }
  getAssociationIdByName(nom: string):Observable< string | undefined> {
    return this.serviceAssociation.getAssociationIdByName(nom);
  }

   
}
