import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AssociationService } from 'src/app/services/association.service';
import { DonateurService } from 'src/app/services/donateur.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Association } from 'src/app/interfaces/association';
import { Donateur } from 'src/app/interfaces/donateur';
import { NgxSpinnerService } from 'ngx-spinner';
import { sha256 } from 'js-sha256';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faXmark=faXmark;
  showErrorNotification: boolean = false;
  showSuccessMessage: boolean = false;
  association!:Association;
  donateur!:Donateur;
  id!:string;
  isFormModified: boolean = false;
  aucunChangement: boolean = false;
  initialValues: any; 
  showPassword: boolean = false;
  showPasswordConfirmation: boolean = false;
  showNewPassword: boolean = false;
  aFormGroup!: FormGroup;


  constructor(private formBuilder: FormBuilder, 
    public associationService: AssociationService,
    public donateurService : DonateurService,
    private router: Router, 
    private route:ActivatedRoute, 
    private spinner:NgxSpinnerService,
    private firestore: AngularFirestore) {}


    ngOnInit():void{

      this.aFormGroup = this.formBuilder.group({
        old_password: ['', Validators.required],
        new_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), this.passwordFormatValidator]],
        confirm_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), this.passwordMatchValidator]]
      },
      {
        validators: this.passwordMatchValidator()
      });

      this.route.params.subscribe(params =>  {
        this.id = params['id'];
        this.associationService.getAssociationById(this.id).subscribe(association =>{
          if(association){
            this.association=association;
            console.log('Association',this.id);
          } else {
            this.donateurService.getDonateurById(this.id).subscribe(donateur =>{
              if(donateur){
                this.donateur=donateur;
                console.log('Donateur',this.id);
              }else {
                console.error('No object found with this ID:', this.id);
              }
            })
          }
        })
      })

      this.aFormGroup.valueChanges.subscribe(() => {
        this.isFormModified = !this.aFormGroup.pristine;
      });
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

    passwordMatchValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const passwordControl = control.get('new_password')!;
        const confirmPasswordControl = control.get('confirm_password')!;
    
        if (!passwordControl.value || !confirmPasswordControl.value) {
          return null;
        }
    
        return passwordControl.value !== confirmPasswordControl.value ? { 'passwordMismatch': true } : null;
      };
    }    

    togglePassword(): void {
      this.showPassword = !this.showPassword;
    }
  
    toggleNewPassword(): void {
      this.showNewPassword = !this.showNewPassword;
    }

    togglePasswordConfirmation(): void {
      this.showPasswordConfirmation = !this.showPasswordConfirmation;
    }

    onSubmit() {
      if (this.aFormGroup.valid) {
        this.spinner.show();
    
        if (this.association) {
          const hashedPassword: string = sha256(this.aFormGroup.value.old_password + this.association.salt).toString();
          if (this.association.mdp == hashedPassword && this.association.id) {
            const hashedNewPassword: string = sha256(this.aFormGroup.value.new_password + this.association.salt);
            this.updatePassword(this.association.id, hashedNewPassword, 'Association').then(() => {
              this.spinner.hide();
              this.aFormGroup.reset();
              this.showSuccessMessage=true;
            }).catch(error => {
              console.error('Erreur lors de la mise à jour du mot de passe :', error);
              this.spinner.hide();
            });
          } else {
            console.log('Erreur');
          }
        } else if (this.donateur) {

          const hashedPassword: string = sha256(this.aFormGroup.value.old_password + this.donateur.salt).toString();
          if (this.donateur.mdp == hashedPassword && this.donateur.id) {
            const hashedNewPassword: string = sha256(this.aFormGroup.value.new_password + this.donateur.salt);
            this.updatePassword(this.donateur.id, hashedNewPassword, 'Donateur').then(() => {
              this.spinner.hide();
              this.aFormGroup.reset();
              this.showSuccessMessage=true;
            }).catch(error => {
              console.error('Erreur lors de la mise à jour du mot de passe :', error);
              this.spinner.hide();
            });
          } else {
            console.log('Erreur');
          }

        }
      } else {
        this.showErrorNotification = true;
        console.log("Form is invalid");
      }
    }
    

    updatePassword(id: string, password: string, collection:string): Promise<void> {
      const documentRef = this.firestore.collection(collection).doc(id);
      return documentRef.update({ mdp: password });
    }
    

}
