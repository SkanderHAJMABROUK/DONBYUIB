import { Component, Input } from '@angular/core';
import { Actualite } from 'src/app/interfaces/actualite';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActualiteService } from 'src/app/services/actualite.service';
import { AssociationService } from 'src/app/services/associationService.service';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-modifier-actualite',
  templateUrl: './modifier-actualite.component.html',
  styleUrls: ['./modifier-actualite.component.css']
})
export class ModifierActualiteComponent {

  @Input() actualite!: Actualite;
  faXmark = faXmark;

  actualiteForm!: FormGroup;

  constructor(public service: ActualiteService, private formBuilder: FormBuilder, public serviceAssociation: AssociationService,
    private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.actualiteForm = this.formBuilder.group({
      titre: [this.actualite.titre],
      description: [this.actualite.description],
      image: [this.actualite.image],
      date_publication: [this.actualite.date_publication instanceof Date ? this.actualite.date_publication.toISOString().split('T')[0] : this.actualite.date_publication],
    });
  }

  async modifierActualite(): Promise<void> {
    if (this.actualiteForm.valid) {
      this.spinner.show();
  
      try {
        const actualiteDataToUpdate: Actualite = {
          id: this.actualite.id,
          ...this.actualiteForm.value
        };
  
        const imageFile = this.actualiteForm.value.image;
  
        // Vérifier si un nouveau fichier a été sélectionné
        if (imageFile instanceof File) {
          const imageDownloadUrl = await this.service.uploadCover(imageFile);
          if (imageDownloadUrl) {
            actualiteDataToUpdate.image = imageDownloadUrl;
          }
        }
  
        await this.service.modifierActualite(actualiteDataToUpdate);
        window.location.reload();
      } catch (error) {
        console.error('Erreur lors de la modification de l\'actualité :', error);
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
      this.actualiteForm.patchValue({
        image: file
      });
    }
  }
}
