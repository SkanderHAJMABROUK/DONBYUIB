import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AssociationService } from 'src/app/services/association.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Association } from 'src/app/interfaces/association';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-modifier-association',
  templateUrl: './modifier-association.component.html',
  styleUrls: ['./modifier-association.component.css'],
})
export class ModifierAssociationComponent {
  showErrorNotification: boolean = false;
  showSuccessMessage: boolean = false;
  isModificationDemandPending: boolean = false;
  modificationDate: string | undefined;
  association!: Association;
  associationId!: string;
  isFormModified: boolean = false;
  aucunChangement: boolean = false;
  initialValues: any;
  categories: string[] = [];

  aFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public service: AssociationService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    this.aFormGroup = this.formBuilder.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      adresse: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      ],
      rib: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(20),
          this.ribValidator,
        ],
      ],
      categorie: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.associationId = params['id']; // Obtain association ID from URL parameters

      this.service
        .checkPendingModificationDemand(this.associationId)
        .subscribe((isPending) => {
          this.isModificationDemandPending = isPending;
          this.initializeForm();
          this.getCategories();
          this.service
            .getModificationDateByAssociationId(this.associationId)
            .subscribe((modificationDate) => {
              this.modificationDate = modificationDate;
            });
        });

      this.service
        .getAssociationById(this.associationId)
        .subscribe((association) => {
          if (association) {
            this.association = association; // Save association data
            this.initializeForm(); // Initialize form once data is loaded
          } else {
            console.error(
              'No association found with this ID:',
              this.associationId,
            );
          }
        });
    });

    this.aFormGroup.valueChanges.subscribe(() => {
      this.isFormModified = !this.aFormGroup.pristine; // Set flag based on form state
    });
  }

  initializeForm(): void {
    this.aFormGroup.patchValue({
      nom: this.association?.nom || '',
      description: this.association?.description || '',
      adresse: this.association?.adresse || '',
      email: this.association?.email || '',
      telephone: this.association?.telephone || '',
      rib: this.association?.rib || '',
      categorie: this.association?.categorie || '',
    });
    this.initialValues = { ...this.aFormGroup.getRawValue() };

    if (this.isModificationDemandPending) {
      this.aFormGroup.disable();
    }
  }

  async onSubmit(): Promise<void> {
    console.log('onSubmit() function called');

    if (this.isModificationDemandPending) {
      this.showSuccessMessage = false;
      console.log('Modification demand is pending');
      return;
    }

    if (
      JSON.stringify(this.initialValues) ===
      JSON.stringify(this.aFormGroup.getRawValue())
    ) {
      this.showSuccessMessage = false;
      this.aucunChangement = true;
      return;
    }

    if (this.aFormGroup.valid) {
      console.log('Form is valid');

      this.spinner.show();

      try {
        await this.service.modifierAssociation(this.associationId, {
          ...this.aFormGroup.value,
        });
        console.log(
          'Association data modified successfully in Firebase Firestore.',
        );
        this.showSuccessMessage = true;
      } catch (error) {
        console.error(
          'Error modifying association data in Firebase Firestore:',
          error,
        );
      } finally {
        this.spinner.hide();
      }
    } else {
      this.showErrorNotification = true;
      console.log('Form is invalid');
      Object.keys(this.aFormGroup.controls).forEach(key => {
        const controlErrors = this.aFormGroup.get(key)?.errors;
        if (controlErrors) {
          console.log(`${key} errors:`, controlErrors);
        }
      });
    }
  }

  ribValidator = (control: FormControl): { [key: string]: any } | null => {
    const rib: string | null = control.value;
    if (rib && rib.length === 20) {
      if (!this.checkRIB(rib)) {
        return { invalidRIB: true };
      }
    } else {
      return { invalidRIB: true };
    }
    return null;
  };

  checkRIB(RIB: string): boolean {
    if (RIB.length === 20) {
      const cle: string = RIB.substring(18, 20);
      const ribf2: string = RIB.substring(0, 18) + '00';
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

  getCategories() {
    this.service.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }
}
