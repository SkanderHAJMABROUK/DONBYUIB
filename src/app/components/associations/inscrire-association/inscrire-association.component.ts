import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AssociationService } from 'src/app/services/associationService.service';
import { Association } from 'src/app/interfaces/association';
import emailjs from '@emailjs/browser';

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

  onLogoFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.aFormGroup.get('logo')?.setValue(file);
  }
  
  onIdFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.aFormGroup.get('id_fiscale')?.setValue(file);
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

      this.sendVerificationEmail();

      console.log("Formulaire valide, reCAPTCHA validé !");
      
      // Upload logo file
      const logoFile = this.aFormGroup.value.logo;
      const logoDownloadUrl = await this.service.uploadLogo(logoFile);
      if (!logoDownloadUrl) {
        console.error('Failed to upload logo file.');
        // Handle error appropriately, e.g., show error message to user
        return;
      }
      console.log('Logo file uploaded. Download URL:', logoDownloadUrl);

      // Upload ID file
      const idFile = this.aFormGroup.value.id_fiscale;
      const idDownloadUrl = await this.service.uploadPDF(idFile);
      if (!idDownloadUrl) {
        console.error('Failed to upload ID file.');
        // Handle error appropriately, e.g., show error message to user
        return;
      }
      console.log('ID file uploaded. Download URL:', idDownloadUrl);

      console.log(this.aFormGroup.value.nom);

      localStorage.setItem('associationData', JSON.stringify({...this.aFormGroup.value,
        logo: logoDownloadUrl,
        id_fiscale: idDownloadUrl}));

          this.aFormGroup.reset();
          this.showSuccessMessage = true;
          this.router.navigate(['/inscrireAssociation/email']);

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

  // Code de la partie mailing de vérification
  async sendVerificationEmail(){
    
    let codeOtp : string = this.service.genererCodeOTP().toString();
    localStorage.setItem('code',codeOtp);

    emailjs.init('_Y9fCqzL5ZcxWYmmg');
    emailjs.send('service_hc9gqua','template_c1bhstr',{
      from_name: "DonByUIB",
      to_name: this.aFormGroup.value.nom,
      code_otp: codeOtp,
      to_email:this.aFormGroup.value.email
    });
    alert('Jek mail!');
    this.aFormGroup.reset;
  }

}
