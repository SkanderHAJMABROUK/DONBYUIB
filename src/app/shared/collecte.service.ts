import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Firestore, collection } from 'firebase/firestore';
import { Collecte } from '../collecte';
import { Observable, map } from 'rxjs';
import { collectionData } from '@angular/fire/firestore';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';



import { Router } from '@angular/router';

import { DocumentData, DocumentSnapshot, addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Association } from '../association';
import {  from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollecteService {

  
 constructor(private fs:Firestore, private fireStorage : AngularFireStorage,  private firestore:AngularFirestore) { }

 collectes: Collecte[]=[]

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
        date_debut: collecte.date_debut,
        date_fin: collecte.date_fin,
       id_association:collecte.id_association,
      }));
    })
  );
 }

}
