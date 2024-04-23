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
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  protected aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;
  showSuccessNotification: boolean = false;
  userType: string = '';

  constructor(private formBuilder : FormBuilder , private route: ActivatedRoute, public serviceAssociation:AssociationService, public serviceDonateur:DonateurService,
  private logService:LogService){}
    

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userType = params['userType'];
    });

    this.aFormGroup = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]], 
    });
  }

  onSubmit(){
    if (this.aFormGroup.valid) {
      const email = this.aFormGroup.get('email')?.value;

      if (this.userType === 'association') {
        this.serviceAssociation.getAssociationByEmail(email).subscribe(
          (association: any) => {
            if (association) {
              console.log('Email exists for association:', association);
              this.sendVerificationEmail(association.nom,association.id);
              this.showErrorNotification = false;
              this.showSuccessNotification=true;
            } else {
              console.log('Email does not exist for association:', email);
            }
          },
          (error) => {
            console.error('Error retrieving association by email:', error);
          }
        );
      } else {
        this.serviceDonateur.getDonateurByEmail(email).subscribe(
          (donateur: any) => {
            if (donateur) {
              console.log('Email exists for donor:', donateur);
              this.sendVerificationEmail(donateur.nom+''+donateur.prenom,donateur.id);
              this.showErrorNotification = false;
              this.showSuccessNotification=true;
            } else {
              console.log('Email does not exist for donor:', email);
            }
          },
          (error) => {
            console.error('Error retrieving donor by email:', error);
          }
        );
      }
    } else {
      this.showErrorNotification = true;
    }

  }

  async sendVerificationEmail(concerned:string,id:string){
    const token = this.generatePasswordResetToken();

    emailjs.init('_Y9fCqzL5ZcxWYmmg');

    emailjs.send('service_hc9gqua', 'template_9r1lijh', {
      from_name: "DonByUIB",
      to_name: concerned,
      reset_link: `http://localhost:4200/reset-password/${id}/${this.userType}/${token}`
    }).then(function (response) {
      console.log('Email sent successfully:', response);
    }, function (error) {
      console.error('Error sending email:', error);
    });
  }

  generatePasswordResetToken(): string {
    const tokenLength = 16;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < tokenLength; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }

}
