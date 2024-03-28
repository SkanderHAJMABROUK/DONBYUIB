import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

import { DocumentData, DocumentSnapshot, Firestore, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Association } from '../interfaces/association';
import { Observable, catchError, from, map, of, tap, throwError } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CookieService } from 'ngx-cookie-service';
import { sha256 } from 'js-sha256';
import { HttpClient } from '@angular/common/http';
import { Log } from '../interfaces/log';
import { LogService } from './log.service';
import { DemandeAssociation } from '../interfaces/demande-association';


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
  id!:string|undefined;



  showErrorNotification: boolean=false;
  connexion: boolean = localStorage.getItem('connexion') === 'true';
  nomAssociation: string = localStorage.getItem('nomAssociation') || '';

  constructor(private fs:Firestore, private fireStorage : AngularFireStorage,  private firestore:AngularFirestore, private route:Router
    , public cookie:CookieService, public fireAuth:AngularFireAuth, private http:HttpClient){}

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
          description: association.description,
          email: association.email,
          id_fiscale: association.id_fiscale,
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
            description: association.description,
            email: association.email,
            id_fiscale: association.id_fiscale,
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
            description: association.description,
            email: association.email,
            id_fiscale: association.id_fiscale,
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
          logo : demandeAssociation.logo,
          rib : demandeAssociation.rib,
          telephone : demandeAssociation.telephone,
          etat : demandeAssociation.etat,
          date : demandeAssociation.date
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
          logo : demandeAssociation.logo,
          rib : demandeAssociation.rib,
          telephone : demandeAssociation.telephone,
          etat : demandeAssociation.etat,
          date : demandeAssociation.date
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

  getAssociationSaltByEmail(email: string): Observable<string | undefined> {
    return this.getAssociationByEmail(email).pipe(
      map((association: Association | undefined) => {
        // Vérifie si l'association a été trouvée
        if (association) {
          // Retourne le sel de l'association
          return association.salt;
        } else {
          // Si aucune association n'a été trouvée, retourne undefined
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
        email: associationData.email,
        telephone: associationData.telephone,
        logo: associationData.logo,
        id_fiscale: associationData.id_fiscale,
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
      email: associationData.email,
      telephone: associationData.telephone,
      logo: associationData.logo,
      id_fiscale: associationData.id_fiscale,
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
      rib: associationData.rib, 
      etat: "en_attente",
      date:new Date(),
  };

  // Ajout du document dans la collection DemandeAssociation
  return addDoc(collection(this.fs, 'DemandeAssociation'), demandeData);
}

  

modifierAssociation(id: string, associationDataToUpdate: Partial<Association>): Promise<void> {
  const updatedAssociationData = {
    ...associationDataToUpdate,
    etat: "modification"
  };
  const associationRef = this.firestore.collection('Association').doc(id);
  return associationRef.update(updatedAssociationData);
}

async isAssociationActive(association: Association): Promise<boolean> {
  try {
    // Check if association is found and its state is 'actif'
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
        localStorage.setItem('connexion', 'true');
        localStorage.setItem('nomAssociation', this.nomAssociation); // Set the association name in localStorage
        this.route.navigate(['/login/profilAssociation', association.id], { replaceUrl: true });
        this.cookie.set("Details utilisateurs", "Email : " + email + " Password : " + password, 7);
        return true; // Login succeeded
      } else {
        this.showErrorNotification = true;
        console.error('Aucune association trouvée avec cet e-mail et ce mot de passe.');
        return false; // Login failed
      }
    }),
    catchError(error => {
      console.error('Erreur lors de la recherche de l\'association:', error);
      return of(false); // Return false in case of error
    })
  );
}


logOut(){
   this.connexion=false;
   localStorage.setItem('connexion','false');
   localStorage.removeItem('nomAssociation');
   this.route.navigate(['/login'],{replaceUrl:true});
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
  
}
