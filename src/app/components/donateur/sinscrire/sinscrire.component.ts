import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { DonateurService } from '../../../services/donateur.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { sha256 } from 'js-sha256';
import emailjs from '@emailjs/browser';
import { AssociationService } from 'src/app/services/associationService.service';

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
  showEmailExists: boolean = false;

  constructor(private formBuilder: FormBuilder, public service: DonateurService, 
    private router: Router,private spinner:NgxSpinnerService, private aService:AssociationService) {}


  ngOnInit(): void {

    // this.authService.authState.subscribe((user) => {
    //   this.user = user;
    //   this.loggedIn = (user != null);
    // });

    this.aFormGroup = this.formBuilder.group(
      {
        recaptcha: ['', Validators.required],

        nom: ['', Validators.required],
        telephone: ['', Validators.required] ,
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

    if (this.aFormGroup.valid) {

      const emailExists = await this.service.checkEmailExists(this.aFormGroup.value.email).toPromise();
      if (emailExists) {
      console.log("Formulaire valide, reCAPTCHA validé !");

      this.spinner.show(); // Afficher le spinner
      this.sendVerificationEmail();

      // Upload logo file
      const File = this.aFormGroup.value.photo;
      const photoDownloadUrl = await this.service.uploadPhoto(File);
      if (!photoDownloadUrl) {
        console.error('Failed to upload file.');
        // Handle error appropriately, e.g., show error message to user
        return;
      }
      console.log(' file uploaded. Download URL:', photoDownloadUrl);


      const userData = {
        ...this.aFormGroup.value,
        photo: photoDownloadUrl
      };

      localStorage.setItem('type' , 'donateur');
      localStorage.setItem('emailDonateur', userData.email);

      localStorage.setItem('userData', JSON.stringify(userData));
      this.spinner.hide();
      this.aFormGroup.reset();
      this.showSuccessMessage=true;
      this.showErrorNotification=false;
      this.router.navigate(['/sinscrire/email'],{ replaceUrl: true });

      } else  {
          this.showEmailExists=true;
      }
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

  async sendVerificationEmail() {

    let codeOtp: string = this.aService.genererCodeOTP().toString();
    let salt: string = this.aService.generateSalt(16);
    let hashedCodeOtp: string = sha256(codeOtp+salt);  

    localStorage.setItem('codeOtp', hashedCodeOtp);
    localStorage.setItem('saltOtp',salt);
  
    emailjs.init('_Y9fCqzL5ZcxWYmmg');

    emailjs.send('service_hc9gqua', 'template_c1bhstr', {
      from_name: "DonByUIB",
      to_name: this.aFormGroup.value.nom,
      code_otp: codeOtp,
      to_email: this.aFormGroup.value.email
    });

  }
}
