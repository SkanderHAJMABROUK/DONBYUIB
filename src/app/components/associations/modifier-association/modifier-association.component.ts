import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AssociationService } from 'src/app/services/association.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Association } from 'src/app/interfaces/association';

@Component({
  selector: 'app-modifier-association',
  templateUrl: './modifier-association.component.html',
  styleUrls: ['./modifier-association.component.css']
})
export class ModifierAssociationComponent {

  password: string = '';
  showPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showErrorNotification: boolean = false;
  showSuccessMessage: boolean = false;
  isModificationDemandPending: boolean = false;

  constructor(private formBuilder: FormBuilder, public service: AssociationService, private router: Router, private route:ActivatedRoute) {}

  modificationDate: string | undefined;

  association!:Association
  associationId!:string
  isFormModified: boolean = false;
  aucunChangement: boolean = false;
  initialValues: any; 

  protected aFormGroup: FormGroup = this.formBuilder.group({
    nom: ['', Validators.required],
    description: ['', Validators.required],
    adresse: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
    rib: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(20)]],
    categorie: ['', Validators.required]
  });


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.associationId= params['id']; // Obtain association ID from URL parameters
      
      // Check if modification demand is pending for this association
      this.service.checkPendingModificationDemand(this.associationId).subscribe(isPending => {
        this.isModificationDemandPending = isPending;
        this.initializeForm();
        this.service.getModificationDateByAssociationId(this.associationId).subscribe(modificationDate => {
        this.modificationDate = modificationDate;
        });
      });

      this.service.getAssociationById(this.associationId).subscribe(association => {
        if (association) {
          this.association = association; // Save association data
          this.initializeForm(); // Initialize form once data is loaded
        } else {
          console.error('No association found with this ID:', this.associationId);
          // Handle case where no association is found with this ID
        }
      });
    });

    this.aFormGroup.valueChanges.subscribe(() => {
      this.isFormModified = !this.aFormGroup.pristine; // Set flag based on form state
    });
    
  }

  initializeForm(): void {
    this.aFormGroup = this.formBuilder.group({
      nom: [{ value: this.association?.nom || '', disabled: this.isModificationDemandPending }, Validators.required],
      description: [{ value: this.association?.description || '', disabled: this.isModificationDemandPending }, Validators.required],
      adresse: [{ value: this.association?.adresse || '', disabled: this.isModificationDemandPending }, Validators.required],
      email: [{ value: this.association?.email || '', disabled: this.isModificationDemandPending }, [Validators.required, Validators.email]],
      telephone: [{ value: this.association?.telephone || '', disabled: this.isModificationDemandPending }, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      rib: [{ value: this.association?.rib || '', disabled: this.isModificationDemandPending }, [Validators.required, Validators.minLength(20), Validators.maxLength(20)]],
      categorie: [{ value: this.association?.categorie || '', disabled: this.isModificationDemandPending }, Validators.required],
    });
    this.initialValues = { ...this.aFormGroup.getRawValue() };
  }
 
  async onSubmit(): Promise<void>{
    console.log("onSubmit() function called");
    
    
    if (this.isModificationDemandPending) {
      this.showSuccessMessage = false;
      console.log("existe");
      return; 
    }

     if (JSON.stringify(this.initialValues) === JSON.stringify(this.aFormGroup.getRawValue())) {
      this.showSuccessMessage = false;
      this.aucunChangement = true;
      return;
    }
    
    if (this.aFormGroup.valid) {
      console.log("Form is valid");

      await this.service.modifierAssociation(this.associationId, { ...this.aFormGroup.value })
        .then(() => {
          console.log('Association data modified successfully in Firebase Firestore.');
          this.showSuccessMessage = true;
        })
        .catch(error => {
          console.error('Error modifying association data in Firebase Firestore:', error);
        });
    } else {
      this.showErrorNotification = true;
      console.log("Form is invalid");
      // Display error message or perform other actions to handle validation errors
    }
  }

  }

