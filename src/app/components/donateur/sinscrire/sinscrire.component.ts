import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { DonateurService } from '../../../services/donateur.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sinscrire',
  templateUrl: './sinscrire.component.html',
  styleUrls: ['./sinscrire.component.css']
})
export class SinscrireComponent implements OnInit{

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


  constructor(private formBuilder: FormBuilder, public service: DonateurService, 
    private router: Router,private spinner:NgxSpinnerService) {}

  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group(
      {
        recaptcha: ['', Validators.required],

        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        date_de_naissance: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        photo: ['', Validators.required],
        mdp: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), this.passwordFormatValidator]],
        mdp_confirmation: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
        accept_terms: ['', Validators.requiredTrue]
      },
      {
        validators: this.passwordMatchValidator()
      }
    );
  }

  onPhotoFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.aFormGroup.get('photo')?.setValue(file);
    console.log('Le fichier est ', file.name);
  }
  

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmation(): void {
    this.showPasswordConfirmation = !this.showPasswordConfirmation;
  }


  async onSubmit(): Promise<void>{
    console.log("Fonction onSubmit() appelée");
    if (this.aFormGroup.valid) {

      console.log("Formulaire valide, reCAPTCHA validé !");

      this.spinner.show(); // Afficher le spinner

      // Upload logo file
      const File = this.aFormGroup.value.photo;
      const PhotoDownloadUrl = await this.service.uploadPhoto(File);
      if (!PhotoDownloadUrl) {
        console.error('Failed to upload file.');
        // Handle error appropriately, e.g., show error message to user
        return;
      }
      console.log(' file uploaded. Download URL:', PhotoDownloadUrl);

     console.log(this.aFormGroup.value.date_de_naissance)
      this.service.ajouterDonateur({...this.aFormGroup.value,
        photo: PhotoDownloadUrl})
        .then(() => {
          this.spinner.hide();
          console.log('Données du donateur ajoutées avec succès dans Firebase Firestore.');
          // Réinitialiser le formulaire après l'ajout des données
          this.aFormGroup.reset();
          // this.router.navigate(['/demande-association']);
          this.showSuccessMessage = true;
          this.showErrorNotification=false;
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout des données du donateur dans Firebase Firestore:', error);
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
