import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';

import { DocumentData, DocumentSnapshot, Firestore, Timestamp, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Actualite } from '../actualite';


@Injectable({
  providedIn: 'root'
})
export class ActualiteService {

  constructor(private fs:Firestore, private fireStorage : AngularFireStorage,  private firestore:AngularFirestore, private route:Router) { }
  showDetails: boolean = localStorage.getItem('service.showDetails') === 'true';


  getActualites(): Observable<Actualite[]> {
    let actualiteCollection = collection(this.fs, 'Actualite');
   return collectionData(actualiteCollection, { idField: 'id' }).pipe(
     map((actualites: any[]) => {
        return actualites.map(actualite => ({
          id: actualite.id,
          titre: actualite.titre,
          description: actualite.description,
          image: actualite.image,
          date_publication: actualite.date_publication instanceof Timestamp ? actualite.date_publication.toDate() : actualite.date_publication,
          id_association:actualite.id_association,
        }));
      })
    );
   }


   getActualitesByAssociationId(associationId: string): Observable<Actualite[]> {
    return this.getActualites().pipe(
      map(actualites => actualites.filter(actualite => actualite.id_association === associationId))
    );
  }

  getAssociationIdFromUrl():string{
    const urlParts = window.location.href.split('/');
    console.log(urlParts[urlParts.length - 1]);
    return urlParts[urlParts.length - 1];
  }
  
  
async uploadCover(file: File): Promise<string | null> {
  console.log('File name:',file.name);
  const filePath = `ImagesActualites/${file.name}`;
  console.log('in upload' , filePath);
  const fileRef = this.fireStorage.ref(filePath);
  const task = this.fireStorage.upload(filePath, file);

  try {
    // Wait for the upload to complete
    await task;
    // Get the download URL
    const downloadUrl = await fileRef.getDownloadURL().toPromise();
    console.log('Image Uploaded')

    return downloadUrl;
  } catch (error) {
    console.error('An error occurred while uploading the file:', error);
    return null;
  }
}

ajouterActualite(actualiteData: Actualite) {

  const associationId=this.getAssociationIdFromUrl();
  const datePublication = new Date();
    
  const dataToAdd: Actualite = {
      titre: actualiteData.titre,
      description: actualiteData.description,
      image: actualiteData.image,
      date_publication: datePublication,
      id_association:associationId,
      
  };
  return addDoc(collection(this.fs, 'Actualite'), dataToAdd);
}



}
