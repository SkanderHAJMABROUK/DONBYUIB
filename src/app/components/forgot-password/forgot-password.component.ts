import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Log } from 'src/app/interfaces/log';
import { LogService } from 'src/app/services/log.service';
import { AssociationService } from 'src/app/services/association.service';
import { Router } from '@angular/router';
import { DonateurService } from 'src/app/services/donateur.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  protected aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;
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

  async sendVerificationEmail(){
    
  }

}
