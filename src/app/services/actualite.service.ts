import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';

import { DocumentData, DocumentSnapshot, Firestore, Timestamp, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Actualite } from '../interfaces/actualite';
import { DemandeActualite } from '../interfaces/demande-actualite';


@Injectable({
  providedIn: 'root'
})
export class ActualiteService {

  actualiteDetailShowModal:boolean=false;
  actualiteModifierShowModal:boolean=false;

  constructor(private fs:Firestore, private fireStorage : AngularFireStorage,  private firestore:AngularFirestore, private route:Router) { }
  showDetails: boolean = localStorage.getItem('service.showDetails') === 'true';


  getActualites(): Observable<Actualite[]> {
    let actualiteCollection = collection(this.fs, 'Actualite');
   return collectionData(actualiteCollection, { idField: 'id' }).pipe(
     map((actualites: any[]) => {
        return actualites.map(actualite => ({
          id: actualite.id,
          etat:actualite.etat,
          titre: actualite.titre,
          description: actualite.description,
          image: actualite.image,
          date_publication: actualite.date_publication instanceof Timestamp ? actualite.date_publication.toDate() : actualite.date_publication,
          id_association:actualite.id_association,
        }));
      })
    );
   }

   getPendingActualites(): Observable<Actualite[]> {
    let actualiteCollection = collection(this.fs, 'Actualite');
   return collectionData(actualiteCollection, { idField: 'id' }).pipe(
     map((actualites: any[]) => {
        return actualites
        .filter(actualite => actualite.etat === 'en_attente')
        .map(actualite => ({
          id: actualite.id,
          etat:actualite.etat,
          titre: actualite.titre,
          description: actualite.description,
          image: actualite.image,
          date_publication: actualite.date_publication instanceof Timestamp ? actualite.date_publication.toDate() : actualite.date_publication,
          id_association:actualite.id_association,
        }));
      })
    );
   }

   getAcceptedActualites(): Observable<Actualite[]> {
    let actualiteCollection = collection(this.fs, 'Actualite');
   return collectionData(actualiteCollection, { idField: 'id' }).pipe(
     map((actualites: any[]) => {
        return actualites
        .filter(actualite => actualite.etat === 'accepté')
        .map(actualite => ({
          id: actualite.id,
          etat:actualite.etat,
          titre: actualite.titre,
          description: actualite.description,
          image: actualite.image,
          date_publication: actualite.date_publication instanceof Timestamp ? actualite.date_publication.toDate() : actualite.date_publication,
          id_association:actualite.id_association,
        }));
      })
    );
   }

   getPendingDemandesActualites(): Observable<DemandeActualite[]> {
    let demandeActualiteCollection = collection(this.fs, 'DemandeActualite');
    return collectionData(demandeActualiteCollection, { idField: 'id' }).pipe(
      map((demandesActualites: any[]) => {
        return demandesActualites
        .filter(demandeActualite => demandeActualite.etat === 'en_attente') 
        .map(demandeActualite => ({
          id: demandeActualite.id,
          id_association : demandeActualite.id_association,
          titre : demandeActualite.titre,
          image : demandeActualite.image,
          date_publication:demandeActualite.date_publication,
          date : demandeActualite.date,
          etat : demandeActualite.etat
        }));
      })
    );
  }

  getAcceptedDemandesActualites(): Observable<DemandeActualite[]> {
    let demandeActualiteCollection = collection(this.fs, 'DemandeActualite');
    return collectionData(demandeActualiteCollection, { idField: 'id' }).pipe(
      map((demandesActualites: any[]) => {
        return demandesActualites
        .filter(demandeActualite => demandeActualite.etat === 'accepté')
        .map(demandeActualite => ({
          id: demandeActualite.id,
          id_association : demandeActualite.id_association,
          titre : demandeActualite.titre,
          image : demandeActualite.image,
          date_publication:demandeActualite.date_publication,
          date : demandeActualite.date,
          etat : demandeActualite.etat
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
      etat:"en_attente",
      date_publication: datePublication,
      id_association:associationId,
      
  };
  return addDoc(collection(this.fs, 'Actualite'), dataToAdd);
}

async ajouterActualiteAndDemande(actualiteData: Actualite) {

  const associationId=this.getAssociationIdFromUrl();
  
    
  const actualiteToAdd: Actualite = {
      titre: actualiteData.titre,
      description: actualiteData.description,
      image: actualiteData.image,
      etat:"en_attente",
      date_publication: new Date(),
      id_association:associationId,     
  };

  const actualiteDocRef = await addDoc(collection(this.fs, 'Actualite'), actualiteToAdd);

  const actualiteId = actualiteDocRef.id;

  // Création du document à ajouter dans la collection DemandeActualite
  const demandeData: DemandeActualite = {
    titre:actualiteData.titre,
    id_actualite:actualiteId,
    id_association:associationId,
    image:actualiteData.image,
    date_publication:new Date(),
    date:new Date(),
    etat:"en_attente"
};

return addDoc(collection(this.fs, 'DemandeActualite'), demandeData);
  
}

getActualiteById(id: string): Observable<Actualite | undefined> {
  return this.getActualites().pipe(
    map(actualites => actualites.find(actualite => actualite.id === id))
  );
}


modifierActualite(actualite: Actualite): Promise<void> {
  const updatedActualiteData = {
    ...actualite,
    etat: "modification"
  };
  const actualiteRef = this.firestore.collection('Actualite').doc(actualite.id); 
  return actualiteRef.update(updatedActualiteData);
}

deleteActualiteById(id: string): Promise<void> {
  const associationRef = this.firestore.collection('Actualite').doc(id);
  return associationRef.delete();
}

supprimerActualite(actualite: Actualite): Observable<Actualite[]> {
  const actualiteRef = this.firestore.collection('Actualite').doc(actualite.id);
 
  const updatedActualiteData = {
    ...actualite,
    etat: "suppression"
  };
  return new Observable<Actualite[]>(observer => {
    actualiteRef.update(updatedActualiteData).then(() => {
      observer.next([]);
      observer.complete();
    }).catch(error => {
      observer.error(error);
    });
  });
}


}
