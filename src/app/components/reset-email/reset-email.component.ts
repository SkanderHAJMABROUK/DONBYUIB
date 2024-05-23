import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Association } from 'src/app/interfaces/association';
import { Donateur } from 'src/app/interfaces/donateur';
import { AssociationService } from 'src/app/services/association.service';
import { DonateurService } from 'src/app/services/donateur.service';
import emailjs from '@emailjs/browser';
import { from } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-email',
  templateUrl: './reset-email.component.html',
  styleUrls: ['./reset-email.component.css']
})
export class ResetEmailComponent implements OnInit {
  aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;
  isFormModified: boolean = false;
  association!: Association;
  donateur!: Donateur;
  id!: string;
  codeOtp!: string;
  remainingAttempts: number = 3;
  codeMismatch: boolean = false;
  codeSent: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public associationService: AssociationService,
    public donateurService: DonateurService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      codeOtp: ['']
    });

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.associationService.getAssociationById(this.id).subscribe(association => {
        if (association) {
          this.association = association;
        } else {
          this.donateurService.getDonateurById(this.id).subscribe(donateur => {
            if (donateur) {
              this.donateur = donateur;
            } else {
              console.error('No object found with this ID:', this.id);
            }
          });
        }
      });
    });

    this.aFormGroup.valueChanges.subscribe(() => {
      this.isFormModified = !this.aFormGroup.pristine;
    });
  }

  verifierEmail() {
    if (this.aFormGroup.get('email')?.valid) {
      this.codeSent = true;
      this.sendVerificationEmail();
    } else {
      this.showErrorNotification = true;
    }
  }

  updateEmail() {
    if (this.checkEmail()) {
      const newEmail = this.aFormGroup.value.email;
      this.spinner.show();

      if (this.association) {
        const updateObservable = from(this.associationService.updateAssociationField(this.id, 'email', newEmail));
        updateObservable.subscribe(
          () => {
            this.spinner.hide();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Votre adresse email a été mise à jour avec succès',
              showConfirmButton: false,
              timer: 1500
            });
            window.location.reload(); 
          },
          error => {
            this.spinner.hide();
            console.error('Error updating association email:', error);
            this.showErrorNotification = true;
          }
        );
      } else if (this.donateur) {
        const updateObservable = from(this.donateurService.updateDonateurField(this.id, 'email', newEmail));
        updateObservable.subscribe(
          () => {
            this.spinner.hide();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Votre adresse email a été mise à jour avec succès',
              showConfirmButton: false,
              timer: 1500
            });
            window.location.reload(); 
          },
          error => {
            this.spinner.hide();
            console.error('Error updating donateur email:', error);
          }
        );
      } else {
        this.spinner.hide();
        console.error('No association or donateur found for update.');
        this.showErrorNotification = true;
      }
    } else {
      this.codeMismatch = true;
      this.remainingAttempts--;
      if(this.remainingAttempts==0){
        this.codeSent = false;
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'Limite de tentatives atteinte. Veuillez réessayer!',
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  }

  async sendVerificationEmail() {
    this.codeOtp = this.associationService.genererCodeOTP().toString();

    emailjs.init('_Y9fCqzL5ZcxWYmmg');

    emailjs.send('service_hc9gqua', 'template_c1bhstr', {
      from_name: "DonByUIB",
      to_name: this.aFormGroup.value.nom,
      code_otp: this.codeOtp,
      to_email: this.aFormGroup.value.email
    }).then(() => {
      console.log('Verification email sent successfully.');
    }).catch((error) => {
      console.error('Error sending verification email:', error);
    });
  }

  checkEmail(): boolean {
    const enteredCode = String(this.aFormGroup.get('codeOtp')?.value); // corrected to 'codeOtp'
    return enteredCode === this.codeOtp;
  }

}