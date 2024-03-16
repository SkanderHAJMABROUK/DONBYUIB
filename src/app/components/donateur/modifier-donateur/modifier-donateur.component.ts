import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Donateur } from 'src/app/interfaces/donateur';
import { DonateurService } from 'src/app/services/donateur.service';

@Component({
  selector: 'app-modifier-donateur',
  templateUrl: './modifier-donateur.component.html',
  styleUrls: ['./modifier-donateur.component.css']
})
export class ModifierDonateurComponent {



  protected aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;
  showSuccessMessage: boolean = false;


  constructor(private formBuilder: FormBuilder, public service: DonateurService, private router: Router, private route:ActivatedRoute) {}


  donateur!:Donateur
  donateurId!:string

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.donateurId = params['id']; 
      this.service.getDonateurById(this.donateurId).subscribe(donateur => {
        if (donateur) {
          this.donateur = donateur; 
          console.log(donateur)
          this.initializeForm(); 
        } else {
          console.error('Aucun donateur trouvé avec cet ID :', this.donateurId);
        }
      });
    });
  }
  

  initializeForm(): void {
    this.aFormGroup = this.formBuilder.group({
      nom:[this.donateur?.nom || '', Validators.required], 
      prenom: [this.donateur?.prenom || '', Validators.required], 
      date_de_naissance: [this.donateur.date_de_naissance instanceof Date ? this.donateur.date_de_naissance.toISOString().split('T')[0] : this.donateur.date_de_naissance, [Validators.required, this.service.dateOfBirthValidator()]],
      photo: [this.donateur?.photo || '', Validators.required], 
      email: [this.donateur?.email || '', [Validators.required, Validators.email]], 
    });
  }

    
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.aFormGroup.patchValue({
          photo: reader.result // Définir la valeur du champ 'photo' avec l'URL de données
        });
      };
      reader.readAsDataURL(file); // Convertit le contenu de l'image en URL de données
    }
  }
  
  
 
  onSubmit(){
    console.log("Fonction onSubmit() appelée");
    if (this.aFormGroup.valid) {
      console.log("Formulaire valide");

      this.service.modifierCompte(this.donateurId, { ...this.aFormGroup.value })
        .then(() => {
          console.log('Données du donateur modifiées avec succès dans Firebase Firestore.');
                    this.showSuccessMessage = true;
                    // window.location.reload();
                    this.router.navigate(['login/profilDonateur/:id',this.donateurId]);

        })
        .catch(error => {
          console.error('Erreur lors de la modification des données du donateur dans Firebase Firestore:', error);
        });
    } else {
      this.showErrorNotification = true;
      console.log("Formulaire invalide");
    }
  }

 

  
  
 
}

