import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { AssociationService } from 'src/app/services/association.service';
import { DonateurService } from 'src/app/services/donateur.service';

@Component({
  selector: 'app-ajouter-donateur-admin',
  templateUrl: './ajouter-donateur-admin.component.html',
  styleUrls: ['./ajouter-donateur-admin.component.css']
})
export class AjouterDonateurAdminComponent {


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

  constructor(private formBuilder: FormBuilder, public service: AdministrateurService, public serviceDonateur:DonateurService,public aService:AssociationService,
    private router: Router,private spinner:NgxSpinnerService) {}


  ngOnInit(): void {



    this.aFormGroup = this.formBuilder.group(
      {

        nom: ['', Validators.required],
        telephone: ['', Validators.required] ,
        prenom: ['', Validators.required],
        date_de_naissance: ['', [Validators.required, this.serviceDonateur.dateOfBirthValidator()]],
        email: ['', [Validators.required, Validators.email]],
        photo: [''],
        mdp: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), this.passwordFormatValidator]],
        mdp_confirmation: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
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

      const emailExists = await this.serviceDonateur.checkEmailExists(this.aFormGroup.value.email).toPromise();
      if (!emailExists) {
      console.log("Formulaire valide");

      this.spinner.show(); 

      const File = this.aFormGroup.value.photo;
      const photoDownloadUrl = await this.serviceDonateur.uploadPhoto(File);
      if (!photoDownloadUrl) {
        console.error('Failed to upload file.');
        return;
      }
      console.log(' file uploaded. Download URL:', photoDownloadUrl);


      const userData = {
        ...this.aFormGroup.value,
        photo: photoDownloadUrl
      };
     this.serviceDonateur.ajouterDonateur(userData);
      
      this.spinner.hide();
      this.aFormGroup.reset();
      this.showSuccessMessage=true;
      this.showErrorNotification=false;
      this.router.navigate(['/admin/ajouterDonateur/profil'],{ replaceUrl: true });

      } else  {
          this.showEmailExists=true;
      }
    } else {
      this.showErrorNotification = true;
      console.log("Formulaire invalide");
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

