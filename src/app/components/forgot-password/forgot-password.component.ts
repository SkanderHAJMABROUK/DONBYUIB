import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Log } from 'src/app/interfaces/log';
import { LogService } from 'src/app/services/log.service';
import { AssociationService } from 'src/app/services/association.service';
import { Router } from '@angular/router';
import { DonateurService } from 'src/app/services/donateur.service';
import { ActivatedRoute } from '@angular/router';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  protected aFormGroup!: FormGroup;
  invalidEmail: boolean = false;
  showErrorNotification: boolean = false;
  showSuccessNotification: boolean = false;
  userType: string = '';
  isButtonDisabled: boolean = false;
  resendCountdown: string = '';
  resendInterval: any;
  resendDelayInSeconds: number = 120; // 2 minutes

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public serviceAssociation: AssociationService,
    public serviceDonateur: DonateurService,
    private logService: LogService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userType = params['userType'];
    });

    this.aFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.aFormGroup.valid) {
      const email = this.aFormGroup.get('email')?.value;

      if (this.userType === 'association') {
        this.serviceAssociation.getAssociationByEmail(email).subscribe(
          (association: any) => {
            if (association) {
              console.log('Email exists for association:', association);
              this.sendVerificationEmail(association.nom, association.id);
              this.showErrorNotification = false;
              this.showSuccessNotification = true;
              this.isButtonDisabled = true;
              this.startResendCountdown();
            } else {
              console.log('Email does not exist for association:', email);
              this.showErrorNotification = true;
              this.invalidEmail = false;
            }
          },
          (error) => {
            console.error('Error retrieving association by email:', error);
          },
        );
      } else {
        this.serviceDonateur.getDonateurByEmail(email).subscribe(
          (donateur: any) => {
            if (donateur) {
              console.log('Email exists for donor:', donateur);
              this.sendVerificationEmail(
                donateur.nom + ' ' + donateur.prenom,
                donateur.id,
              );
              this.showErrorNotification = false;
              this.showSuccessNotification = true;
              this.isButtonDisabled = true;
              this.startResendCountdown();
            } else {
              console.log('Email does not exist for donor:', email);
              this.showErrorNotification = true;
              this.invalidEmail = false;
            }
          },
          (error) => {
            console.error('Error retrieving donor by email:', error);
          },
        );
      }
    } else {
      this.invalidEmail = true;
    }
  }

  async sendVerificationEmail(concerned: string, id: string) {
    const token = this.generatePasswordResetToken();

    emailjs.init('_Y9fCqzL5ZcxWYmmg');

    emailjs
      .send('service_hc9gqua', 'template_9r1lijh', {
        from_name: 'DonByUIB',
        to_name: concerned,
        to_email: this.aFormGroup.get('email')?.value,
        reset_link: `https://localhost:4200/reset-password/${id}/${this.userType}/${token}`,
      })
      .then(
        function (response) {
          console.log('Email sent successfully:', response);
        },
        function (error) {
          console.error('Error sending email:', error);
        },
      );
  }

  generatePasswordResetToken(): string {
    const tokenLength = 16;
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < tokenLength; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }

  startResendCountdown() {
    let count = this.resendDelayInSeconds;
    this.resendInterval = setInterval(() => {
      const minutes = Math.floor(count / 60);
      const seconds = count % 60;
      this.resendCountdown = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      if (count <= 0) {
        clearInterval(this.resendInterval);
        this.isButtonDisabled = false;
        this.resendCountdown = '';
      } else {
        count--;
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.resendInterval);
  }
}
