import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AssociationService } from '../shared/associationService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group({
      email: ['', Validators.required], 
      password: ['', Validators.required], 
      recaptcha: ['', Validators.required]
    });
  }

  constructor(private formBuilder : FormBuilder, private service:AssociationService , private route:Router){

  }

  siteKey: string = "6Leiq30pAAAAAAmGTamvErmeEBCejAKqB0gXdocv"; 

  password: string = '';
  showPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  protected aFormGroup!: FormGroup;
  showErrorNotification:boolean=false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.aFormGroup.valid) {
      const email = this.aFormGroup.get('email')?.value;
      const password = this.aFormGroup.get('password')?.value;

      this.service.getAssociationByEmailAndPassword(email, password).subscribe(
        (association) => {
          if (association) {
            this.service.nomAssociation = association.nom;
            this.service.connexion=true;
            this.route.navigate(['/login/profilAssociation',association.id]);
          } else {
            this.showErrorNotification = true;
            console.error('Aucune association trouvée avec cet e-mail et ce mot de passe.');
          }
        },
        (error) => {
          console.error('Erreur lors de la recherche de l\'association:', error);
        }
      );
    }
  }

}