import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';

import { DocumentData, DocumentSnapshot, Firestore, Timestamp, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Collecte } from '../interfaces/collecte';
import { Observable, Observer, from, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AssociationService } from './association.service';
import { DemandeCollecte } from '../interfaces/demande-collecte';
import { DemandeModificationCollecte } from '../interfaces/demande-modification-collecte';



@Injectable({
  providedIn: 'root'
})
export class CollecteService {

  
 constructor(private fs:Firestore, private fireStorage : AngularFireStorage,  private firestore:AngularFirestore, private route:Router) { }

 collectes: Collecte[]=[]
 showErrorNotification: boolean=false;

 collecteDetailShowModal:boolean=false;
 collecteModifierShowModal:boolean=false;

 showDetails: boolean = localStorage.getItem('service.showDetails') === 'true';



 getCollectes(): Observable<Collecte[]> {
  let collecteCollection = collection(this.fs, 'Collecte');
 return collectionData(collecteCollection, { idField: 'id' }).pipe(
   map((collectes: any[]) => {
      return collectes.map(collecte => ({
        id: collecte.id,
        nom: collecte.nom,
        etat:collecte.etat,
        description: collecte.description,
        image: collecte.image,
        montant: collecte.montant,
        date_debut: collecte.date_debut instanceof Timestamp ? collecte.date_debut.toDate() : collecte.date_debut,
        date_fin: collecte.date_fin instanceof Timestamp ? collecte.date_fin.toDate() : collecte.date_fin,
        id_association:collecte.id_association,
      }));
    })
  );
 }

 getPendingCollectes(): Observable<Collecte[]> {
  let collecteCollection = collection(this.fs, 'Collecte');
 return collectionData(collecteCollection, { idField: 'id' }).pipe(
   map((collectes: any[]) => {
      return collectes
      .filter(collecte => collecte.etat = 'en_attente')
      .map(collecte => ({
        id: collecte.id,
        nom: collecte.nom,
        etat:collecte.etat,
        description: collecte.description,
        image: collecte.image,
        montant: collecte.montant,
        date_debut: collecte.date_debut instanceof Timestamp ? collecte.date_debut.toDate() : collecte.date_debut,
        date_fin: collecte.date_fin instanceof Timestamp ? collecte.date_fin.toDate() : collecte.date_fin,
        id_association:collecte.id_association,
      }));
    })
  );
 }

 getAcceptedCollectes(): Observable<Collecte[]> {
  let collecteCollection = collection(this.fs, 'Collecte');
 return collectionData(collecteCollection, { idField: 'id' }).pipe(
   map((collectes: any[]) => {
      return collectes
      .filter(collecte => collecte.etat = 'accepté')
      .map(collecte => ({
        id: collecte.id,
        nom: collecte.nom,
        etat:collecte.etat,
        description: collecte.description,
        image: collecte.image,
        montant: collecte.montant,
        date_debut: collecte.date_debut instanceof Timestamp ? collecte.date_debut.toDate() : collecte.date_debut,
        date_fin: collecte.date_fin instanceof Timestamp ? collecte.date_fin.toDate() : collecte.date_fin,
        id_association:collecte.id_association,
      }));
    })
  );
 }

 getPendingDemandesCollectes(): Observable<DemandeCollecte[]> {
  let demandeCollecteCollection = collection(this.fs, 'DemandeCollecte');
  return collectionData(demandeCollecteCollection, { idField: 'id' }).pipe(
    map((demandesCollectes: any[]) => {
      return demandesCollectes
      .filter(demandeCollecte => demandeCollecte.etat === 'en_attente') 
      .map(demandeCollecte => ({
        id: demandeCollecte.id,
        id_association : demandeCollecte.id_association,
        id_collecte : demandeCollecte.id_collecte,
        nom : demandeCollecte.nom,
        description : demandeCollecte.description,
        image : demandeCollecte.image,
        etat : demandeCollecte.etat,
        montant : demandeCollecte.montant,
        date_debut : demandeCollecte.date_debut instanceof Timestamp ? demandeCollecte.date_debut.toDate() : demandeCollecte.date_debut,
        date_fin : demandeCollecte.date_fin instanceof Timestamp ? demandeCollecte.date_fin.toDate() : demandeCollecte.date_fin,
        date : demandeCollecte.date instanceof Timestamp ? demandeCollecte.date.toDate() : demandeCollecte.date ,

      }));
    })
  );
}

getAcceptedDemandesCollectes(): Observable<DemandeCollecte[]> {
  let demandeCollecteCollection = collection(this.fs, 'DemandeCollecte');
  return collectionData(demandeCollecteCollection, { idField: 'id' }).pipe(
    map((demandesCollectes: any[]) => {
      return demandesCollectes
      .filter(demandeCollecte => demandeCollecte.etat === 'accepté') 
      .map(demandeCollecte => ({
        id: demandeCollecte.id,
        id_association : demandeCollecte.id_association,
        id_collecte : demandeCollecte.id_collecte,
        nom : demandeCollecte.nom,
        description : demandeCollecte.description,
        image : demandeCollecte.image,
        etat : demandeCollecte.etat,
        montant : demandeCollecte.montant,
        date_debut : demandeCollecte.date_debut instanceof Timestamp ? demandeCollecte.date_debut.toDate() : demandeCollecte.date_debut,
        date_fin : demandeCollecte.date_fin instanceof Timestamp ? demandeCollecte.date_fin.toDate() : demandeCollecte.date_fin,
        date : demandeCollecte.date instanceof Timestamp ? demandeCollecte.date.toDate() : demandeCollecte.date ,

      }));
    })
  );
}

getDemandesModificationsCollectes(): Observable<DemandeModificationCollecte[]> {
  let demandeModificationCollectesCollection = collection(this.fs, 'DemandeModificationCollecte');
  return collectionData(demandeModificationCollectesCollection, { idField: 'id' }).pipe(
    map((demandeModificationCollecte: any[]) => {
      return demandeModificationCollecte
      .map(demandeModificationCollecte => ({
        id: demandeModificationCollecte.id,
        id_association : demandeModificationCollecte.id_association,
        id_collecte : demandeModificationCollecte.id_collecte,
        nom : demandeModificationCollecte.nom,
        description : demandeModificationCollecte.description,
        image : demandeModificationCollecte.image,
        date_debut : demandeModificationCollecte.date_debut,
        date_fin : demandeModificationCollecte.date_fin,      
        etat : demandeModificationCollecte.etat,
        date : demandeModificationCollecte.date instanceof Timestamp ? demandeModificationCollecte.date.toDate() : demandeModificationCollecte.date,
      }));
    })
  );
}


getPendingDemandesModificationsCollectes(): Observable<DemandeModificationCollecte[]> {
  let demandeModificationCollectesCollection = collection(this.fs, 'DemandeModificationCollecte');
  return collectionData(demandeModificationCollectesCollection, { idField: 'id' }).pipe(
    map((demandeModificationCollecte: any[]) => {
      return demandeModificationCollecte
      .filter(demandeModificationCollecte => demandeModificationCollecte.etat === 'en_attente') 
      .map(demandeModificationCollecte => ({
        id: demandeModificationCollecte.id,
        id_association : demandeModificationCollecte.id_association,
        id_collecte : demandeModificationCollecte.id_collecte,
        nom : demandeModificationCollecte.nom,
        description : demandeModificationCollecte.description,
        image : demandeModificationCollecte.image,
        date_debut : demandeModificationCollecte.date_debut,
        date_fin : demandeModificationCollecte.date_fin,      
        etat : demandeModificationCollecte.etat,
        date : demandeModificationCollecte.date instanceof Timestamp ? demandeModificationCollecte.date.toDate() : demandeModificationCollecte.date,
      }));
    })
  );
}

getAcceptedDemandesModificationsCollectes(): Observable<DemandeModificationCollecte[]> {
  let demandeModificationCollectesCollection = collection(this.fs, 'DemandeModificationCollecte');
  return collectionData(demandeModificationCollectesCollection, { idField: 'id' }).pipe(
    map((demandeModificationCollecte: any[]) => {
      return demandeModificationCollecte
      .filter(demandeModificationCollecte => demandeModificationCollecte.etat === 'accepté') 
      .map(demandeModificationCollecte => ({
        id: demandeModificationCollecte.id,
        id_association : demandeModificationCollecte.id_association,
        id_collecte : demandeModificationCollecte.id_collecte,
        nom : demandeModificationCollecte.nom,
        description : demandeModificationCollecte.description,
        image : demandeModificationCollecte.image,
        date_debut : demandeModificationCollecte.date_debut,
        date_fin : demandeModificationCollecte.date_fin,      
        etat : demandeModificationCollecte.etat,
        date : demandeModificationCollecte.date instanceof Timestamp ? demandeModificationCollecte.date.toDate() : demandeModificationCollecte.date,
      }));
    })
  );
}

getDemandeModificationCollecteById(id: string): Observable<DemandeModificationCollecte | undefined> {
  return this.getDemandesModificationsCollectes().pipe(
    map(collectes => collectes.find(collecte => collecte.id === id))
  );
}

 getCollectesByAssociationId(associationId: string): Observable<Collecte[]> {
  return this.getCollectes().pipe(
    map(collectes => collectes.filter(collecte => collecte.id_association === associationId))
  );
}

 getCollecteById(id: string): Observable<Collecte | undefined> {
  return this.getCollectes().pipe(
    map(collectes => collectes.find(collecte => collecte.id === id))
  );
}


getDemandeCollecteById(id: string): Observable<DemandeCollecte | undefined> {
  return this.getPendingDemandesCollectes().pipe(
    map(collectes => collectes.find(collecte => collecte.id === id))
  );
}

async uploadCover(file: File): Promise<string | null> {
  const filePath = `ImagesCollectes/${file.name}`;
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




getAssociationIdFromUrl():string{
  const urlParts = window.location.href.split('/');
  console.log(urlParts[urlParts.length - 1])
  return urlParts[urlParts.length - 1];
}




supprimerCollecte(collecte: Collecte): Observable<Collecte[]> {
  const collecteRef = this.firestore.collection('Collecte').doc(collecte.id);
  const updatedCollecteData = {
    ...collecte,
    etat: "suppression"
  };

  return new Observable<Collecte[]>(observer => {
    collecteRef.update(updatedCollecteData).then(() => {
      observer.next([]);
      observer.complete();
    }).catch(error => {
      observer.error(error);
    });
  });
}


modifierCollecte(collecteDataToUpdate: Partial<Collecte>): Promise<void> {

  const demandeModification: DemandeModificationCollecte = {
    id_collecte: collecteDataToUpdate.id,
    id_association: collecteDataToUpdate.id_association,
    nom: collecteDataToUpdate.nom || '',
    description: collecteDataToUpdate.description || '',
    image: collecteDataToUpdate.image || '',
    date_debut: collecteDataToUpdate.date_debut || new Date(),
    date_fin: collecteDataToUpdate.date_fin || new Date(),
    etat:'en_attente',
    date: new Date()
  };

  return this.firestore.collection('DemandeModificationCollecte').add(demandeModification)
    .then(() => {
      console.log('Demande de modification ajoutée avec succès.');
    })
    .catch(error => {
      console.error('Erreur lors de l\'ajout de la demande de modification :', error);
      throw new Error('Erreur lors de l\'ajout de la demande de modification.');
    });
}


ajouterCollecte(collecteData: Collecte) {

  const associationId=this.getAssociationIdFromUrl();
    
  const dataToAdd: Collecte = {
      nom: collecteData.nom,
      etat: "en_attente",
      description: collecteData.description,
      image: collecteData.image,
      montant: collecteData.montant,
      date_debut: collecteData.date_debut,
      date_fin: collecteData.date_fin,
      id_association:associationId,
      
  };
  return addDoc(collection(this.fs, 'Collecte'), dataToAdd);
}

async ajouterCollecteAndDemande(collecteData:Collecte){

  const associationId=this.getAssociationIdFromUrl();

  const collecteToAdd: Collecte = {
    nom: collecteData.nom,
    etat: "en_attente",
    description: collecteData.description,
    image: collecteData.image,
    montant: collecteData.montant,
    date_debut: collecteData.date_debut,
    date_fin: collecteData.date_fin,
    id_association:associationId,    
};

const collecteDocRef = await addDoc(collection(this.fs, 'Collecte'), collecteToAdd);
const actualiteId = collecteDocRef.id;

const demandeData: DemandeCollecte = {
  id_collecte: actualiteId,
  nom:collecteData.nom,
  etat:collecteToAdd.etat,
  description:collecteData.description,
  image: collecteData.image,
  montant: collecteData.montant,
  date_debut: collecteData.date_debut,
  date_fin: collecteData.date_fin,
  id_association:associationId,
  date: new Date()
}

return addDoc(collection(this.fs, 'DemandeCollecte'), demandeData);

}

deleteCollecteById(id: string): Promise<void> {
  const collecteRef = this.firestore.collection('Collecte').doc(id);
  return collecteRef.delete();
}

checkPendingModificationDemand(collecteId: string): Observable<boolean> {
  return this.firestore.collection<DemandeModificationCollecte>('DemandeModificationCollecte', ref =>
    ref.where('id_collecte', '==', collecteId).where('etat', '==', 'en_attente')
  ).valueChanges().pipe(
    map(demands => demands.length > 0) // Si la longueur des demandes en attente est supérieure à 0, retourne true, sinon false
  );
}

getModificationDateByCollecteId(collecteId: string): Observable<string | undefined> {
  return this.firestore.collection<DemandeModificationCollecte>('DemandeModificationCollecte', ref =>
    ref.where('id_collecte', '==', collecteId).where('etat', '==', 'en_attente')
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

updateCollecteField(id: string, fieldName: keyof Partial<Collecte>, newValue: any): Promise<void> {
  const collecteRef = this.firestore.collection('Collecte').doc(id);
  const updatedField: Partial<Collecte> = {};
  updatedField[fieldName] = newValue;
  return collecteRef.update(updatedField);
}


}
