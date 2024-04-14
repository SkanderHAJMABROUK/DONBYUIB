import { Donateur } from '../interfaces/donateur';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';

import { DocumentData, DocumentReference, DocumentSnapshot, Firestore, Timestamp, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable, catchError, from, map, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { AssociationService } from './association.service';
import { sha256 } from 'js-sha256';
import { Commentaire } from '../interfaces/commentaire';



@Injectable({
  providedIn: 'root'
})
export class DonateurService {

  

  constructor(private fs:Firestore, private fireStorage : AngularFireStorage,  private firestore:AngularFirestore, private route:Router,
    private aService:AssociationService) { }

connexionDonateur:boolean=false;
nomDonateur:string='';
prenomDonateur:string='';
showErrorNotification: boolean=false;
id:string='';
modifiercompte:boolean=false;


dateOfBirthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedDate: Date = new Date(control.value);
    const currentDate: Date = new Date();

    if (selectedDate >currentDate ) {
      return { 'futureOrCurrentDate': true };
    }

    return null;
  };
}

  ajouterDonateur(donateur: Donateur) {

    const salt: string = this.aService.generateSalt(16);

    const hashedPassword: string = sha256(donateur.mdp+salt).toString();

    const dataToAdd: Donateur = {
        nom: donateur.nom,
        prenom: donateur.prenom,
        etat: "ajout",
        photo: donateur.photo,
        telephone:donateur.telephone,
        adresse:donateur.adresse,
        gouvernerat:donateur.gouvernerat,
        date_de_naissance:donateur.date_de_naissance,
        email: donateur.email,
        mdp: hashedPassword,
        salt: salt
    };
    return addDoc(collection(this.fs, 'Donateur'), dataToAdd);
}


  
async uploadPhoto(file: File): Promise<string | null> {
  const filePath = `PhotosDonateurs/${file.name}`;
  console.log('in upload' , filePath);
  const fileRef = this.fireStorage.ref(filePath);
  const task = this.fireStorage.upload(filePath, file);

  try {
    // Wait for the upload to complete
    await task;

    // Get the download URL
    const downloadUrl = await fileRef.getDownloadURL().toPromise();

    return downloadUrl;
  } catch (error) {
    console.error('An error occurred while uploading the file:', error);
    return null;
  }
}

getDonateurs(): Observable<Donateur[]> {
  let donateurCollection = collection(this.fs, 'Donateur');
  return collectionData(donateurCollection, { idField: 'id' }).pipe(
    map((donateurs: any[]) => {
      return donateurs.map(donateur => ({
        id: donateur.id,
        nom: donateur.nom,
        prenom: donateur.prenom,
        etat: donateur.etat,
        telephone:donateur.telephone,
        adresse:donateur.adresse,
        gouvernerat:donateur.gouvernerat,
        date_de_naissance: donateur.date_de_naissance,
        photo: donateur.photo,
        email: donateur.email,
        mdp: donateur.mdp,
        salt:donateur.salt
      }));
    })
  );
}

getDonateurById(id: string): Observable<Donateur | undefined> {
  return this.getDonateurs().pipe(
    map(donateurs => donateurs.find(donateur => donateur.id === id))
  );
}

getDonateurPhotoById(id: string): Observable<string | undefined> {
  return this.getDonateurById(id).pipe(
    map(donateur => donateur?.photo)
  )
}

getDonateurNomById(id: string): Observable<string | undefined> {
  return this.getDonateurById(id).pipe(
    map(donateur => donateur?.nom)
  )
}

getDonateurPrenomById(id: string): Observable<string | undefined> {
  return this.getDonateurById(id).pipe(
    map(donateur => donateur?.prenom)
  )
}

getDonateurByEmail(email: string): Observable<Donateur | undefined> {
  return this.getDonateurs().pipe(
    map(donateurs => donateurs.find(donateur => donateur.email === email))
  );
}

getDonateurSaltByEmail(email: string): Observable<string | undefined> {
  return this.getDonateurByEmail(email).pipe(
    map((donateur: Donateur | undefined) => {
      // Vérifie si l'association a été trouvée
      if (donateur) {
        // Retourne le sel de l'association
        return donateur.salt;
      } else {
        // Si aucune association n'a été trouvée, retourne undefined
        return undefined;
      }
    })
  );}


getDonateurByEmailAndPassword(email: string, password: string): Observable<Donateur | undefined> {
  return this.getDonateurs().pipe(
    map(donateurs => donateurs.find(donateur => donateur.email === email && donateur.mdp === password))
  );
}

logIn(email: string, password: string): Observable<boolean> {
  return this.getDonateurByEmailAndPassword(email, password).pipe(
    map((donateur) => {
      if (donateur) {
        this.connexionDonateur = true;
        console.log(this.connexionDonateur);
        this.nomDonateur = donateur.nom;
        this.prenomDonateur = donateur.prenom;
        console.log(this.nomDonateur ,this.prenomDonateur);
        localStorage.setItem('connexionDonateur', 'true');
        localStorage.setItem('nomDonateur', this.nomDonateur); 
        localStorage.setItem('prenomDonateur', this.prenomDonateur);
 

        this.route.navigate(['/login/profilDonateur', donateur.id]);
        return true; // Return true if the login is successful
      } else {
        this.showErrorNotification = true;
        console.error('Aucun donateur trouvé avec cet e-mail et ce mot de passe.');
        return false; // Return false if no donateur is found
      }
    }),catchError(error => {
      console.error('Erreur lors de la recherche du compte:', error);
      return of(false); // Return false in case of error
    })
  );
}

logOut(){
  this.connexionDonateur=false;
   localStorage.setItem('connexionDonateur','false');
   localStorage.removeItem('nomDonateur');
   localStorage.removeItem('prenomDonateur');
   this.route.navigate(['/login']);

   
   
 }

 modifierCompte(donateur: Donateur): Promise<void> {
  const updatedDonateurData = {
    ...donateur
  };
  const donateurRef = this.firestore.collection('Donateur').doc(donateur.id);
  return donateurRef.update(updatedDonateurData);
}

// Méthode pour vérifier si l'e-mail existe déjà
checkEmailExists(email: string): Observable<boolean> {
  return this.firestore.collection('Donateur', ref => ref.where('email', '==', email)).get().pipe(
    map(snapshot => !snapshot.empty)
  );
}

ajouterCommentaire(idDonateur: string, idActualite: string, contenu: string): Observable<Commentaire> {
  
  const commentaire: Commentaire = {
    id_donateur: idDonateur,
    id_actualite: idActualite,
    contenu: contenu,
    date_de_publication: new Date()
  };

  return from(this.firestore.collection<Commentaire>('Commentaire').add(commentaire)).pipe(
    map(docRef => {
      return {
        id: docRef.id,
        ...commentaire
      };
    })
  );
}


getComments(): Observable<Commentaire[]> {
  let commentaireCollection = collection(this.fs, 'Commentaire');
  return collectionData(commentaireCollection, { idField: 'id' }).pipe(
    map((commentaires: any[]) => {
      return commentaires.map(commentaire => ({
        id: commentaire.id,
        id_donateur: commentaire.id_donateur,
        id_actualite: commentaire.id_actualite,
        contenu: commentaire.contenu,
        date_de_publication: commentaire.date_de_publication instanceof Timestamp ? commentaire.date_de_publication.toDate() : commentaire.date_de_publication
      }));
    })
  );
}

getGouvernerats(): Observable<string[]> {
  let gouverneratCollection = collection(this.fs, 'Gouvernerat');
  return collectionData(gouverneratCollection, { idField: 'id' }).pipe(
    map((gouvernerats: any[]) => {
      return gouvernerats.map(gouvernerat => gouvernerat.nom);
    })
  );
}

}
