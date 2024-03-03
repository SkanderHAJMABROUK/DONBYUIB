import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AssociationService } from '../shared/associationService.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

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

  constructor(private formBuilder : FormBuilder , private route:Router, public service:AssociationService){

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
      this.logIn();
    }
  }

  logIn(){
    const email = this.aFormGroup.get('email')?.value;
    const password = this.aFormGroup.get('password')?.value;

      this.service.logIn(email,password);
  }

}