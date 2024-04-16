import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { Collecte } from 'src/app/interfaces/collecte';
import { Donateur } from 'src/app/interfaces/donateur';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { AssociationService } from 'src/app/services/association.service';
import { DonateurService } from 'src/app/services/donateur.service';

@Component({
  selector: 'app-modifier-donateur-admin',
  templateUrl: './modifier-donateur-admin.component.html',
  styleUrls: ['./modifier-donateur-admin.component.css']
})
export class ModifierDonateurAdminComponent {


  @Input() donateur!:Donateur;
  donateurForm!: FormGroup;
  faXmark=faXmark;

  constructor(public service:DonateurService,private formBuilder: FormBuilder,public serviceAssociation:AssociationService,
    private spinner:NgxSpinnerService,public serviceAdmin:AdministrateurService){}
  
  ngOnInit(): void {
    this.donateurForm = this.formBuilder.group({
      nom: [this.donateur.nom],
      prenom: [this.donateur.prenom],
      photo: [this.donateur.photo],
      email: [this.donateur.email],
      telephone: [this.donateur.telephone],
      date_de_naissance: [this.donateur.date_de_naissance instanceof Date ? this.donateur.date_de_naissance.toISOString().split('T')[0] : this.donateur.date_de_naissance],
    });
  }
  
  async modifierDonateur(): Promise<void> {
    if (this.donateurForm.valid) {
      this.spinner.show();
  
      try {
        const donateurDataToUpdate: Donateur = {
          id: this.donateur.id,
          nom: this.donateurForm.value.nom,
          prenom: this.donateurForm.value.prenom,
          etat:this.donateur.etat,
          mdp:this.donateur.mdp,
          salt:this.donateur.salt,
          email: this.donateurForm.value.email,
          telephone: this.donateurForm.value.telephone,
          adresse: this.donateurForm.value.adresse,
          gouvernerat: this.donateurForm.value.gouvernerat,
          date_de_naissance: this.donateurForm.value.date_de_naissance,
          photo: this.donateur.photo // Assurez-vous de transmettre l'URL de l'image existante
        };
  
        const Photo = this.donateurForm.value.photo;
  
        // Vérifier si un nouveau fichier a été sélectionné
        if (Photo) {
          const photoDownloadUrl = await this.service.uploadPhoto(Photo);
          if (photoDownloadUrl) {
            donateurDataToUpdate.photo = photoDownloadUrl;
          }
        }
  
        await this.service.modifierCompte(donateurDataToUpdate);
        window.location.reload();
      } catch (error) {
        console.error('Erreur lors de la modification du donateur :', error);
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
      this.donateurForm.patchValue({
        image: file
      });
    }
  }
  
  

}

