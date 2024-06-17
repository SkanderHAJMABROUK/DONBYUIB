import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormControl,
} from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AssociationService } from 'src/app/services/association.service';
import { ActivatedRoute, Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import { Log } from 'src/app/interfaces/log';
import { LogService } from 'src/app/services/log.service';
import { DonateurService } from 'src/app/services/donateur.service';
import { Association } from 'src/app/interfaces/association';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Donateur } from 'src/app/interfaces/donateur';

@Component({
  selector: 'app-reset-forgotten-password',
  templateUrl: './reset-forgotten-password.component.html',
  styleUrls: ['./reset-forgotten-password.component.css'],
})
export class ResetForgottenPasswordComponent {
  password: string = '';
  showPassword: boolean = false;
  showPasswordConfirmation: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  protected aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;
  showSuccessMessage: boolean = false;
  userType: string = '';
  userId: string = '';
  association!: Association;
  donateur!: Donateur;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public serviceAssociation: AssociationService,
    public serviceDonateur: DonateurService,
    private logService: LogService,
    private spinner: NgxSpinnerService,
    private firestore: AngularFirestore,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      this.userType = params['userType'];
      console.log('id', this.userId);
      console.log('type', this.userType);

      if (this.userType === 'association') {
        this.serviceAssociation
          .getAssociationById(this.userId)
          .subscribe((association) => {
            if (association) {
              this.association = association;
            }
          });
      } else if (this.userType === 'donateur') {
        this.serviceDonateur
          .getDonateurById(this.userId)
          .subscribe((donateur) => {
            if (donateur) {
              this.donateur = donateur;
            }
          });
      }
    });

    this.aFormGroup = this.formBuilder.group(
      {
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            this.passwordFormatValidator,
          ],
        ],
      },
      {
        validators: this.passwordMatchValidator(),
      },
    );
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmation(): void {
    this.showPasswordConfirmation = !this.showPasswordConfirmation;
  }

  onSubmit() {
    if (this.aFormGroup.valid) {
      console.log('Form is valid.');
      this.spinner.show();

      const passwordValue = this.aFormGroup.value.password;

      if (this.userType === 'association' && this.association.id) {
        const hashedPassword: string = sha256(
          passwordValue + this.association.salt,
        ).toString();
        this.updatePassword(this.association.id, hashedPassword, 'Association')
          .then(() => {
            console.log('Password updated successfully for association.');
            this.spinner.hide();
            this.aFormGroup.reset();
            this.showSuccessMessage = true;
          })
          .catch((error) => {
            console.error('Error updating password:', error);
            this.spinner.hide();
            // Handle error display or notification here
          });
      } else if (this.userType === 'donateur' && this.donateur.id) {
        const hashedPassword: string = sha256(
          passwordValue + this.donateur.salt,
        ).toString();
        this.updatePassword(this.donateur.id, hashedPassword, 'Donateur')
          .then(() => {
            console.log('Password updated successfully for donateur.');
            this.spinner.hide();
            this.aFormGroup.reset();
            this.showSuccessMessage = true;
          })
          .catch((error) => {
            console.error('Error updating password:', error);
            this.spinner.hide();
            // Handle error display or notification here
          });
      } else {
        console.log('Erreur, utilisateur introuvable', this.userType);
        // Handle error display or notification here
      }
    } else {
      this.showErrorNotification = true;
      console.log('Form is invalid.');
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl = control.get('password')!;
      const confirmPasswordControl = control.get('confirmPassword')!;

      if (!passwordControl.value || !confirmPasswordControl.value) {
        return null;
      }

      return passwordControl.value !== confirmPasswordControl.value
        ? { passwordMismatch: true }
        : null;
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
    if (
      !uppercaseRegex.test(password) ||
      !digitRegex.test(password) ||
      !specialCharRegex.test(password)
    ) {
      return { invalidPasswordFormat: true };
    }
    return null;
  }

  updatePassword(
    id: string,
    password: string,
    collection: string,
  ): Promise<void> {
    const documentRef = this.firestore.collection(collection).doc(id);
    return documentRef
      .update({ mdp: password })
      .then(() => {
        console.log('Password updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating password:', error);
      });
  }
}
