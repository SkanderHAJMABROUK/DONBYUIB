import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AssociationService } from '../shared/associationService.service';

@Component({
  selector: 'app-inscrire-association',
  templateUrl: './inscrire-association.component.html',
  styleUrls: ['./inscrire-association.component.css']
})
export class InscrireAssociationComponent implements OnInit {

  siteKey: string = "6Leiq30pAAAAAAmGTamvErmeEBCejAKqB0gXdocv"; // Site Key
  password: string = '';
  passwordConfirmation: string = '';
  showPassword: boolean = false;
  showPasswordConfirmation: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  protected aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;
  showSuccessMessage: boolean = false;


  constructor(private formBuilder: FormBuilder, public service: AssociationService, private router: Router) {}

  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group(
      {
        recaptcha: ['', Validators.required],

        nom: ['', Validators.required],
        categorie: ['', Validators.required],
        description: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        logo: ['', [Validators.required, this.logoFileValidator.bind(this)]],
        id_fiscale: ['', [Validators.required, this.pdfFileValidator.bind(this)]],
        rib: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(20)]],
        mdp: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), this.passwordFormatValidator]],
        mdp_confirmation: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
        accept_terms: ['', Validators.requiredTrue]
      },
      {
        validators: this.passwordMatchValidator()
      }
    );
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmation(): void {
    this.showPasswordConfirmation = !this.showPasswordConfirmation;
  }


  onSubmit(): void {
    console.log("Fonction onSubmit() appelée");
    if (this.aFormGroup.valid) {
      console.log("Formulaire valide, reCAPTCHA validé !");
      console.log(this.aFormGroup.value.nom);
      // Soumettre le formulaire à votre backend ou effectuer d'autres actions

      // Appel de la méthode addAssociation pour ajouter les données dans la base de données Firebase
      this.service.addAssociation(this.aFormGroup.value)
        .then(() => {
          console.log('Données de l\'association ajoutées avec succès dans Firebase Firestore.');
          // Réinitialiser le formulaire après l'ajout des données
          this.aFormGroup.reset();
          // this.router.navigate(['/demande-association']);
          this.showSuccessMessage = true;

        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout des données de l\'association dans Firebase Firestore:', error);
        });
    } else {
      this.showErrorNotification = true;
      console.log("Formulaire invalide");
      // Afficher un message d'erreur ou effectuer d'autres actions pour gérer les erreurs de validation
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl = control.get('mdp')!;
      const confirmPasswordControl = control.get('mdp_confirmation')!;

      if (!passwordControl.value || !confirmPasswordControl.value) {
        return null;
      }

      return passwordControl.value !== confirmPasswordControl.value ? { 'passwordMismatch': true } : null;
    };
  }

  logoFileValidator(control: AbstractControl): ValidationErrors | null {
    const fileName = (control.value as string); // Extract file name from input value
    console.log('File name:', fileName);
  
    if (!fileName) {
      console.log('File name not found');
      return { invalidFileName: true };
    }
  
    const filenameParts = fileName.split('.');
    const extension = filenameParts[filenameParts.length - 1].toLowerCase();
    console.log('Extension:', extension);
  
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'svg'];
  
    if (!allowedExtensions.includes(extension)) {
      console.log('Invalid logo format');
      return { invalidLogoFormat: true };
    }
  
    console.log('Logo file is valid');
    return null;
  }
  
  
  
  pdfFileValidator(control: AbstractControl): ValidationErrors | null {
    const fileName = (control.value as string); // Extract file name from input value
    console.log('File name:', fileName);
  
    if (!fileName) {
      console.log('File name not found');
      return { invalidFileName: true };
    }
  
    const filenameParts = fileName.split('.');
    const extension = filenameParts[filenameParts.length - 1].toLowerCase();
    console.log('Extension:', extension);
  
    if (extension !== 'pdf') {
      console.log('Invalid PDF format');
      return { invalidPdfFormat: true };
    }
  
    console.log('PDF file is valid');
    return null;
  }
  

  passwordFormatValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value as string;
    if (!password) {
      return { required: true };
    }
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[-+!@#$%^&*(),.?":{}|<>]/;
    if (!uppercaseRegex.test(password) || !digitRegex.test(password) || !specialCharRegex.test(password)) {
      return { invalidPasswordFormat: true };
    }
    return null;
  }
}
