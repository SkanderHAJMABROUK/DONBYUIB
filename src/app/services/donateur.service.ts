import { Donateur } from '../interfaces/donateur';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';

import { DocumentData, DocumentSnapshot, Firestore, Timestamp, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';


@Injectable({
  providedIn: 'root'
})
export class DonateurService {

  constructor(private fs:Firestore, private fireStorage : AngularFireStorage,  private firestore:AngularFirestore, private route:Router) { }

connexionDonateur:boolean=false;
nomDonateur:string='';
prenomDonateur:string='';
showErrorNotification: boolean=false;
id!:string|undefined;
modifiercompte:boolean=false;




  ajouterDonateur(donateur: Donateur) {

    const dataToAdd: Donateur = {
        nom: donateur.nom,
        prenom: donateur.prenom,
        etat: "ajout",
        photo: donateur.photo,
        telephone:donateur.telephone,
        date_de_naissance:donateur.date_de_naissance,
        email: donateur.email,
        mdp: donateur.mdp,
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
        date_de_naissance: donateur.date_de_naissance,
        photo: donateur.photo,
        email: donateur.email,
        mdp: donateur.mdp,
      }));
    })
  );
}

getDonateurById(id: string): Observable<Donateur | undefined> {
  return this.getDonateurs().pipe(
    map(donateurs => donateurs.find(donateur => donateur.id === id))
  );
}



getDonateurByEmailAndPassword(email: string, password: string): Observable<Donateur | undefined> {
  return this.getDonateurs().pipe(
    map(donateurs => donateurs.find(donateur => donateur.email === email && donateur.mdp === password))
  );
}
logIn(email: string, password: string) {
  this.getDonateurByEmailAndPassword(email, password).subscribe(
    (donateur) => {
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
      } else {
        this.showErrorNotification = true;
        console.error('Aucun donateur trouvé avec cet e-mail et ce mot de passe.');
      }
    },
    (error) => {
      console.error('Erreur lors de la recherche du donateur:', error);
    }
  );
}

logOut(){
  this.connexionDonateur=false;
   localStorage.setItem('connexionDonateur','false');
   localStorage.removeItem('nomDonateur');
   localStorage.removeItem('prenomDonateur');
   this.route.navigate(['/login']);

   
   
 }

 modifierCompte(id: string, donateurDataToUpdate: Partial<Donateur>): Promise<void> {
  const updatedDonateurData = {
    ...donateurDataToUpdate,
    etat: "modification"
  };
  const donateurRef = this.firestore.collection('Donateur').doc(id);
  return donateurRef.update(updatedDonateurData);
}


}
