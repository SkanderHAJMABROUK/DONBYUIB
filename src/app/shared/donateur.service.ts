import { Donateur } from '../donateur';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';

import { DocumentData, DocumentSnapshot, Firestore, Timestamp, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';



@Injectable({
  providedIn: 'root'
})
export class DonateurService {

  constructor(private fs:Firestore, private fireStorage : AngularFireStorage,  private firestore:AngularFirestore, private route:Router) { }




  ajouterDonateur(donateur: Donateur) {

    const dataToAdd: Donateur = {
        nom: donateur.nom,
        prenom: donateur.prenom,
        photo: donateur.photo,
        date_de_naissance:donateur.date_de_naissance,
        email: donateur.email,
        mdp: donateur.mdp,
    };
    return addDoc(collection(this.fs, 'Donateur'), dataToAdd);
}
  
async uploadPhoto(file: File): Promise<string | null> {
  const filePath = `PhotosDonateurs/${file.name}`;
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


}
