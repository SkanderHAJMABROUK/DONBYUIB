import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private fs:Firestore) { }

  get(){
    let association=collection(this.fs,'id_association');
    return collectionData(association,{idField:'id'})

  }
  add(){

  }
  delete(id:string){}
}
