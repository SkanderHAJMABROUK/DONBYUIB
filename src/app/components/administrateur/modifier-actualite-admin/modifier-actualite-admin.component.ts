import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { Actualite } from 'src/app/interfaces/actualite';
import { ActualiteService } from 'src/app/services/actualite.service';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { AssociationService } from 'src/app/services/association.service';

@Component({
  selector: 'app-modifier-actualite-admin',
  templateUrl: './modifier-actualite-admin.component.html',
  styleUrls: ['./modifier-actualite-admin.component.css'],
})
export class ModifierActualiteAdminComponent {
  @Input() actualite!: Actualite;
  faXmark = faXmark;

  actualiteForm!: FormGroup;

  constructor(
    public service: ActualiteService,
    private formBuilder: FormBuilder,
    public serviceAssociation: AssociationService,
    public adminService: AdministrateurService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.actualiteForm = this.formBuilder.group({
      titre: [this.actualite.titre],
      description: [this.actualite.description],
      image: [this.actualite.image],
      date_publication: [
        this.actualite.date_publication instanceof Date
          ? this.actualite.date_publication.toISOString().split('T')[0]
          : this.actualite.date_publication,
      ],
    });
  }

  async modifierActualite(): Promise<void> {
    if (this.actualiteForm.valid) {
      this.spinner.show();

      try {
        const actualiteDataToUpdate: Actualite = {
          id: this.actualite.id,
          etat: this.actualite.etat,
          titre: this.actualiteForm.value.titre,
          description: this.actualiteForm.value.description,
          image: this.actualite.image,
          date_publication: this.actualiteForm.value.date_publication,
        };

        const imageFile = this.actualiteForm.value.image;

        if (imageFile instanceof File) {
          const imageDownloadUrl = await this.service.uploadCover(imageFile);
          if (imageDownloadUrl) {
            actualiteDataToUpdate.image = imageDownloadUrl;
          }
        }

        this.service
          .modifierActualiteByAdmin({
            ...actualiteDataToUpdate,
            image: actualiteDataToUpdate.image,
          })
          .then(() => window.location.reload())
          .catch((error) =>
            console.error(
              "Erreur lors de la modification de l'actualité :",
              error,
            ),
          );
      } catch (error) {
        console.error("Erreur lors de la modification de l'actualité :", error);
      } finally {
        this.spinner.hide();
      }
    }
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.actualiteForm.patchValue({
        image: file,
      });
    }
  }
}
