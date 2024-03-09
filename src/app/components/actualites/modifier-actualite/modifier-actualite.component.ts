import { Component, Input } from '@angular/core';
import { Actualite } from 'src/app/interfaces/actualite';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActualiteService } from 'src/app/services/actualite.service';
import { AssociationService } from 'src/app/services/associationService.service';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modifier-actualite',
  templateUrl: './modifier-actualite.component.html',
  styleUrls: ['./modifier-actualite.component.css']
})
export class ModifierActualiteComponent {

  @Input() actualite!:Actualite;
  faXmark=faXmark;

  actualiteForm!: FormGroup;

  constructor(public service:ActualiteService,private formBuilder: FormBuilder,public serviceAssociation:AssociationService){}
  
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
      let actualiteDataToUpdate: Actualite = {
        id: this.actualite.id, // Assurez-vous de récupérer l'ID de la collecte
        ...this.actualiteForm.value // Utilisez les valeurs du formulaire
      };
      const ImageFile = this.actualiteForm.value.image;
      const ImageDownloadUrl = await this.service.uploadCover(ImageFile);
      if(ImageDownloadUrl){actualiteDataToUpdate.image = ImageDownloadUrl;
      this.service.modifierActualite({...actualiteDataToUpdate,image:ImageDownloadUrl})
     

        .then(() => window.location.reload()) // Rechargez la page après la modification
        .catch(error => console.error('Erreur lors de la modification de la collecte :', error));
    } else {
      console.error('Formulaire invalide. Veuillez corriger les erreurs.');
    }
  }}

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.actualiteForm.patchValue({
        image: file
      });
    }
  }
  


}
