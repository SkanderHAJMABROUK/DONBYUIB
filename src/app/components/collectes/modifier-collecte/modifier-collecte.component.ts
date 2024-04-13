import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CollecteService } from 'src/app/services/collecte.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Collecte } from 'src/app/interfaces/collecte';
import { AssociationService } from 'src/app/services/association.service';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { DemandeModificationCollecte } from 'src/app/interfaces/demande-modification-collecte';

@Component({
  selector: 'app-modifier-collecte',
  templateUrl: './modifier-collecte.component.html',
  styleUrls: ['./modifier-collecte.component.css']
})
export class ModifierCollecteComponent {

  @Input() collecte!:Collecte;
  collecteForm!: FormGroup;
  faXmark=faXmark;
  isModificationDemandPending: boolean = false;
  modificationDate: string | undefined;
  initialValues: any; 
  isFormModified: boolean = false;
  aucunChangement: boolean = false;


  constructor(public service:CollecteService,private formBuilder: FormBuilder,public serviceAssociation:AssociationService,
    private spinner:NgxSpinnerService){}
  
    ngOnInit(): void {
      if (this.collecte.id) {
          this.service.checkPendingModificationDemand(this.collecte.id).subscribe(isPending => {
              this.isModificationDemandPending = isPending;
              this.initializeForm();
              if (this.collecte.id) {
                  this.service.getModificationDateByCollecteId(this.collecte.id).subscribe(modificationDate => {
                      this.modificationDate = modificationDate;
                  });
              }
          });
  
          this.collecteForm.valueChanges.subscribe(() => {
              this.isFormModified = !this.collecteForm.pristine; // Set flag based on form state
          });
      } else {
          console.error('Collecte ID is undefined.');
      }
  }
  

  initializeForm(): void {
    this.collecteForm = this.formBuilder.group({
        nom: [{ value: this.collecte?.nom || '', disabled: this.isModificationDemandPending }, Validators.required],
        description: [{ value: this.collecte?.description || '', disabled: this.isModificationDemandPending }, Validators.required],
        image: [{ value: this.collecte?.image || '', disabled: this.isModificationDemandPending }, Validators.required],
        montant: [{ value: this.collecte?.montant || '', disabled: true }, Validators.required],
        date_debut: [{ 
            value: this.collecte?.date_debut instanceof Date ? this.collecte.date_debut.toISOString().split('T')[0] : this.collecte.date_debut, 
            disabled: this.isModificationDemandPending 
        }, Validators.required],
        date_fin: [{ 
            value: this.collecte?.date_fin instanceof Date ? this.collecte.date_fin.toISOString().split('T')[0] : this.collecte.date_fin, 
            disabled: this.isModificationDemandPending 
        }, Validators.required],
    }, { validator: this.dateFinSupDateDebutValidator });

    this.initialValues = { ...this.collecteForm.getRawValue() };
}

  async onSubmit(): Promise<void> {

    if (JSON.stringify(this.initialValues) === JSON.stringify(this.collecteForm.getRawValue())) {
      this.aucunChangement = true;
      return;
    }

    if (this.collecteForm.valid) {
      this.spinner.show();
  
      try {
        const collecteDataToUpdate: DemandeModificationCollecte = {
          id: this.collecte.id,
          nom: this.collecteForm.value.nom,
          description: this.collecteForm.value.description,
          date_debut: this.collecteForm.value.date_debut,
          date_fin: this.collecteForm.value.date_fin,
          image: this.collecteForm.value.image,
          id_association:this.collecte.id_association,
          etat: 'en_attente',
          date: new Date(),
        };
  
        const coverFile = this.collecteForm.value.image;
  
        // Vérifier si un nouveau fichier a été sélectionné
        if (coverFile instanceof File) {
          const coverDownloadUrl = await this.service.uploadCover(coverFile);
          if (coverDownloadUrl) {
            collecteDataToUpdate.image = coverDownloadUrl;
          }
        }
  
        await this.service.modifierCollecte(collecteDataToUpdate);
        this.service.collecteModifierShowModal=false

      } catch (error) {
        console.error('Erreur lors de la modification de la collecte :', error);
      } finally {
        this.service.collecteModifierShowModal=false
        this.spinner.hide();
      }
    } else {
      console.error('Formulaire invalide. Veuillez corriger les erreurs.');
    }
  }  
  
  
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.collecteForm.patchValue({
        image: file
      });
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

}