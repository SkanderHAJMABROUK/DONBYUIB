import { Component } from '@angular/core';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-inscrire-association',
  templateUrl: './inscrire-association.component.html',
  styleUrls: ['./inscrire-association.component.css']
})
export class InscrireAssociationComponent {

  password: string = '';
  passwordConfirmation: string = '';
  showPassword: boolean = false;
  showPasswordConfirmation: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor() {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmation(): void {
    this.showPasswordConfirmation = !this.showPasswordConfirmation;
  }
}
