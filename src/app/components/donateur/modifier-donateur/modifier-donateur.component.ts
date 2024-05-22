import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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


  constructor(private formBuilder: FormBuilder, public service: DonateurService, private router: Router, private route:ActivatedRoute,
    private spinner:NgxSpinnerService) {}


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
      adresse: [this.donateur.adresse],
      gouvernerat: [this.donateur.gouvernerat],
      telephone: [this.donateur.telephone],
    });
  }
  
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.service.uploadPhoto(file).then(downloadUrl => {
        this.aFormGroup.patchValue({
          photo: downloadUrl
        });
      }).catch(error => {
        console.error('Une erreur s\'est produite lors du téléchargement de la photo :', error);
      });
    }
  }
 
  onSubmit(){
    console.log("Fonction onSubmit() appelée");
    if (this.aFormGroup.valid) {
      console.log("Formulaire valide");

      this.service.modifierCompte( {id:this.donateurId, ...this.aFormGroup.value })
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

