import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Actualite } from 'src/app/interfaces/actualite';
import { ActualiteService } from 'src/app/services/actualite.service';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { AssociationService } from 'src/app/services/association.service';

@Component({
  selector: 'app-modifier-actualite-admin',
  templateUrl: './modifier-actualite-admin.component.html',
  styleUrls: ['./modifier-actualite-admin.component.css']
})
export class ModifierActualiteAdminComponent {


  @Input() actualite!:Actualite;
  faXmark=faXmark;

  actualiteForm!: FormGroup;

  constructor(public service:ActualiteService,private formBuilder: FormBuilder,public serviceAssociation:AssociationService,public adminService:AdministrateurService){}
  
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

