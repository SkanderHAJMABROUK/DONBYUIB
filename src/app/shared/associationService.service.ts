import { Injectable } from '@angular/core';

import { DocumentData, DocumentSnapshot, Firestore, addDoc, collection, collectionData, doc, getDoc ,} from '@angular/fire/firestore';


import { Association } from '../association';
import { Observable, from, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AssociationService {

  constructor(private fs:Firestore) { }

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

  //  getAssociationById(associationId: string) {
  //    const associationRef = doc(this.fs, 'Association', associationId);
  //   console.log("Association Ref:", associationRef); // Vérifiez la référence du document
    
  //   return from(getDoc(associationRef)).pipe(
  //     map((snapshot: DocumentSnapshot<DocumentData>) => {
  //       console.log("Snapshot:", snapshot); // Vérifiez le snapshot récupéré
  //       if (snapshot.exists()) {
  //         const data = snapshot.data();
  //         const id = associationRef.id; // Utilisez associationRef.id pour obtenir l'ID de l'association
  //         console.log("Data:", data); // Vérifiez les données récupérées
  //         console.log("ID:", id); // Vérifiez l'ID de l'association
  //         return { ...data, id } as unknown as Association;
  //       } else {
  //         console.log("Document does not exist."); // Le document n'existe pas
  //         return undefined;
  //       }
  //     })
  //   );
  // }

 
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
  


  delete(id:string){}
  }

