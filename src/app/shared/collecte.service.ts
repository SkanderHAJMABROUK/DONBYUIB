import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';

import { DocumentData, DocumentSnapshot, Firestore, Timestamp, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Collecte } from '../collecte';
import { Observable, from, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AssociationService } from './associationService.service';



@Injectable({
  providedIn: 'root'
})
export class CollecteService {

  
 constructor(private fs:Firestore, private fireStorage : AngularFireStorage,  private firestore:AngularFirestore, private route:Router) { }

 collectes: Collecte[]=[]
 showErrorNotification: boolean=false;


 showDetails: boolean = localStorage.getItem('service.showDetails') === 'true';



 getCollectes(): Observable<Collecte[]> {
  let collecteCollection = collection(this.fs, 'Collecte');
 return collectionData(collecteCollection, { idField: 'id' }).pipe(
   map((collectes: any[]) => {
      return collectes.map(collecte => ({
        id: collecte.id,
        nom: collecte.nom,
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





async uploadLogo(file: File): Promise<string | null> {
  const filePath = `ImagesCollectes/${file.name}`;
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




getAssociationIdFromUrl():string{
  const urlParts = window.location.href.split('/');
  console.log(urlParts[urlParts.length - 1])
  return urlParts[urlParts.length - 1];
}



modifierCollecte(id: string, collecteDataToUpdate: Partial<Collecte>): Promise<void> {
  const collecteRef = this.firestore.collection('Collecte').doc(id);
  return collecteRef.update(collecteDataToUpdate);
}



ajouterCollecte(collecteData: Collecte) {

  const associationId=this.getAssociationIdFromUrl();
    
  const dataToAdd: Collecte = {
      nom: collecteData.nom,
      description: collecteData.description,
      image: collecteData.image,
      montant: collecteData.montant,
      date_debut: collecteData.date_debut,
      date_fin: collecteData.date_fin,
      id_association:associationId,
      
  };
  return addDoc(collection(this.fs, 'Collecte'), dataToAdd);
}


}
