import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { Collecte } from 'src/app/interfaces/collecte';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { AssociationService } from 'src/app/services/associationService.service';
import { CollecteService } from 'src/app/services/collecte.service';

@Component({
  selector: 'app-modifier-collecte-admin',
  templateUrl: './modifier-collecte-admin.component.html',
  styleUrls: ['./modifier-collecte-admin.component.css']
})
export class ModifierCollecteAdminComponent {

  @Input() collecte!:Collecte;
  collecteForm!: FormGroup;
  faXmark=faXmark;

  constructor(public service:CollecteService,private formBuilder: FormBuilder,public serviceAssociation:AssociationService,
    private spinner:NgxSpinnerService,public serviceAdmin:AdministrateurService){}
  
  ngOnInit(): void {
    this.collecteForm = this.formBuilder.group({
      nom: [this.collecte.nom],
      description: [this.collecte.description],
      image: [this.collecte.image],
      montant: [this.collecte.montant],
      date_debut: [this.collecte.date_debut instanceof Date ? this.collecte.date_debut.toISOString().split('T')[0] : this.collecte.date_debut],
      date_fin: [this.collecte.date_fin instanceof Date ? this.collecte.date_fin.toISOString().split('T')[0] : this.collecte.date_fin]
    }, { validator: this.dateFinSupDateDebutValidator });
  }
  
  async modifierCollecte(): Promise<void> {
    if (this.collecteForm.valid) {
      this.spinner.show();
  
      try {
        const collecteDataToUpdate: Collecte = {
          id: this.collecte.id,
          nom: this.collecteForm.value.nom,
          etat:this.collecteForm.value.etat,
          description: this.collecteForm.value.description,
          montant: this.collecteForm.value.montant,
          date_debut: this.collecteForm.value.date_debut,
          date_fin: this.collecteForm.value.date_fin,
          image: this.collecte.image // Assurez-vous de transmettre l'URL de l'image existante
        };
  
        const coverFile = this.collecteForm.value.image;
  
        // Vérifier si un nouveau fichier a été sélectionné
        if (coverFile) {
          const coverDownloadUrl = await this.service.uploadCover(coverFile);
          if (coverDownloadUrl) {
            collecteDataToUpdate.image = coverDownloadUrl;
          }
        }
  
        await this.service.modifierCollecte(collecteDataToUpdate);
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
