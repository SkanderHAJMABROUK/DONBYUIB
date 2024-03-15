import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AssociationService } from 'src/app/services/associationService.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { sha256 } from 'js-sha256';
import { NGXLogger } from 'ngx-logger';
import { Log } from 'src/app/interfaces/log';
import { LogService } from 'src/app/services/log.service';


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
      password: ['', Validators.required]
    });
  }

  constructor(private formBuilder : FormBuilder , private route:Router, public service:AssociationService,
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
      this.logIn();
      this.showErrorNotification=false;
    } else {this.showErrorNotification = true;}
    
  }

  logIn() {
    const email = this.aFormGroup.get('email')?.value;
    const password = this.aFormGroup.get('password')?.value;

    // Récupérer le sel de l'association par email
    this.service.getAssociationSaltByEmail(email).subscribe(
      (salt: string | undefined) => {
        if (salt) {
          // Hasher le mot de passe avec le sel
          console.log(salt)
          const hashedPassword = sha256(password + salt);        

          // Appeler la méthode de connexion avec l'email et le mot de passe haché
          this.service.logIn(email, hashedPassword).subscribe((loggedIn: boolean) => {
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
          this.service.showErrorNotification = true;
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