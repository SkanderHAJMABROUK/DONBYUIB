import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AdministrateurService } from 'src/app/services/administrateur.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {



  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required],
      login: ['', Validators.required], 
      mdp: ['', Validators.required],
    });
  }

  constructor(private formBuilder : FormBuilder , private route:Router, public service:AdministrateurService
   ){


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

      this.logIn()
      this.showErrorNotification = false;
    } else {
      this.showErrorNotification = true;
    }

  }

  logIn() {
    const login = this.aFormGroup.get('login')?.value;
    const mdp = this.aFormGroup.get('mdp')?.value;

    if (login && mdp) {
      this.service.logIn(login, mdp).subscribe(success => {
        if (success) {
          // Connexion réussie, vous pouvez rediriger l'utilisateur vers la page appropriée
          console.log('Connexion réussie !');
        } else {
          // Connexion échouée, affichez un message d'erreur à l'utilisateur
          console.error('Connexion échouée. Veuillez vérifier vos informations de connexion.');
        }
      });
    } else {
      console.error('Veuillez remplir tous les champs.');
    }
  }

  

}
