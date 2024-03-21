import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { Association } from 'src/app/interfaces/association';
import { Collecte } from 'src/app/interfaces/collecte';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { AssociationService } from 'src/app/services/associationService.service';

@Component({
  selector: 'app-modifier-association-admin',
  templateUrl: './modifier-association-admin.component.html',
  styleUrls: ['./modifier-association-admin.component.css']
})
export class ModifierAssociationAdminComponent {
 
  @Input() association!:Association;
  associationForm!: FormGroup;
  faXmark=faXmark;

  constructor(public adminService:AdministrateurService,private formBuilder: FormBuilder,public serviceAssociation:AssociationService,
    private spinner:NgxSpinnerService){}
  
  ngOnInit(): void {
    this.associationForm = this.formBuilder.group({
      logo: [this.association.logo],
      nom: [this.association.nom],
      description: [this.association.description],
      categorie: [this.association.categorie],
      adresse: [this.association.adresse],
      email: [this.association.email],
      telephone: [this.association.telephone,[Validators.minLength(8), Validators.maxLength(8)]],
      rib: [this.association.rib],
      mdp: [this.association.mdp],
     





      });
  }
  
  async modifierAssociation(): Promise<void> {
    if (this.associationForm.valid) {
      this.spinner.show();
  
      try {
        const associationDataToUpdate: Association = {
          id: this.association.id,
          nom: this.associationForm.value.nom,
          description: this.associationForm.value.description,
          categorie: this.associationForm.value.categorie,
          adresse: this.associationForm.value.adresse,
          email: this.associationForm.value.email,
          telephone: this.associationForm.value.email,
          rib: this.associationForm.value.rib,
          etat:this.association.etat,
          mdp:this.associationForm.value.mdp,
          logo:this.association.logo,
          id_fiscale:this.association.id_fiscale

        };
  
        const logo = this.associationForm.value.logo;
  
        // Vérifier si un nouveau fichier a été sélectionné
        if (logo) {
          const logoDownloadUrl = await this.serviceAssociation.uploadLogo(logo);
          if (logoDownloadUrl) {
            associationDataToUpdate.logo = logoDownloadUrl;
          }
        }
  
        await this.adminService.modifierAssociation(associationDataToUpdate);
        window.location.reload();
      } catch (error) {
        console.error('Erreur lors de la modification de la collecte :', error);
      } finally {
        this.spinner.hide();
      }
    } else {
      console.error('Formulaire invalide. Veuillez corriger les erreurs.');
    }
  }
  
  
  
  
  
  
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.associationForm.patchValue({
        logo: file
      });
    }
  }
  
  

}