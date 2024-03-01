import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';

import { DocumentData, DocumentSnapshot, Firestore, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Association } from '../association';
import { Observable, from, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root' 
})
export class AssociationService {


  constructor(private fs:Firestore, private fireStorage : AngularFireStorage,  private firestore:AngularFirestore) { }

 showDetails=false;

  
  
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
          telephone: association.telephone
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
  
  connexion: boolean = localStorage.getItem('this.service.connexion') === 'true';
  nomAssociation: string = localStorage.getItem('nomAssociation') || '';






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





  async uploadLogo(file: File): Promise<string | null> {
    const filePath = `LogosAssociations/${file.name}`;
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

  async uploadPDF(file: File): Promise<string | null> {
    const filePath = `IDFiscauxAssociations/${file.name}`;
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


}
