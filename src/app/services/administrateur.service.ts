import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

import { DocumentData, DocumentSnapshot, Firestore, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Association } from '../interfaces/association';
import { Observable, catchError, from, map, of, throwError } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CookieService } from 'ngx-cookie-service';
import { sha256 } from 'js-sha256';
import { HttpClient } from '@angular/common/http';
import { Log } from '../interfaces/log';
import { LogService } from './log.service';
import { AssociationService } from './associationService.service';

@Injectable({
  providedIn: 'root'
})
export class AdministrateurService {

  compte: boolean = true;

  crudUtilisateurs:boolean = false;
  crudAssociations:boolean = false;

  constructor(private fs:Firestore,public serviceAssociation:AssociationService) { }

  addAssociation(associationData: Association) {

    // Génération du sel
    const salt: string = this.serviceAssociation.generateSalt(16);
    // Hachage du mot de passe avec salage
    const hashedPassword: string = sha256(associationData.mdp+salt).toString();

    const dataToAdd: Association = {
        nom: associationData.nom,
        description: associationData.description,
        categorie: associationData.categorie,
        adresse: associationData.adresse,
        email: associationData.email,
        telephone: associationData.telephone,
        logo: associationData.logo,
        id_fiscale: associationData.id_fiscale,
        rib: associationData.rib, // Stockage du mot de passe haché
        mdp: hashedPassword,
        etat: "ajout",
        salt:salt //Stockage du sel
    };
    return addDoc(collection(this.fs, 'Association'), dataToAdd);
}
  

}
