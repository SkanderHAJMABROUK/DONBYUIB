import { Injectable } from '@angular/core';
import { DocumentData, DocumentSnapshot, Firestore, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Association } from '../association';
import { Observable, from, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root' 
})
export class AssociationService {


  constructor(private fs:Firestore, private fireStorage : AngularFireStorage) { }

 showDetails=false;

  
  getAssociations(){
    let association=collection(this.fs,'Association');
    return collectionData(association,{idField:'id'})
  }

  getAssociationById(id: string){
    return this.getAssociations().pipe(
      map(associations => associations.find(association => association.id === id))
    );
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


}
