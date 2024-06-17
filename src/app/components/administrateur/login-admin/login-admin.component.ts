import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { sha256 } from 'js-sha256';
import { Log } from 'src/app/interfaces/log';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css'],
})
export class LoginAdminComponent {
  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required],
      login: ['', Validators.required],
      mdp: ['', Validators.required],
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    public service: AdministrateurService,
    private logService: LogService,
  ) {}

  siteKey: string = '6Leiq30pAAAAAAmGTamvErmeEBCejAKqB0gXdocv';

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
      this.showErrorNotification = false;
    } else {
      this.showErrorNotification = true;
    }
  }

  logIn() {
    const login = this.aFormGroup.get('login')?.value;
    const mdp = this.aFormGroup.get('mdp')?.value;

    this.service.getAdminSaltByLogin(login).subscribe(
      (salt: string | undefined) => {
        if (salt) {
          console.log('Salt found for login:', login, 'is', salt);
          const hashedPassword = sha256(mdp + salt);

          this.service
            .logIn(login, hashedPassword)
            .subscribe((loggedIn: boolean) => {
              if (loggedIn) {
                let message: string = `Tentative de connexion réussie de l'admin avec le login ${login}`;
                this.logSignin(message);
              } else {
                let message: string = `Tentative de connexion échouée de l'admin avec le login ${login}`;
                this.logSignin(message);
              }
            });
        } else {
          // Gérer le cas où le sel n'est pas trouvé pour l'email donné
          console.error('Salt not found for login:', login);
          this.service.showErrorNotification = true;
        }
      },
      (error) => {
        console.error('Error retrieving salt by email:', error);
      },
    );
  }

  logSignin(message: string): void {
    const newLog: Log = {
      date: new Date(), // Current date
      message: message, // Message for the log
    };
    this.logService.addLog(newLog).subscribe(
      (response) => {
        console.log('Log added successfully:', response);
        // Handle success
      },
      (error) => {
        console.error('Error adding log:', error);
        // Handle error
      },
    );
  }
}
