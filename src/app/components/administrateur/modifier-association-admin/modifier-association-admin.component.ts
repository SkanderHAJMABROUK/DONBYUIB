import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors, Validators, FormControl } from '@angular/forms';
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
        logo: [this.association.logo, Validators.required],
        nom: [this.association.nom, Validators.required],
        description: [this.association.description, Validators.required],
        categorie: [this.association.categorie, Validators.required],
        adresse: [this.association.adresse, Validators.required],
        email: [this.association.email, [Validators.required, Validators.email]],
        telephone: [this.association.telephone, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        rib: [this.association.rib, [Validators.required, Validators.minLength(20), Validators.maxLength(20), this.ribValidator]],
      });
    }
    ribValidator = (control: FormControl): {[key: string]: any} | null => {
      const rib: string | null = control.value;
      if (rib && rib.length === 20) {
        if (!this.checkRIB(rib)) {
          return { 'invalidRIB': true };
        }
      } else {
        return { 'invalidRIB': true };
      }
      return null;
    }
    checkRIB(RIB: string): boolean {
      if (RIB.length === 20) {
          const cle: string = RIB.substring(18, 20);
          const ribf2: string = RIB.substring(0, 18) + "00";
          const p12: string = ribf2.substring(0, 10);
          const p22: string = ribf2.substring(10, 20);
          const r12: number = parseInt(p12) % 97;
          const tmp2: string = r12.toString().concat(p22);
          const r22: number = parseInt(tmp2) % 97;
          const res2: number = 97 - r22;
          const estOKRib: boolean = parseInt(cle) === res2;
  
          return estOKRib;
      } else {
          return false;
      }
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