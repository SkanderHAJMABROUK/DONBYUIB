import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AssociationService } from '../shared/associationService.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group(
      {
        recaptcha: ['', Validators.required]
      }
    )
  }

  constructor(private formBuilder : FormBuilder, private service:AssociationService){

  }

  siteKey: string = "6Leiq30pAAAAAAmGTamvErmeEBCejAKqB0gXdocv"; 

  password: string = '';
  showPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  protected aFormGroup!: FormGroup;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }


  onSubmit(): void {

    if (this.aFormGroup.valid) {
      console.log("Formulaire valide, reCAPTCHA validé !");
    } else {
      console.log("Formulaire invalide");
    }
    
  }

}