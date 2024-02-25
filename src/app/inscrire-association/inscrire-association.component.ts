import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthentificationService } from '../shared/authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscrire-association',
  templateUrl: './inscrire-association.component.html',
  styleUrls: ['./inscrire-association.component.css']
})
export class InscrireAssociationComponent implements OnInit{

  siteKey: string = "6Leiq30pAAAAAAmGTamvErmeEBCejAKqB0gXdocv"; // Site Key

  password: string = '';
  passwordConfirmation: string = '';
  showPassword: boolean = false;
  showPasswordConfirmation: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  protected aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;

  constructor(private formBuilder : FormBuilder, public service:AuthentificationService,private router: Router){}

  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group(
      {
        recaptcha: ['', Validators.required],
        nom_association: ['', Validators.required],
        description_association: ['', Validators.required],
        email_association: ['', [Validators.required, Validators.email]],
        num_association: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        logo_association: ['', Validators.required],
        idfiscale_association: ['', Validators.required],
        rib_association: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(20)]],
        pwd_association: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
        pwd_confirmation: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
        accept_terms: ['', Validators.requiredTrue]
      },
      {
        validators: this.passwordMatchValidator()
      }
    )
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmation(): void {
    this.showPasswordConfirmation = !this.showPasswordConfirmation;
  }
  showSuccessMessage: boolean = false;


  onSubmit(): void {
    console.log("Fonction onSubmit() appelée");
    if (this.aFormGroup.valid) {
      console.log("Formulaire valide, reCAPTCHA validé !");
      
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
      const passwordControl = control.get('pwd_association')!;
      const confirmPasswordControl = control.get('pwd_confirmation')!;
      
      if (!passwordControl.value || !confirmPasswordControl.value) {
        return null;
      }
  
      return passwordControl.value !== confirmPasswordControl.value ? { 'passwordMismatch': true } : null;
    };
  }
  
  
  
}
