import { Injectable } from '@angular/core';
import { DocumentData, DocumentSnapshot, Firestore, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Association } from '../association';
import { Observable, from, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private fs:Firestore) { }


  
  getAssociations(){
    let association=collection(this.fs,'Association');
    return collectionData(association,{idField:'id'})
  }

  getAssociationById(associationId: string): Observable<Association | undefined> {
    const associationRef = doc(this.fs, 'Association', associationId);
    return from(getDoc(associationRef)).pipe(
      map((snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const id = snapshot.id;
          return { ...data, id } as unknown as Association;
        } else {
          return undefined;
        }
      })
    );}
 

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
