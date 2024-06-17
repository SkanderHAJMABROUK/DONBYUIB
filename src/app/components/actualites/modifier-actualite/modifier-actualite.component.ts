import { Component, Input, OnInit } from '@angular/core';
import { Actualite } from 'src/app/interfaces/actualite';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActualiteService } from 'src/app/services/actualite.service';
import { AssociationService } from 'src/app/services/association.service';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { DemandeModificationActualite } from 'src/app/interfaces/demande-modification-actualite';

@Component({
  selector: 'app-modifier-actualite',
  templateUrl: './modifier-actualite.component.html',
  styleUrls: ['./modifier-actualite.component.css'],
})
export class ModifierActualiteComponent implements OnInit {
  @Input() actualite!: Actualite;
  faXmark = faXmark;
  actualiteForm!: FormGroup;
  isModificationDemandPending: boolean = false;
  modificationDate: string | undefined;
  initialValues: any;
  isFormModified: boolean = false;
  aucunChangement: boolean = false;

  constructor(
    public service: ActualiteService,
    private formBuilder: FormBuilder,
    public serviceAssociation: AssociationService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    if (this.actualite.id) {
      this.service
        .checkPendingModificationDemand(this.actualite.id)
        .subscribe((isPending) => {
          this.isModificationDemandPending = isPending;
          this.initializeForm();
          if (this.actualite.id) {
            this.service
              .getModificationDateByActualiteId(this.actualite.id)
              .subscribe((modificationDate) => {
                this.modificationDate = modificationDate;
              });
          }
        });

      this.actualiteForm.valueChanges.subscribe(() => {
        this.isFormModified = !this.actualiteForm.pristine; // Set flag based on form state
      });
    } else {
      console.error('Actualité ID is undefined.');
    }
  }

  initializeForm(): void {
    this.actualiteForm = this.formBuilder.group({
      titre: [
        {
          value: this.actualite?.titre,
          disabled: this.isModificationDemandPending,
        },
        Validators.required,
      ],
      description: [
        {
          value: this.actualite?.description,
          disabled: this.isModificationDemandPending,
        },
        Validators.required,
      ],
      image: [
        {
          value: this.actualite?.image,
          disabled: this.isModificationDemandPending,
        },
        Validators.required,
      ],
    });
    this.initialValues = { ...this.actualiteForm.getRawValue() };
  }

  async onSubmit(): Promise<void> {
    if (
      JSON.stringify(this.initialValues) ===
      JSON.stringify(this.actualiteForm.getRawValue())
    ) {
      this.aucunChangement = true;
      return;
    }

    if (this.actualiteForm.valid) {
      this.spinner.show();

      try {
        const actualiteDataToUpdate: DemandeModificationActualite = {
          id: this.actualite.id,
          titre: this.actualiteForm.value.titre,
          description: this.actualiteForm.value.description,
          image: this.actualiteForm.value.image,
          id_association: this.actualite.id_association,
          etat: 'en_attente',
          date: new Date(),
        };

        const coverFile = this.actualiteForm.value.image;

        if (coverFile instanceof File) {
          const coverDownloadUrl = await this.service.uploadCover(coverFile);
          if (coverDownloadUrl) {
            actualiteDataToUpdate.image = coverDownloadUrl;
          }
        }

        await this.service.modifierActualite(actualiteDataToUpdate);
        this.service.actualiteModifierShowModal = false;
      } catch (error) {
        console.error('Erreur lors de la modification de la collecte :', error);
      } finally {
        this.service.actualiteModifierShowModal = false;
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
        image: file,
      });
    }
  }
}
