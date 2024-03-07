import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AssociationService } from 'src/app/services/associationService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Association } from 'src/app/interfaces/association';
@Component({
  selector: 'app-modifier-association',
  templateUrl: './modifier-association.component.html',
  styleUrls: ['./modifier-association.component.css']
})
export class ModifierAssociationComponent {

  password: string = '';
  showPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  protected aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;
  showSuccessMessage: boolean = false;


  constructor(private formBuilder: FormBuilder, public service: AssociationService, private router: Router, private route:ActivatedRoute) {}


  association!:Association
  associationId!:string

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.associationId= params['id']; // Obtenir l'ID de l'association depuis les paramètres de l'URL
      
      this.service.getAssociationById(this.associationId).subscribe(association => {
        if (association) {
          this.association = association; // Sauvegarder les données de l'association
          this.initializeForm(); // Initialiser le formulaire une fois que les données sont chargées
        } else {
          console.error('Aucune association trouvée avec cet ID :', this.associationId);
          // Gérer le cas où aucune association n'est trouvée avec cet ID
        }
      });
    });
  }

  initializeForm(): void {
    this.aFormGroup = this.formBuilder.group({
      description: [this.association?.description || '', Validators.required], // Remplir la description de l'association
      email: [this.association?.email || '', [Validators.required, Validators.email]], // Remplir l'email de l'association
      telephone: [this.association?.telephone || '', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]], // Remplir le téléphone de l'association
      rib: [this.association?.rib || '', [Validators.required, Validators.minLength(20), Validators.maxLength(20)]] // Remplir le RIB de l'association
    });
  }

  
 
  async onSubmit(): Promise<void>{
    console.log("Fonction onSubmit() appelée");
    if (this.aFormGroup.valid) {
      console.log("Formulaire valide");

      await this.service.modifierAssociation(this.associationId, { ...this.aFormGroup.value })
        .then(() => {
          console.log('Données de l\'association modifiées avec succès dans Firebase Firestore.');
                    this.showSuccessMessage = true;
                    window.location.reload();

        })
        .catch(error => {
          console.error('Erreur lors de la modification des données de l\'association dans Firebase Firestore:', error);
        });
    } else {
      this.showErrorNotification = true;
      console.log("Formulaire invalide");
      // Afficher un message d'erreur ou effectuer d'autres actions pour gérer les erreurs de validation
    }
  }

 

  
  
 
}
