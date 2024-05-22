import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

import { Firestore, Timestamp, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Association } from '../interfaces/association';
import { Observable, Subscription, catchError, from, fromEvent, interval, map, of, tap, throwError } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CookieService } from 'ngx-cookie-service';
import { sha256 } from 'js-sha256';
import { HttpClient } from '@angular/common/http';
import { Log } from '../interfaces/log';
import { LogService } from './log.service';
import { DemandeAssociation } from '../interfaces/demande-association';
import { DemandeModificationAssociation } from '../interfaces/demande-modification-association';


@Injectable({
  providedIn: 'root' 
})
export class AssociationService {

  compte: boolean = true;

  ajouterCollecte:boolean=false;
  ajouterActualite:boolean=false;


  afficherCollecte:boolean=false;
  afficherActualite:boolean=false;

  modifierAss:boolean=false;
  modifierMdpAss:boolean=false;
  id!:string|undefined;

  private timeoutId: any;
  private activitySubscription: Subscription;



  showErrorNotification: boolean=false;
  connexion: boolean = localStorage.getItem('connexion') === 'true';
  nomAssociation: string | undefined= localStorage.getItem('nomAssociation') || '';

  constructor(private fs:Firestore, private fireStorage : AngularFireStorage,  private firestore:AngularFirestore, private route:Router, 
  public cookie:CookieService, public fireAuth:AngularFireAuth, private http:HttpClient){

    this.startTimer();
    this.monitorActivity();
    this.activitySubscription = new Subscription();
    
    }

  showDetails: boolean = localStorage.getItem('service.showDetails') === 'true';
 
  
  getAssociations(): Observable<Association[]> {
    let associationCollection = collection(this.fs, 'Association');
    return collectionData(associationCollection, { idField: 'id' }).pipe(
      map((associations: any[]) => {
        return associations.map(association => ({
          id: association.id,
          nom: association.nom,
          etat: association.etat,
          categorie: association.categorie,
          adresse:association.adresse,
          gouvernerat: association.gouvernerat,
          description: association.description,
          email: association.email,
          id_fiscale: association.id_fiscale,
          matricule_fiscale: association.matricule_fiscale,
          logo: association.logo,
          mdp: association.mdp,
          rib: association.rib,
          telephone: association.telephone,
          salt: association.salt,
        }));
      })
    );
  }

  getPendingAssociations(): Observable<Association[]> {
    let associationCollection = collection(this.fs, 'Association');
    return collectionData(associationCollection, { idField: 'id' }).pipe(
      map((associations: any[]) => {
        return associations
          .filter(association => association.etat === 'en_attente') // Filter associations with etat 'en_attente'
          .map(association => ({
            id: association.id,
            nom: association.nom,
            etat: association.etat,
            categorie: association.categorie,
            adresse: association.adresse,
            gouvernerat: association.gouvernerat,
            description: association.description,
            email: association.email,
            id_fiscale: association.id_fiscale,
            matricule_fiscale: association.matricule_fiscale,
            logo: association.logo,
            mdp: association.mdp,
            rib: association.rib,
            telephone: association.telephone,
            salt: association.salt,
          }));
      })
    );
  }

  getActiveAssociations(): Observable<Association[]> {
    let associationCollection = collection(this.fs, 'Association');
    return collectionData(associationCollection, { idField: 'id' }).pipe(
      map((associations: any[]) => {
        return associations
        .filter(association => association.etat === 'actif') // Filter associations with etat 'en_attente'
          .map(association => ({
            id: association.id,
            nom: association.nom,
            etat: association.etat,
            categorie: association.categorie,
            adresse: association.adresse,
            gouvernerat: association.gouvernerat,
            description: association.description,
            email: association.email,
            id_fiscale: association.id_fiscale,
            matricule_fiscale: association.matricule_fiscale,
            logo: association.logo,
            mdp: association.mdp,
            rib: association.rib,
            telephone: association.telephone,
            salt: association.salt,
          }));
      })
    );
  }

  getDemandesAssociations(): Observable<DemandeAssociation[]> {
    let demandeAssociationCollection = collection(this.fs, 'DemandeAssociation');
    return collectionData(demandeAssociationCollection, { idField: 'id' }).pipe(
      map((demandesAssociations: any[]) => {
        return demandesAssociations.map(demandeAssociation => ({
          id: demandeAssociation.id,
          id_association : demandeAssociation.id_association,
          nom : demandeAssociation.nom,
          categorie : demandeAssociation.categorie,
          adresse : demandeAssociation.adresse,
          description : demandeAssociation.description,
          email : demandeAssociation.email,
          id_fiscale : demandeAssociation.id_fiscale,
          matricule_fiscale: demandeAssociation.matricule_fiscale,
          logo : demandeAssociation.logo,
          rib : demandeAssociation.rib,
          telephone : demandeAssociation.telephone,
          etat : demandeAssociation.etat,
          date : demandeAssociation.date instanceof Timestamp ? demandeAssociation.date.toDate() : demandeAssociation.date
        }));
      })
    );
  }

  getPendingDemandesAssociations(): Observable<DemandeAssociation[]> {
    let demandeAssociationCollection = collection(this.fs, 'DemandeAssociation');
    return collectionData(demandeAssociationCollection, { idField: 'id' }).pipe(
      map((demandesAssociations: any[]) => {
        return demandesAssociations
        .filter(demandeAssociation => demandeAssociation.etat === 'en_attente') // Filter associations with etat 'en_attente'
        .map(demandeAssociation => ({
          id: demandeAssociation.id,
          id_association : demandeAssociation.id_association,
          nom : demandeAssociation.nom,
          categorie : demandeAssociation.categorie,
          adresse : demandeAssociation.adresse,
          description : demandeAssociation.description,
          email : demandeAssociation.email,
          id_fiscale : demandeAssociation.id_fiscale,
          matricule_fiscale: demandeAssociation.matricule_fiscale,
          logo : demandeAssociation.logo,
          rib : demandeAssociation.rib,
          telephone : demandeAssociation.telephone,
          etat : demandeAssociation.etat,
          date : demandeAssociation.date instanceof Timestamp ? demandeAssociation.date.toDate() : demandeAssociation.date
        }));
      })
    );
  }

  getAcceptedDemandesAssociations(): Observable<DemandeAssociation[]> {
    let demandeAssociationCollection = collection(this.fs, 'DemandeAssociation');
    return collectionData(demandeAssociationCollection, { idField: 'id' }).pipe(
      map((demandesAssociations: any[]) => {
        return demandesAssociations
        .filter(demandeAssociation => demandeAssociation.etat === 'accepté') // Filter associations with etat 'en_attente'
        .map(demandeAssociation => ({
          id: demandeAssociation.id,
          id_association : demandeAssociation.id_association,
          nom : demandeAssociation.nom,
          categorie : demandeAssociation.categorie,
          adresse : demandeAssociation.adresse,
          description : demandeAssociation.description,
          email : demandeAssociation.email,
          id_fiscale : demandeAssociation.id_fiscale,
          matricule_fiscale: demandeAssociation.matricule_fiscale,
          logo : demandeAssociation.logo,
          rib : demandeAssociation.rib,
          telephone : demandeAssociation.telephone,
          etat : demandeAssociation.etat,
          date : demandeAssociation.date instanceof Timestamp ? demandeAssociation.date.toDate() : demandeAssociation.date
        }));
      })
    );
  }

  getRefusedDemandesAssociations(): Observable<DemandeAssociation[]> {
    let demandeAssociationCollection = collection(this.fs, 'DemandeAssociation');
    return collectionData(demandeAssociationCollection, { idField: 'id' }).pipe(
      map((demandesAssociations: any[]) => {
        return demandesAssociations
        .filter(demandeAssociation => demandeAssociation.etat === 'refusé') // Filter associations with etat 'en_attente'
        .map(demandeAssociation => ({
          id: demandeAssociation.id,
          id_association : demandeAssociation.id_association,
          nom : demandeAssociation.nom,
          categorie : demandeAssociation.categorie,
          adresse : demandeAssociation.adresse,
          description : demandeAssociation.description,
          email : demandeAssociation.email,
          id_fiscale : demandeAssociation.id_fiscale,
          matricule_fiscale: demandeAssociation.matricule_fiscale,
          logo : demandeAssociation.logo,
          rib : demandeAssociation.rib,
          telephone : demandeAssociation.telephone,
          etat : demandeAssociation.etat,
          date : demandeAssociation.date instanceof Timestamp ? demandeAssociation.date.toDate() : demandeAssociation.date
        }));
      })
    );
  }

  getDemandesModificationsAssociations(): Observable<DemandeModificationAssociation[]> {
    let demandeModificationAssociationCollection = collection(this.fs, 'DemandeModificationAssociation');
    return collectionData(demandeModificationAssociationCollection, { idField: 'id' }).pipe(
      map((demandeModificationAssociation: any[]) => {
        return demandeModificationAssociation.map(demandeModificationAssociation => ({
          id: demandeModificationAssociation.id,
          id_association : demandeModificationAssociation.id_association,
          nom : demandeModificationAssociation.nom,
          description : demandeModificationAssociation.description,
          email : demandeModificationAssociation.email,
          telephone : demandeModificationAssociation.telephone,
          rib : demandeModificationAssociation.rib,
          adresse : demandeModificationAssociation.adresse,
          categorie : demandeModificationAssociation.categorie,
          etat : demandeModificationAssociation.etat,
          date : demandeModificationAssociation.date instanceof Timestamp ? demandeModificationAssociation.date.toDate() : demandeModificationAssociation.date,
        }));
      })
    );
  }


  getPendingDemandesModificationsAssociations(): Observable<DemandeModificationAssociation[]> {
    let demandeModificationAssociationCollection = collection(this.fs, 'DemandeModificationAssociation');
    return collectionData(demandeModificationAssociationCollection, { idField: 'id' }).pipe(
      map((demandeModificationAssociation: any[]) => {
        return demandeModificationAssociation
        .filter(demandeModificationAssociation => demandeModificationAssociation.etat === 'en_attente') 
        .map(demandeModificationAssociation => ({
          id: demandeModificationAssociation.id,
          id_association : demandeModificationAssociation.id_association,
          nom : demandeModificationAssociation.nom,
          description : demandeModificationAssociation.description,
          email : demandeModificationAssociation.email,
          telephone : demandeModificationAssociation.telephone,
          rib : demandeModificationAssociation.rib,
          adresse : demandeModificationAssociation.adresse,
          categorie : demandeModificationAssociation.categorie,
          etat : demandeModificationAssociation.etat,
          date : demandeModificationAssociation.date instanceof Timestamp ? demandeModificationAssociation.date.toDate() : demandeModificationAssociation.date,
        }));
      })
    );
  }

  getAcceptedDemandesModificationsAssociations(): Observable<DemandeModificationAssociation[]> {
    let demandeModificationAssociationCollection = collection(this.fs, 'DemandeModificationAssociation');
    return collectionData(demandeModificationAssociationCollection, { idField: 'id' }).pipe(
      map((demandeModificationAssociation: any[]) => {
        return demandeModificationAssociation
        .filter(demandeModificationAssociation => demandeModificationAssociation.etat === 'accepté') 
        .map(demandeModificationAssociation => ({
          id: demandeModificationAssociation.id,
          id_association : demandeModificationAssociation.id_association,
          nom : demandeModificationAssociation.nom,
          description : demandeModificationAssociation.description,
          email : demandeModificationAssociation.email,
          telephone : demandeModificationAssociation.telephone,
          rib : demandeModificationAssociation.rib,
          adresse : demandeModificationAssociation.adresse,
          categorie : demandeModificationAssociation.categorie,
          etat : demandeModificationAssociation.etat,
          date : demandeModificationAssociation.date instanceof Timestamp ? demandeModificationAssociation.date.toDate() : demandeModificationAssociation.date,
        }));
      })
    );
  }


  getAssociationById(id: string): Observable<Association | undefined> {
    return this.getAssociations().pipe(
      map(associations => associations.find(association => association.id === id))
    );
  }

  getDemandeAssociationById(id: string): Observable<DemandeAssociation | undefined> {
    return this.getDemandesAssociations().pipe(
      map(associations => associations.find(association => association.id === id))
    );
  }

  getDemandeModificationAssociationById(id: string): Observable<DemandeModificationAssociation | undefined> {
    return this.getDemandesModificationsAssociations().pipe(
      map(associations => associations.find(association => association.id === id))
    );
  }

  getAssociationNameById(id: string): Observable<string | undefined> {
    return this.getAssociationById(id).pipe(
      map(association => association?.nom)
    )
  }

  getAssociationByEmailAndPassword(email: string, password: string): Observable<Association | undefined> {
    return this.getAssociations().pipe(
      map(associations => {
        return associations.find(association => association.email === email && association.mdp === password);
      })
    );    
  }
   

  getAssociationByEmail(email: string): Observable<Association | undefined> {
    return this.getAssociations().pipe(
      map(associations => associations.find(association => association.email === email))
    );
  }
  
  getAssociationByName(nom: string): Observable<Association | undefined> {
    return this.getAssociations().pipe(
      map(associations => associations.find(association => association.nom === nom))
    );
  }
  getAssociationIdByName(nom: string): Observable<string | undefined> {
    return this.getAssociationByName(nom).pipe(
      map(association => association?.id)
    )
  }

  getAssociationSaltByEmail(email: string): Observable<string | undefined> {
    return this.getAssociationByEmail(email).pipe(
      map((association: Association | undefined) => {
        // Vérifie si l'association a été trouvée
        if (association) {
          // Retourne le sel de l'association
          return association.salt;
        } else {
          this.showErrorNotification=true;
          return undefined;
        }
      })
    );}
  
  
  genererCodeOTP(): number {
    let codeOTP: string = '';
    for (let i = 0; i < 6; i++) {
        codeOTP += Math.floor(Math.random() * 10).toString(); // Génère un chiffre aléatoire entre 0 et 9 inclus
    }
    return parseInt(codeOTP);
}
  
  addAssociation(associationData: Association) {

    // Génération du sel
    const salt: string = this.generateSalt(16);
    // Hachage du mot de passe avec salage
    const hashedPassword: string = sha256(associationData.mdp+salt).toString();

    const dataToAdd: Association = {
        nom: associationData.nom,
        description: associationData.description,
        categorie: associationData.categorie,
        adresse: associationData.adresse,
        gouvernerat: associationData.gouvernerat,
        email: associationData.email,
        telephone: associationData.telephone,
        logo: associationData.logo,
        id_fiscale: associationData.id_fiscale,
        matricule_fiscale: associationData.matricule_fiscale,
        rib: associationData.rib, // Stockage du mot de passe haché
        mdp: hashedPassword,
        etat: "en_attente",
        salt:salt //Stockage du sel
    };
    return addDoc(collection(this.fs, 'Association'), dataToAdd);
}

async addAssociationAndDemande(associationData: Association) {
  // Génération du sel
  const salt: string = this.generateSalt(16);
  // Hachage du mot de passe avec salage
  const hashedPassword: string = sha256(associationData.mdp + salt).toString();

  const associationToAdd: Association = {
      nom: associationData.nom,
      description: associationData.description,
      categorie: associationData.categorie,
      adresse: associationData.adresse,
      gouvernerat: associationData.gouvernerat,
      email: associationData.email,
      telephone: associationData.telephone,
      logo: associationData.logo,
      id_fiscale: associationData.id_fiscale,
      matricule_fiscale: associationData.matricule_fiscale,
      rib: associationData.rib, 
      mdp: hashedPassword,
      etat: "en_attente",
      salt: salt // Stockage du sel
  };

  // Ajout du document dans la collection Association
  const associationDocRef = await addDoc(collection(this.fs, 'Association'), associationToAdd);

  // Récupération de l'ID de l'association ajoutée
  const associationId = associationDocRef.id;

  // Création du document à ajouter dans la collection DemandeAssociation
  const demandeData: DemandeAssociation = {
      id_association: associationId,
      nom: associationData.nom,
      description: associationData.description,
      categorie: associationData.categorie,
      adresse: associationData.adresse,
      email: associationData.email,
      telephone: associationData.telephone,
      logo: associationData.logo,
      id_fiscale: associationData.id_fiscale,
      matricule_fiscale: associationData.matricule_fiscale,
      rib: associationData.rib, 
      etat: "en_attente",
      date:new Date(),
  };

  // Ajout du document dans la collection DemandeAssociation
  return addDoc(collection(this.fs, 'DemandeAssociation'), demandeData);
}

  

modifierAssociation(id: string, associationDataToUpdate: Partial<Association>): Promise<void> {
  // Création de l'objet DemandeModificationAssociation
  const demandeModification: DemandeModificationAssociation = {
    id_association: id,
    nom: associationDataToUpdate.nom || '',
    description: associationDataToUpdate.description || '',
    email: associationDataToUpdate.email || '',
    telephone: associationDataToUpdate.telephone || '',
    rib: associationDataToUpdate.rib || '',
    adresse: associationDataToUpdate.adresse || '',
    categorie: associationDataToUpdate.categorie || '',
    etat:'en_attente',
    date: new Date()
  };

  // Ajout de l'objet DemandeModificationAssociation dans la collection 'DemandeModificationAssociation'
  return this.firestore.collection('DemandeModificationAssociation').add(demandeModification)
    .then(() => {
      console.log('Demande de modification ajoutée avec succès.');
    })
    .catch(error => {
      console.error('Erreur lors de l\'ajout de la demande de modification :', error);
      throw new Error('Erreur lors de l\'ajout de la demande de modification.');
    });
}

async isAssociationActive(association: Association): Promise<boolean> {
  try {

    const isActive = !!association && association.etat === 'actif';
    console.log('Is association active?', isActive);

    return isActive;
  } catch (error) {
    console.error('Error checking association activation status:', error);
    return false; // Return false in case of error
  }
}

logIn(email: string, password: string): Observable<boolean> {
  return this.getAssociationByEmailAndPassword(email, password).pipe(
    map(association => {
      if (association) {
        this.connexion = true;
        this.nomAssociation = association.nom;
        sessionStorage.setItem('connexion', 'true');
        sessionStorage.setItem('nomAssociation', association.nom);
        this.route.navigate(['/login/profilAssociation', association.id], { replaceUrl: true });
        this.cookie.set("Details utilisateurs", "Email : " + email + " Password : " + password, 7);
        this.resetTimer();
        this.showErrorNotification = false;
        return true;
      } else {
        this.showErrorNotification = true;
        console.error('Aucune association trouvée avec cet e-mail et ce mot de passe.');
        return false;
      }
    }),
    catchError(error => {
      this.showErrorNotification = true;
      console.error('Erreur lors de la recherche de l\'association:', error);
      return of(false);
    })
  );
}

logOut(){
  this.connexion=false;
  sessionStorage.setItem('connexion', 'false');
  sessionStorage.removeItem('nomAssociation');
  this.route.navigate(['/login'], { replaceUrl: true });
  this.activitySubscription.unsubscribe();
}

private startTimer() {
  const timer = interval(30000); // Timer set to check every 30 seconds
  this.activitySubscription = timer.subscribe(() => {
    const lastActivity = sessionStorage.getItem('lastActivity');
    const now = new Date().getTime();
    if (this.connexion && lastActivity) {
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



 async uploadLogo(file: File): Promise<string | null> {
  if (!file) {
    console.error('File is null or undefined');
    return null;
  }

  const filePath = `LogosAssociations/${file.name}`;
  console.log('in upload', filePath);
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

async uploadPDF(file: File): Promise<string | null> {
  if (!file) {
    console.error('File is null or undefined');
    return null;
  }

  const filePath = `IDFiscauxAssociations/${file.name}`;
  console.log('in upload', filePath);
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

// Méthode pour vérifier si l'e-mail existe déjà
checkEmailExists(email: string): Observable<boolean> {
  return this.firestore.collection('Association', ref => ref.where('email', '==', email)).get().pipe(
    map(snapshot => !snapshot.empty)
  );
}

// Méthode pour vérifier si le nom existe déjà
checkNameExists(nom: string): Observable<boolean> {
  return this.firestore.collection('Association', ref => ref.where('nom', '==', nom)).get().pipe(
    map(snapshot => !snapshot.empty)
  );
}

generateSalt(length: number): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let salt = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    salt += charset[randomIndex];
  }
  return salt;
}

deleteAssociationById(id: string): Promise<void> {
  const associationRef = this.firestore.collection('Association').doc(id);
  return associationRef.delete();
}
  
checkPendingModificationDemand(associationId: string): Observable<boolean> {
  return this.firestore.collection<DemandeModificationAssociation>('DemandeModificationAssociation', ref =>
    ref.where('id_association', '==', associationId).where('etat', '==', 'en_attente')
  ).valueChanges().pipe(
    map(demands => demands.length > 0) // Si la longueur des demandes en attente est supérieure à 0, retourne true, sinon false
  );
}

getModificationDateByAssociationId(associationId: string): Observable<string | undefined> {
  return this.firestore.collection<DemandeModificationAssociation>('DemandeModificationAssociation', ref =>
    ref.where('id_association', '==', associationId).where('etat', '==', 'en_attente')
  ).valueChanges().pipe(
    map(demands => {
      if (demands.length > 0) {
        // Récupérer la date de la première demande en attente
        const modificationDate = demands[0].date instanceof Timestamp ? demands[0].date.toDate() : demands[0].date;

        // Formater la date au format dd/mm/yyyy
        const day = modificationDate.getDate().toString().padStart(2, '0');
        const month = (modificationDate.getMonth() + 1).toString().padStart(2, '0'); // Notez que getMonth() retourne les mois de 0 à 11
        const year = modificationDate.getFullYear();

        // Concaténer les éléments pour former la date au format dd/mm/yyyy
        return `${day}/${month}/${year}`;
      } else {
        return undefined;
      }
    })
  );
}

updateAssociationField(id: string, fieldName: keyof Partial<Association>, newValue: any): Promise<void> {
  const associationRef = this.firestore.collection('Association').doc(id);
  const updatedField: Partial<Association> = {};
  updatedField[fieldName] = newValue;
  return associationRef.update(updatedField);
}

getDemandDateByIdAssociation(id_association: string): Observable<Date | undefined> {
  return this.firestore.collection<DemandeAssociation>('DemandeAssociation', ref =>
    ref.where('id_association', '==', id_association)
  ).valueChanges().pipe(
    map(demands => {
      if (demands.length > 0) {
        return demands[0].date instanceof Timestamp ? demands[0].date.toDate() : demands[0].date;
      } else {
        return undefined; 
      }
    })
  );
}

getCategories(): Observable<string[]> {
  let categorieCollection = collection(this.fs, 'Categorie');
  return collectionData(categorieCollection, { idField: 'id' }).pipe(
    map((categories: any[]) => {
      return categories.map(category => category.nom);
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
