import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CollecteService } from 'src/app/services/collecte.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Collecte } from 'src/app/interfaces/collecte';
import { AssociationService } from 'src/app/services/associationService.service';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-modifier-collecte',
  templateUrl: './modifier-collecte.component.html',
  styleUrls: ['./modifier-collecte.component.css']
})
export class ModifierCollecteComponent {
  @Input() collecte!:Collecte;
  collecteForm!: FormGroup;
  faXmark=faXmark;

  constructor(public service:CollecteService,private formBuilder: FormBuilder,public serviceAssociation:AssociationService,
    private spinner:NgxSpinnerService){}
  
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
  
      const collecteDataToUpdate: Collecte = {
        id: this.collecte.id,
        ...this.collecteForm.value
      };
  
      const coverFile = this.collecteForm.value.image;
  
      try {
        // Vérifier si un fichier a été sélectionné
        if (coverFile) {
          const coverDownloadUrl = await this.service.uploadCover(coverFile);
          if (coverDownloadUrl) {
            collecteDataToUpdate.image = coverDownloadUrl;
          }
        } else {
          // Si aucun fichier n'a été sélectionné, conserver l'image existante
          collecteDataToUpdate.image = this.collecte.image;
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