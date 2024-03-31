import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { sha256 } from 'js-sha256';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { AssociationService } from 'src/app/services/association.service';

@Component({
  selector: 'app-ajouter-association-admin',
  templateUrl: './ajouter-association-admin.component.html',
  styleUrls: ['./ajouter-association-admin.component.css']
})
export class AjouterAssociationAdminComponent {



  password: string = '';
  passwordConfirmation: string = '';
  showPassword: boolean = false;
  showPasswordConfirmation: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;
  showSuccessMessage: boolean = false;
  showEmailExists: boolean = false;
  logoFile: File | null = null;
  idFile: File | null = null;

  constructor(private formBuilder: FormBuilder, public service: AssociationService, private router: Router,public serviceAdmin : AdministrateurService,
    private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group(
      {
        
        nom: ['', Validators.required],
        categorie: ['', Validators.required],
        description: ['', Validators.required],
        adresse: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        logo: ['', Validators.required],
        id_fiscale: ['', Validators.required],
        rib: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(20), this.ribValidator]],
        mdp: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), this.passwordFormatValidator]],
        mdp_confirmation: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      },
      {
        validators: this.passwordMatchValidator()
      }
    );
  }


  ribValidator = (control: FormControl): {[key: string]: any} | null => {
    const rib: string | null = control.value; // Assurez-vous que rib peut être null
    if (rib && rib.length === 20) { // Vérifiez si rib n'est pas null avant de vérifier sa longueur
      if (!this.checkRIB(rib)) {
        return { 'invalidRIB': true };
      }
    } else {
      return { 'invalidRIB': true }; // Retournez une erreur si rib est null ou n'a pas la longueur attendue
    }
    return null;
  }
  
  

  checkRIB(RIB: string): boolean {
    if (RIB.length === 20) {
        const cle: string = RIB.substring(18, 20);
        const ribf2: string = RIB.substring(0, 18) + "00";
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


  onLogoFileSelected(event: any) {
    this.logoFile = event.target.files[0];
  }
  
  onIdFileSelected(event: any) {
    this.idFile = event.target.files[0];
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmation(): void {
    this.showPasswordConfirmation = !this.showPasswordConfirmation;
  }

  async onSubmit(): Promise<void>{
    if (this.aFormGroup.valid && this.logoFile && this.idFile) {
      const emailExists = await this.service.checkEmailExists(this.aFormGroup.value.email).toPromise();

      if (!emailExists) {
        


      
      this.spinner.show();

      const logoDownloadUrl = await this.service.uploadLogo(this.logoFile);
      if (!logoDownloadUrl) {
        console.error('Failed to upload logo file.');
        return;
      }

      const idDownloadUrl = await this.service.uploadPDF(this.idFile);
      if (!idDownloadUrl) {
        console.error('Failed to upload ID file.');
        return;
      }

      const associationData = {
        ...this.aFormGroup.value,
        logo: logoDownloadUrl,
        id_fiscale: idDownloadUrl
      };

      this.serviceAdmin.addAssociation(associationData);
    
      this.spinner.hide();
      this.aFormGroup.reset();
      this.showSuccessMessage = true;
    } else {
      // Afficher un message d'erreur si l'e-mail existe déjà
      this.showEmailExists = true;
    }
    } else {
      this.showErrorNotification = true;
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

