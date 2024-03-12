import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

import { DocumentData, DocumentSnapshot, Firestore, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Association } from '../interfaces/association';
import { Observable, from, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CookieService } from 'ngx-cookie-service';


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



  showErrorNotification: boolean=false;
  connexion: boolean = localStorage.getItem('connexion') === 'true';
  nomAssociation: string = localStorage.getItem('nomAssociation') || '';

  constructor(private fs:Firestore, private fireStorage : AngularFireStorage,  private firestore:AngularFirestore, private route:Router
    , public cookie:CookieService, public fireAuth:AngularFireAuth){}

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
          description: association.description,
          email: association.email,
          id_fiscale: association.id_fiscale,
          logo: association.logo,
          mdp: association.mdp,
          rib: association.rib,
          telephone: association.telephone,
          codeOtp : association.codeOtp
        }));
      })
    );
  }

  getAssociationById(id: string): Observable<Association | undefined> {
    return this.getAssociations().pipe(
      map(associations => associations.find(association => association.id === id))
    );
  }

  getAssociationByEmailAndPassword(email: string, password: string): Observable<Association | undefined> {
    return this.getAssociations().pipe(
      map(associations => associations.find(association => association.email === email && association.mdp === password))
    );
  }

  
  genererCodeOTP(): number {
    let codeOTP: string = '';
    for (let i = 0; i < 6; i++) {
        codeOTP += Math.floor(Math.random() * 10).toString(); // Génère un chiffre aléatoire entre 0 et 9 inclus
    }
    return parseInt(codeOTP);
}
  
  addAssociation(associationData: Association) {

    const dataToAdd: Association = {
        nom: associationData.nom,
        description: associationData.description,
        categorie: associationData.categorie,
        email: associationData.email,
        telephone: associationData.telephone,
        logo: associationData.logo,
        id_fiscale: associationData.id_fiscale,
        rib: associationData.rib,
        mdp: associationData.mdp,
        etat: "en_attente"
    };
    return addDoc(collection(this.fs, 'Association'), dataToAdd);
}
  


modifierAssociation(id: string, associationDataToUpdate: Partial<Association>): Promise<void> {
  const associationRef = this.firestore.collection('Association').doc(id);
  return associationRef.update(associationDataToUpdate);
}


id!:string|undefined;

logIn(email: string, password: string) {
  this.getAssociationByEmailAndPassword(email, password).subscribe(
    (association) => {
      if (association) {
        this.connexion = true;
        this.nomAssociation = association.nom;
        localStorage.setItem('connexion', 'true');
        localStorage.setItem('nomAssociation', this.nomAssociation); // Set the association name in localStorage
        this.route.navigate(['/login/profilAssociation', association.id]);
        this.cookie.set("Details utilisateurs", "Email : " + email + "Password : " + password, 7);
      } else {
        this.showErrorNotification = true;
        console.error('Aucune association trouvée avec cet e-mail et ce mot de passe.');
      }
    },
    (error) => {
      console.error('Erreur lors de la recherche de l\'association:', error);
    }
  );
}



logOut(){
  this.connexion=false;
   localStorage.setItem('connexion','false');
   localStorage.removeItem('nomAssociation');
   this.route.navigate(['/login']);
   console.log(this.nomAssociation) 
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


  
}
