import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CollecteService } from '../shared/collecte.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Collecte } from '../collecte';

@Component({
  selector: 'app-modifier-collecte',
  templateUrl: './modifier-collecte.component.html',
  styleUrls: ['./modifier-collecte.component.css']
})
export class ModifierCollecteComponent {


  constructor(private formBuilder: FormBuilder, public service: CollecteService, private router: Router, private route:ActivatedRoute) {}


  protected aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;
  showSuccessMessage: boolean = false;

  onLogoFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.aFormGroup.get('image')?.setValue(file);
  }
  
  collecte!:Collecte
  collecteId!:string

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.collecteId= params['id']; // Obtenir l'ID de l'association depuis les paramètres de l'URL
      
      this.service.getCollecteById(this.collecteId).subscribe(association => {
        if (association) {
          this.collecte = this.collecte; // Sauvegarder les données de l'association
          this.initializeForm(); // Initialiser le formulaire une fois que les données sont chargées
        } else {
          console.error('Aucune association trouvée avec cet ID :', this.collecteId);
          // Gérer le cas où aucune association n'est trouvée avec cet ID
        }
      });
    });
  }

  logoFileValidator(control: AbstractControl): ValidationErrors | null {
    const fileName = (control.value as string); // Extract file name from input value
    console.log('File name:', fileName);
  
    if (!fileName) {
      console.log('File name not found');
      return { invalidFileName: true };
    }
  
    const filenameParts = fileName.split('.');
    const extension = filenameParts[filenameParts.length - 1].toLowerCase();
    console.log('Extension:', extension);
  
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'svg'];
  
    if (!allowedExtensions.includes(extension)) {
      console.log('Invalid logo format');
      return { invalidLogoFormat: true };
    }
  
    console.log('Logo file is valid');
    return null;
  }


  initializeForm(): void {
    this.aFormGroup = this.formBuilder.group({
      nom: [this.collecte?.nom || '', Validators.required], // Remplir la description de l'association
      description: [this.collecte?.description || '', Validators.required], // Remplir la description de l'association
      montant: [this.collecte?.montant || '', Validators.required], // Remplir la description de l'association
      image: [this.collecte?.image || '', [Validators.required, this.logoFileValidator.bind(this)]], // Remplir le téléphone de l'association
      date_debut: [this.collecte?.date_debut || '', Validators.required], // Remplir la description de l'association
      date_fin: [this.collecte?.date_fin || '', Validators.required], // Remplir la description de l'association

    });
  }

 
  async onSubmit(): Promise<void>{
    console.log("Fonction onSubmit() appelée");
    if (this.aFormGroup.valid) {
      console.log("Formulaire valide");

      await this.service.modifierCollecte(this.collecteId, { ...this.aFormGroup.value })
        .then(() => {
          console.log('Données de la collecte modifiées avec succès dans Firebase Firestore.');
                    this.showSuccessMessage = true;

        })
        .catch(error => {
          console.error('Erreur lors de la modification des données de la collecte dans Firebase Firestore:', error);
        });
    } else {
      this.showErrorNotification = true;
      console.log("Formulaire invalide");
      // Afficher un message d'erreur ou effectuer d'autres actions pour gérer les erreurs de validation
    }
  }

 


}
