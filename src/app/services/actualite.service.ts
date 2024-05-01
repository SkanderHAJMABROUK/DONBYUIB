import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';

import { DocumentData, DocumentSnapshot, Firestore, Timestamp, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Actualite } from '../interfaces/actualite';
import { DemandeActualite } from '../interfaces/demande-actualite';
import { DemandeModificationActualite } from '../interfaces/demande-modification-actualite';
import { DemandeSuppressionActualite } from '../interfaces/demande-suppression-actualite';


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
          id_actualite : demandeActualite.id_actualite,
          titre : demandeActualite.titre,
          image : demandeActualite.image,
          date_publication: demandeActualite.date_publication instanceof Timestamp ? demandeActualite.date_publication.toDate() : demandeActualite.date_publication,
          date : demandeActualite.date,
          etat : demandeActualite.etat,
          description : demandeActualite.description
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
          id_actualite : demandeActualite.id_actualite,
          titre : demandeActualite.titre,
          image : demandeActualite.image,
          date_publication: demandeActualite.date_publication instanceof Timestamp ? demandeActualite.date_publication.toDate() : demandeActualite.date_publication,
          date : demandeActualite.date,
          etat : demandeActualite.etat,
          description : demandeActualite.description
        }));
      })
    );
  }

  getRefusedDemandesActualites(): Observable<DemandeActualite[]> {
    let demandeActualiteCollection = collection(this.fs, 'DemandeActualite');
    return collectionData(demandeActualiteCollection, { idField: 'id' }).pipe(
      map((demandesActualites: any[]) => {
        return demandesActualites
        .filter(demandeActualite => demandeActualite.etat === 'refusé')
        .map(demandeActualite => ({
          id: demandeActualite.id,
          id_association : demandeActualite.id_association,
          id_actualite : demandeActualite.id_actualite,
          titre : demandeActualite.titre,
          image : demandeActualite.image,
          date_publication: demandeActualite.date_publication instanceof Timestamp ? demandeActualite.date_publication.toDate() : demandeActualite.date_publication,
          date : demandeActualite.date,
          etat : demandeActualite.etat,
          description : demandeActualite.description
        }));
      })
    );
  }

  getDemandesModificationsActualites(): Observable<DemandeModificationActualite[]> {
    let demandeModificationActualitesCollection = collection(this.fs, 'DemandeModificationActualite');
    return collectionData(demandeModificationActualitesCollection, { idField: 'id' }).pipe(
      map((demandeModificationActualite: any[]) => {
        return demandeModificationActualite
        .map(demandeModificationActualite => ({
          id: demandeModificationActualite.id,
          id_association : demandeModificationActualite.id_association,
          id_actualite : demandeModificationActualite.id_actualite,
          titre : demandeModificationActualite.titre,
          description : demandeModificationActualite.description,
          image : demandeModificationActualite.image,
          etat : demandeModificationActualite.etat,
          date : demandeModificationActualite.date instanceof Timestamp ? demandeModificationActualite.date.toDate() : demandeModificationActualite.date,
        }));
      })
    );
  }

  getPendingDemandesModificationsActualites(): Observable<DemandeModificationActualite[]> {
    let demandeModificationActualitesCollection = collection(this.fs, 'DemandeModificationActualite');
    return collectionData(demandeModificationActualitesCollection, { idField: 'id' }).pipe(
      map((demandeModificationActualite: any[]) => {
        return demandeModificationActualite
        .filter(demandeModificationActualite => demandeModificationActualite.etat === 'en_attente') 
        .map(demandeModificationActualite => ({
          id: demandeModificationActualite.id,
          id_association : demandeModificationActualite.id_association,
          id_actualite : demandeModificationActualite.id_actualite,
          titre : demandeModificationActualite.titre,
          description : demandeModificationActualite.description,
          image : demandeModificationActualite.image,
          etat : demandeModificationActualite.etat,
          date : demandeModificationActualite.date instanceof Timestamp ? demandeModificationActualite.date.toDate() : demandeModificationActualite.date,
        }));
      })
    );
  }

  getAcceptedDemandesModificationsActualites(): Observable<DemandeModificationActualite[]> {
    let demandeModificationActualitesCollection = collection(this.fs, 'DemandeModificationActualite');
    return collectionData(demandeModificationActualitesCollection, { idField: 'id' }).pipe(
      map((demandeModificationActualite: any[]) => {
        return demandeModificationActualite
        .filter(demandeModificationActualite => demandeModificationActualite.etat === 'accepté') 
        .map(demandeModificationActualite => ({
          id: demandeModificationActualite.id,
          id_association : demandeModificationActualite.id_association,
          id_actualite : demandeModificationActualite.id_actualite,
          titre : demandeModificationActualite.titre,
          description : demandeModificationActualite.description,
          image : demandeModificationActualite.image,
          etat : demandeModificationActualite.etat,
          date : demandeModificationActualite.date instanceof Timestamp ? demandeModificationActualite.date.toDate() : demandeModificationActualite.date,
        }));
      })
    );
  }

  getDemandesSuppressionActualites(): Observable<DemandeSuppressionActualite[]> {
    let demandeSuppressionActualitesCollection = collection(this.fs, 'DemandeSuppressionActualite');
    return collectionData(demandeSuppressionActualitesCollection, { idField: 'id' }).pipe(
      map((demandeSuppressionActualite: any[]) => {
        return demandeSuppressionActualite
        .map(demandeSuppressionActualite => ({
          id: demandeSuppressionActualite.id,
          id_association : demandeSuppressionActualite.id_association,
          id_actualite : demandeSuppressionActualite.id_actualite,     
          etat : demandeSuppressionActualite.etat,
          date : demandeSuppressionActualite.date instanceof Timestamp ? demandeSuppressionActualite.date.toDate() : demandeSuppressionActualite.date,
        }));
      })
    );
  }

  getPendingDemandesSuppressionActualites(): Observable<DemandeSuppressionActualite[]> {
    let demandeSuppressionActualitesCollection = collection(this.fs, 'DemandeSuppressionActualite');
    return collectionData(demandeSuppressionActualitesCollection, { idField: 'id' }).pipe(
      map((demandeSuppressionActualite: any[]) => {
        return demandeSuppressionActualite
        .filter(demandeSuppressionActualite => demandeSuppressionActualite.etat === 'en_attente') 
        .map(demandeSuppressionActualite => ({
          id: demandeSuppressionActualite.id,
          id_association : demandeSuppressionActualite.id_association,
          id_actualite : demandeSuppressionActualite.id_actualite,     
          etat : demandeSuppressionActualite.etat,
          date : demandeSuppressionActualite.date instanceof Timestamp ? demandeSuppressionActualite.date.toDate() : demandeSuppressionActualite.date,
        }));
      })
    );
  }

  getAcceptedDemandesSuppressionActualites(): Observable<DemandeSuppressionActualite[]> {
    let demandeSuppressionActualitesCollection = collection(this.fs, 'DemandeSuppressionActualite');
    return collectionData(demandeSuppressionActualitesCollection, { idField: 'id' }).pipe(
      map((demandeSuppressionActualite: any[]) => {
        return demandeSuppressionActualite
        .filter(demandeSuppressionActualite => demandeSuppressionActualite.etat === 'accepté') 
        .map(demandeSuppressionActualite => ({
          id: demandeSuppressionActualite.id,
          id_association : demandeSuppressionActualite.id_association,
          id_actualite : demandeSuppressionActualite.id_actualite,     
          etat : demandeSuppressionActualite.etat,
          date : demandeSuppressionActualite.date instanceof Timestamp ? demandeSuppressionActualite.date.toDate() : demandeSuppressionActualite.date,
        }));
      })
    );
  }
  


  getDemandeModificationActualiteById(id: string): Observable<DemandeModificationActualite | undefined> {
    return this.getDemandesModificationsActualites().pipe(
      map(actualites => actualites.find(actualite => actualite.id === id))
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
    etat:actualiteToAdd.etat,
    description:actualiteData.description
};

return addDoc(collection(this.fs, 'DemandeActualite'), demandeData);
  
}

getActualiteById(id: string): Observable<Actualite | undefined> {
  return this.getActualites().pipe(
    map(actualites => actualites.find(actualite => actualite.id === id))
  );
}

getDemandeActualiteById(id: string): Observable<DemandeActualite | undefined> {
  return this.getPendingDemandesActualites().pipe(
    map(actualites => actualites.find(actualite => actualite.id === id))
  );
}


deleteActualiteById(id: string): Promise<void> {
  const actualiteRef = this.firestore.collection('Actualite').doc(id);
  return actualiteRef.delete();
}

supprimerActualite(actualite: Actualite): Observable<void> {
  const demandeSuppression: DemandeSuppressionActualite = {
    id_actualite: actualite.id,
    id_association: actualite.id_association,
    etat: 'en_attente',
    date: new Date()
  };

  return new Observable<void>(observer => {
    this.firestore.collection('DemandeSuppressionActualite').add(demandeSuppression)
      .then(() => {
        observer.next();
        observer.complete();
      })
      .catch(error => {
        observer.error(error);
      });
  });
}

checkPendingModificationDemand(actualiteId: string): Observable<boolean> {
  return this.firestore.collection<DemandeSuppressionActualite>('DemandeModificationActualite', ref =>
    ref.where('id_actualite', '==', actualiteId).where('etat', '==', 'en_attente')
  ).valueChanges().pipe(
    map(demands => demands.length > 0)
  );
}

checkPendingDeleteDemand(actualiteId: string): Observable<boolean> {
  return this.firestore.collection<DemandeModificationActualite>('DemandeSuppressionActualite', ref =>
    ref.where('id_actualite', '==', actualiteId).where('etat', '==', 'en_attente')
  ).valueChanges().pipe(
    map(demands => demands.length > 0)
  );
}

getModificationDateByActualiteId(actualiteId: string): Observable<string | undefined> {
  return this.firestore.collection<DemandeModificationActualite>('DemandeModificationActualite', ref =>
    ref.where('id_actualite', '==', actualiteId).where('etat', '==', 'en_attente')
  ).valueChanges().pipe(
    map(demands => {
      if (demands.length > 0) {
        const modificationDate = demands[0].date instanceof Timestamp ? demands[0].date.toDate() : demands[0].date;
        const day = modificationDate.getDate().toString().padStart(2, '0');
        const month = (modificationDate.getMonth() + 1).toString().padStart(2, '0'); // Notez que getMonth() retourne les mois de 0 à 11
        const year = modificationDate.getFullYear();

        return `${day}/${month}/${year}`;
      } else {
        return undefined;
      }
    })
  );
}

modifierActualite(actualiteDataToUpdate: Partial<Actualite>): Promise<void> {

  const demandeModification: DemandeModificationActualite = {
    id_actualite: actualiteDataToUpdate.id,
    id_association: actualiteDataToUpdate.id_association,
    titre: actualiteDataToUpdate.titre || '',
    description: actualiteDataToUpdate.description || '',
    image: actualiteDataToUpdate.image || '',
    etat:'en_attente',
    date: new Date()
  };

  return this.firestore.collection('DemandeModificationActualite').add(demandeModification)
    .then(() => {
      console.log('Demande de modification ajoutée avec succès.');
    })
    .catch(error => {
      console.error('Erreur lors de l\'ajout de la demande de modification :', error);
      throw new Error('Erreur lors de l\'ajout de la demande de modification.');
    });
}

updateActualiteField(id: string, fieldName: keyof Partial<Actualite>, newValue: any): Promise<void> {
  const actualiteRef = this.firestore.collection('Actualite').doc(id);
  const updatedField: Partial<Actualite> = {};
  updatedField[fieldName] = newValue;
  return actualiteRef.update(updatedField);
}

getActualiteTitleById(id: string): Observable<string | undefined> {
  return this.getActualiteById(id).pipe(
    map(collecte => collecte?.titre)
  )
}

}
