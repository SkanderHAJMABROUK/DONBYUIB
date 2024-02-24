import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private fs:Firestore) { }

  getAssociations(){
    let association=collection(this.fs,'Association');
    return collectionData(association,{idField:'id'})

  }
  getAssociationById(associationId: string) {
    const associationRef = doc(this.fs, 'Association', associationId);
    return getDoc(associationRef);
  }


  addAssociation(associationData: any){

    const dataToAdd = {
      nom: associationData.nom_association,
      description: associationData.description_association,
      email: associationData.email_association,
      telephone: associationData.num_association,
      logo: associationData.logo_association,
      id_fiscale: associationData.idfiscale_association,
      rib: associationData.rib_association,
      mdp: associationData.pwd_association,
      etat:"en_attente"
    };
    return addDoc(collection(this.fs, 'Association'), dataToAdd);


  }
  delete(id:string){}
}
