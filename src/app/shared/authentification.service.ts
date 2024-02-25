import { Injectable } from '@angular/core';
import { Firestore, 
        addDoc, 
        collection, 
        collectionData, 
        doc, 
        getDoc } from '@angular/fire/firestore';
import { Association } from '../association';
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private fs:Firestore) { }


  
  getAssociations(){
    let association=collection(this.fs,'Association');
    return collectionData(association,{idField:'id'})

  }
  // getAssociationById(selectedAssociation:Association) {
  //   const associationRef = doc(this.fs, 'Association', selectedAssociation);
  //   return getDoc(associationRef);
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
