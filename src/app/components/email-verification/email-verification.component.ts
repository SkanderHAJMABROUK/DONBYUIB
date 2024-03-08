import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AssociationService } from 'src/app/services/associationService.service';
import { Router } from '@angular/router';
import Swal from  'sweetalert2';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public service: AssociationService, private router: Router) {}

  protected verificationForm!: FormGroup;
  verified: boolean = false;
  remainingAttempts: number = 3;
  codeMismatch: boolean = false;

  ngOnInit(): void {
    this.verificationForm = this.formBuilder.group({
      codeOTP: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  checkEmail() {
    const enteredCode = this.verificationForm.get('codeOTP')?.value;
    const storedCode = localStorage.getItem('code');
    console.log(enteredCode);
    console.log(storedCode);

    if (enteredCode === storedCode) {
      // Code matches, proceed with whatever action you need
      console.log('Code matched!');
      this.verified = true;

      Swal.fire({
        icon: "success",
        title: "Votre demande d'habilitation est en cours de validation. Un email vous sera envoyé dès l'approbation de la demande!",
        showConfirmButton: false,
        timer: 10000
      });

      const associationData = JSON.parse(localStorage.getItem('associationData') || '{}');
      this.service.addAssociation(associationData)
        .then(() => {
          console.log('Données de l\'association ajoutées avec succès dans Firebase Firestore.');
          // Réinitialiser le formulaire après l'ajout des données
          this.router.navigate(['/login']); // Rediriger vers la page de réussite
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout des données de l\'association dans Firebase Firestore:', error);
        });
      
    } else {
      // Code does not match, handle this case accordingly
      console.log('Code did not match!');
      this.remainingAttempts--;

      if (this.remainingAttempts === 0) {
        Swal.fire({
          icon: "error",
          title: "La vérification de votre adresse email est échoué! Veuillez saisir une adresse email valide.",
          showConfirmButton: false,
          timer: 3000
        });
        // Limite de tentatives atteinte, rediriger vers la page précédente
        this.router.navigate(['/inscrireAssociation']);
      }

      this.codeMismatch = true; // Set flag for code mismatch
    }
    
    // Reset codeMismatch flag after each validation attempt
    setTimeout(() => {
      this.codeMismatch = false;
    }, 1000);
  }
}
