import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';

import { DocumentData, DocumentSnapshot, Firestore, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Association } from '../association';
import { Observable, from, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root' 
})
export class AssociationService {
  showErrorNotification: boolean=false;


  constructor(private fs:Firestore, private fireStorage : AngularFireStorage,  private firestore:AngularFirestore, private route:Router) { }

  showDetails: boolean = localStorage.getItem('service.showDetails') === 'true';
 
 

  
  
  getAssociations(): Observable<Association[]> {
    let associationCollection = collection(this.fs, 'Association');
    return collectionData(associationCollection, { idField: 'id' }).pipe(
      map((associations: any[]) => {
        return associations.map(association => ({
          id: association.id,
          nom: association.nom,
          etat: association.etat,
          categorie: association.categorie,
          description: association.description,
          email: association.email,
          id_fiscale: association.id_fiscale,
          logo: association.logo,
          mdp: association.mdp,
          rib: association.rib,
          telephone: association.telephone
        }));
      })
    );
  }

  getAssociationById(id: string): Observable<Association | undefined> {
    return this.getAssociations().pipe(
      map(associations => associations.find(association => association.id === id))
    );
  }





  getAssociationByEmailAndPassword(email: string, password: string): Observable<Association | undefined> {
    return this.getAssociations().pipe(
      map(associations => associations.find(association => association.email === email && association.mdp === password))
    );
  }
  
  connexion: boolean = localStorage.getItem('this.connexion') === 'true';
  nomAssociation: string = localStorage.getItem('this.nomAssociation') || '';






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
  


modifierAssociation(id: string, associationDataToUpdate: Partial<Association>): Promise<void> {
  const associationRef = this.firestore.collection('Association').doc(id);
  return associationRef.update(associationDataToUpdate);
}


id!:string|undefined;

logIn(email:string,password:string){
 

    this.getAssociationByEmailAndPassword(email,password).subscribe(
      (association) => {
        if (association) {
          this.connexion=true;
          this.nomAssociation=association.nom;
          this.id=association?.id;
          console.log(this.id);
          localStorage.setItem(this.nomAssociation, association.nom);
          console.log(this.nomAssociation)
          localStorage.setItem('this.service.connexion','true');
          this.route.navigate(['/login/profilAssociation',association.id]);
          console.log(this.connexion)
        } else {
          this.showErrorNotification = true;
          console.error('Aucune association trouvée avec cet e-mail et ce mot de passe.');
        }
      },
      (error) => {
        console.error('Erreur lors de la recherche de l\'association:', error);
      }
    );

}


logOut(){
  this.connexion=false;
   localStorage.setItem('this.service.connexion','false');
   localStorage.removeItem(this.nomAssociation);
   this.route.navigate(['/login']);
   console.log(this.connexion  )
 
  
 }



  async uploadLogo(file: File): Promise<string | null> {
    const filePath = `LogosAssociations/${file.name}`;
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

  async uploadPDF(file: File): Promise<string | null> {
    const filePath = `IDFiscauxAssociations/${file.name}`;
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
