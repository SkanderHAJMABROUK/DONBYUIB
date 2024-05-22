import { Donateur } from '../interfaces/donateur';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { DocumentData, DocumentReference, DocumentSnapshot, Firestore, Timestamp, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable, Subscription, catchError, from, interval, map, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AssociationService } from './association.service';
import { sha256 } from 'js-sha256';
import { Commentaire } from '../interfaces/commentaire';
import { AdministrateurService } from './administrateur.service';


@Injectable({
  providedIn: 'root'
})
export class DonateurService {

  

  constructor(private fs:Firestore, private fireStorage : AngularFireStorage,  private firestore:AngularFirestore, private route:Router,
    private aService:AssociationService, private adminService: AdministrateurService
  ) { 
      this.startTimer();
      this.monitorActivity();
      this.activitySubscription = new Subscription();
    }

connexionDonateur:boolean=false;
nomDonateur:string='';
prenomDonateur:string='';
showErrorNotification: boolean=false;
id:string='';
modifiercompte:boolean=false;
modifierMdp:boolean=false;
compteDonateur:boolean=true;
modifierEmail:boolean=false;

private timeoutId: any;
  private activitySubscription: Subscription;


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
    const adminId = this.adminService.getCurrentAdminId();
    const dataToAdd: Donateur = {
        nom: donateur.nom,
        prenom: donateur.prenom,
        etat: "actif",
        photo: donateur.photo,
        telephone:donateur.telephone,
        adresse:donateur.adresse,
        gouvernerat:donateur.gouvernerat,
        date_de_naissance:donateur.date_de_naissance,
        email: donateur.email,
        mdp: hashedPassword,
        salt: salt,
        id_admin: adminId !== null ? adminId : undefined 
           };
    return addDoc(collection(this.fs, 'Donateur'), dataToAdd);
}


  
async uploadPhoto(file: File): Promise<string | null> {
  const filePath = `PhotosDonateurs/${file.name}`;
  console.log('in upload' , filePath);
  const fileRef = this.fireStorage.ref(filePath);
  const task = this.fireStorage.upload(filePath, file);

  try {
    await task;

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
      if (donateur && donateur.id) {
        this.connexionDonateur = true;
        console.log(this.connexionDonateur);
        this.nomDonateur = donateur.nom;
        this.prenomDonateur = donateur.prenom;
        console.log(this.nomDonateur ,this.prenomDonateur);
        sessionStorage.setItem('connexionDonateur', 'true');
        sessionStorage.setItem('nomDonateur', this.nomDonateur); 
        sessionStorage.setItem('prenomDonateur', this.prenomDonateur);
        this.resetTimer();
        this.showErrorNotification = false;

        this.route.navigate(['/login/profilDonateur', donateur.id]);
        return true; // Return true if the login is successful
      } else {
        this.showErrorNotification = true;
        console.error('Aucun donateur trouvé avec cet e-mail et ce mot de passe.');
        return false; // Return false if no donateur is found
      }
    }),catchError(error => {
      this.showErrorNotification = true;
      console.error('Erreur lors de la recherche du compte:', error);
      return of(false); // Return false in case of error
    })
  );
}

logOut(){
  this.connexionDonateur=false;
  sessionStorage.setItem('connexionDonateur','false');
  sessionStorage.removeItem('nomDonateur');
  sessionStorage.removeItem('prenomDonateur');
   this.route.navigate(['/login']);
   this.activitySubscription.unsubscribe();
}

private startTimer() {
  const timer = interval(30000); // Timer set to check every 30 seconds
  this.activitySubscription = timer.subscribe(() => {
    const lastActivity = sessionStorage.getItem('lastActivity');
    const now = new Date().getTime();
    if (this.connexionDonateur && lastActivity) {
      const diff = now - parseInt(lastActivity);
      const diffInMinutes = diff / (1000 * 60);
      if (diffInMinutes >=60) { // Log out after 24 hours of inactivity
        this.logOut(); // Log out user if inactive for 15 minutes
        alert("Vous avez été déconnecté en raison d'une inactivité prolongée. Veuillez vous reconnecter.");
      }
    }
  });
}

monitorActivity() {
  // Update the last activity timestamp when any activity happens
  window.addEventListener('mousemove', this.updateLastActivity.bind(this));
  window.addEventListener('scroll', this.updateLastActivity.bind(this));
  window.addEventListener('keydown', this.updateLastActivity.bind(this));
}

updateLastActivity() {
  sessionStorage.setItem('lastActivity', new Date().getTime().toString());
}

private resetTimer() {
  clearTimeout(this.timeoutId);
  this.startTimer();
}

private stopTimer() {
  clearTimeout(this.timeoutId);
}

ngOnDestroy() {
  this.stopTimer();
  this.activitySubscription.unsubscribe();
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
