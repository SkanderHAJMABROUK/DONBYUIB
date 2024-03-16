import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AssociationService } from 'src/app/services/associationService.service';
import { Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import { Log } from 'src/app/interfaces/log';
import { LogService } from 'src/app/services/log.service';

import { DonateurService } from 'src/app/services/donateur.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required],
      email: ['', Validators.required], 
      password: ['', Validators.required],
      userType:['',Validators.required],
    });
  }

  constructor(private formBuilder : FormBuilder , private route:Router, public serviceAssociation:AssociationService, public serviceDonateur:DonateurService,
    private logService:LogService){


  }

  siteKey: string = "6Leiq30pAAAAAAmGTamvErmeEBCejAKqB0gXdocv"; 

  password: string = '';
  showPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  protected aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;
  

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.aFormGroup.valid) {

      if (this.aFormGroup.get('userType')?.value === 'association') {
        this.logInAssociation();
      } else {
        this.logInDonateur();
      }
      this.showErrorNotification = false;
    } else {
      this.showErrorNotification = true;
    }

  }

  logInAssociation() {
    const email = this.aFormGroup.get('email')?.value;
    const password = this.aFormGroup.get('password')?.value;

    // Récupérer le sel de l'association par email
    this.serviceAssociation.getAssociationSaltByEmail(email).subscribe(
      (salt: string | undefined) => {
        if (salt) {
          // Hasher le mot de passe avec le sel
          console.log(salt)
          const hashedPassword = sha256(password + salt);        

          // Appeler la méthode de connexion avec l'email et le mot de passe haché

          this.serviceAssociation.logIn(email, hashedPassword).subscribe((loggedIn: boolean) => {
            if (loggedIn) {
              let message: string = `Tentative de connexion réussie de l'association avec l'email ${email}`;
              this.logSignin(message);
            } else {
              let message: string = `Tentative de connexion échouée de l'association avec l'email ${email}`;
              this.logSignin(message);
            }
          });

        } else {
          // Gérer le cas où le sel n'est pas trouvé pour l'email donné
          console.error('Salt not found for email:', email);
          this.serviceAssociation.showErrorNotification = true;
        }
      },
      (error) => {
        console.error('Error retrieving salt by email:', error);
      }
    );
  }

  
  logInDonateur() {
    const email = this.aFormGroup.get('email')?.value;
    const password = this.aFormGroup.get('password')?.value;
    
    // Récupérer le sel de l'association par email
    this.serviceDonateur.getDonateurSaltByEmail(email).subscribe(
      (salt: string | undefined) => {
        if (salt) {
          // Hasher le mot de passe avec le sel
          console.log(salt)
          const hashedPassword = sha256(password + salt);        

          // Appeler la méthode de connexion avec l'email et le mot de passe haché

          this.serviceDonateur.logIn(email, hashedPassword).subscribe((loggedIn: boolean) => {
            if (loggedIn) {
              let message: string = `Tentative de connexion réussie de l'utilisateur avec l'email ${email}`;
              this.logSignin(message);
            } else {
              let message: string = `Tentative de connexion échouée de l'utilisateur avec l'email ${email}`;
              this.logSignin(message);
            }
          });

        } else {
          // Gérer le cas où le sel n'est pas trouvé pour l'email donné
          console.error('Salt not found for email:', email);
          this.serviceDonateur.showErrorNotification = true;
        }
      },
      (error) => {
        console.error('Error retrieving salt by email:', error);
      }
    );
    
  }

  logSignin(message:string): void {
    const newLog: Log = {
      date: new Date(), // Current date
      message: message // Message for the log
    };
    this.logService.addLog(newLog).subscribe(
      response => {
        console.log('Log added successfully:', response);
        // Handle success
      },
      error => {
        console.error('Error adding log:', error);
        // Handle error
      }
    );
  }
  

}