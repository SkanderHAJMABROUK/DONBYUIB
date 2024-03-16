import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AssociationService } from 'src/app/services/associationService.service';
import { DonateurService } from 'src/app/services/donateur.service';
import { Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import Swal from  'sweetalert2';
import { Log } from 'src/app/interfaces/log';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public aService: AssociationService, private router: Router,
    private dService:DonateurService, private logService:LogService) {}

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
    const salt : string  | null = localStorage.getItem('saltOtp');
    const enteredCode = String(this.verificationForm.get('codeOTP')?.value);
    const hashedEnteredCode = sha256(enteredCode+salt);
    const storedCode = localStorage.getItem('codeOtp');
    
    if (hashedEnteredCode === storedCode) {
      // Code matches, proceed with whatever action you need
      console.log('Code matched!');
      this.verified = true;

      Swal.fire({
        icon: "success",
        title: "Votre demande d'habilitation est en cours de validation. Un email vous sera envoyé dès l'approbation de la demande!",
        showConfirmButton: false,
        timer: 10000
      });

      let type = localStorage.getItem('type');

if (type === "association") {

    const associationData = JSON.parse(localStorage.getItem('associationData') || '{}');

    this.aService.addAssociation(associationData)
        .then(() => {
            console.log('Données de l\'association ajoutées avec succès dans Firebase Firestore.');
            // Réinitialiser le formulaire après l'ajout des données
            this.router.navigate(['/login'], { replaceUrl: true }); // Rediriger vers la page de réussite
            let email: string  | null = localStorage.getItem("emailAssociation");
            let message: string = `Un compte association créé : [ ${email} ]`;
            this.logSignUp(message);
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout des données de l\'association dans Firebase Firestore:', error);
            let email: string  | null = localStorage.getItem("emailAssociation");
            let message: string = `Echec lors de l'ajout de l'association : [ ${email} ]`;
            this.logSignUp(message);
        });
} else if (type === "donateur") {

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    this.dService.ajouterDonateur(userData)
        .then(() => {
            console.log('Données du donateur ajoutées avec succès dans Firebase Firestore.');
            // Réinitialiser le formulaire après l'ajout des données

            this.router.navigate(['/login'], { replaceUrl: true }); // Rediriger vers la page de réussite
            let email: string  | null = localStorage.getItem("emailDonateur");
            let message: string = `Un compte donateur créé : [ ${email} ]`;
            this.logSignUp(message);

        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout des données du donateur dans Firebase Firestore:', error);
            let email: string  | null = localStorage.getItem("emailDonateur");
            let message: string = `Echec lors de l'ajout du donateur : [ ${email} ]`;
            this.logSignUp(message);
        });
}

      
      
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
        // localStorage.removeItem('code');
       
      }

      this.codeMismatch = true; // Set flag for code mismatch
    }
    
    // Reset codeMismatch flag after each validation attempt
    setTimeout(() => {
      this.codeMismatch = false;
    }, 1000);
  }

  logSignUp(message:string): void {
    const newLog: Log = {
      date: new Date(), // Current date
      message: message // Message for the log
    };
    this.logService.addLog(newLog).subscribe(
      response => {
        console.log('Log added successfully:', response);
        // Handle success
      },
      error => {
        console.error('Error adding log:', error);
        // Handle error
      }
    );
  }
}
