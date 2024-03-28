import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';

import { DocumentData, DocumentSnapshot, Firestore, Timestamp, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Collecte } from '../interfaces/collecte';
import { Observable, Observer, from, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AssociationService } from './associationService.service';
import { DemandeCollecte } from '../interfaces/demande-collecte';



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


modifierCollecte(collecte: Collecte): Promise<void> {
  const updatedCollecteData = {
    ...collecte,
    etat: "modification"
  };
  let collecteRef = this.firestore.collection('Collecte').doc(collecte.id); 
  return collecteRef.update(updatedCollecteData);
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


}
