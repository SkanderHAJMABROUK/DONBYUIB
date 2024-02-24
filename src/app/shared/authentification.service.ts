import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private fs:Firestore) { }

  getAssociations(){
    let association=collection(this.fs,'id_association');
    return collectionData(association,{idField:'id'})

  }
  addAssociation(){
    

  }
  delete(id:string){}
}
