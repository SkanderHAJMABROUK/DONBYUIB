import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-inscrire-association',
  templateUrl: './inscrire-association.component.html',
  styleUrls: ['./inscrire-association.component.css']
})
export class InscrireAssociationComponent implements OnInit{


  siteKey: string = "6Leiq30pAAAAAAmGTamvErmeEBCejAKqB0gXdocv"; // Site Key

  password: string = '';
  passwordConfirmation: string = '';
  showPassword: boolean = false;
  showPasswordConfirmation: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  protected aFormGroup!: FormGroup;

  constructor(private formBuilder : FormBuilder){

  }

  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group(
      {
        recaptcha: ['', Validators.required],
        nom_association: ['', Validators.required],
      description_association: ['', Validators.required],
      email_association: ['', [Validators.required, Validators.email]],
      num_association: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      logo_association: ['', Validators.required],
      idfiscale_association: ['', Validators.required],
      rib_association: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(20)]],
      pwd_association: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      pwd_confirmation: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      accept_terms: ['', Validators.requiredTrue]
      }
    )
  }

  

  

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmation(): void {
    this.showPasswordConfirmation = !this.showPasswordConfirmation;
  }

  onSubmit(): void {
    // Mettez ici la logique pour soumettre le formulaire, y compris la vérification du reCAPTCHA
    if (this.aFormGroup.valid) {
      console.log("Formulaire valide, reCAPTCHA validé !");
      // Soumettre le formulaire à votre backend ou effectuer d'autres actions
    } else {
      console.log("Formulaire invalide");
      // Afficher un message d'erreur ou effectuer d'autres actions pour gérer les erreurs de validation
    }
  }

}
