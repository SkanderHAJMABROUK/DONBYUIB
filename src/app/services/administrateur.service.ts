import { Injectable } from '@angular/core';

import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Firestore, addDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Association } from '../interfaces/association';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { sha256 } from 'js-sha256';
import { HttpClient } from '@angular/common/http';
import { Log } from '../interfaces/log';
import { LogService } from './log.service';
import { AssociationService } from './association.service';
import { Admin } from '../interfaces/admin';
import { DonAssociation } from '../interfaces/don-association';
import { DonCollecte } from '../interfaces/don-collecte';
import { Collecte } from '../interfaces/collecte';

@Injectable({
  providedIn: 'root'
})
export class AdministrateurService {

  compte: boolean = localStorage.getItem('compte') === 'true';

  showErrorNotification:boolean=false;
  associationDetailShowModal:boolean=false;
  associationModifierShowModal:boolean=false;
  collecteDetailShowModal:boolean=false;
  collecteModifierShowModal:boolean=false;
  actualiteDetailShowModal:boolean=false;
  actualiteModifierShowModal:boolean=false;
  donateurDetailShowModal:boolean=false;
  donateurModifierShowModal:boolean=false;

  ajouterAssociation:boolean=false;
  ajouterDonateur:boolean=false;
  ajouterCollecte:boolean=false;
  ajouterActualite:boolean=false;

  demandeAssociations:boolean=false;
  demandeActualite:boolean=false;
  demandeCollecte:boolean=false;

  crudUtilisateurs:boolean = false;
  crudAssociations:boolean = false;
  crudCollectes:boolean = false;
  crudActualites:boolean = false;

  demandeModificationAssociation:boolean = false;
  demandeModificationAssociationDetails:boolean = false;
  demandeModificationCollecte:boolean = false;
  demandeModificationCollecteDetails:boolean = false;
  demandeModificationActualite:boolean = false;
  demandeModificationActualiteDetails:boolean = false;

  demandeSuppressionActualite:boolean = false;
  demandeSuppressionActualiteDetails:boolean = false;
  demandeSuppressionCollecte:boolean = false;
  demandeSuppressionCollecteDetails:boolean = false;

  demandeCollectesCount: number = 0;
  demandeAssociationsCount: number = 0;
  demandeActualitesCount: number = 0;
  demandeModificationAssociationsCount: number = 0;
  demandeModificationCollectesCount: number = 0;
  demandeModificationActualitesCount: number = 0;
  demandeSuppressionActualitesCount: number = 0;
  demandeSuppressionCollectesCount: number = 0;


  id!:string|null;

  constructor(private fs:Firestore,public associationService:AssociationService,private firestore:AngularFirestore,private route:Router) { }

  addAssociation(associationData: Association) {

    // Génération du sel
    const salt: string = this.associationService.generateSalt(16);
    // Hachage du mot de passe avec salage
    const hashedPassword: string = sha256(associationData.mdp+salt).toString();

    const dataToAdd: Association = {
        nom: associationData.nom,
        description: associationData.description,
        categorie: associationData.categorie,
        adresse: associationData.adresse,
        gouvernerat: associationData.gouvernerat,
        email: associationData.email,
        telephone: associationData.telephone,
        logo: associationData.logo,
        id_fiscale: associationData.id_fiscale,
        rib: associationData.rib, // Stockage du mot de passe haché
        mdp: hashedPassword,
        etat: "actif",
        salt:salt //Stockage du sel
    };
    return addDoc(collection(this.fs, 'Association'), dataToAdd);
}

modifierAssociation(assocation: Association): Promise<void> {
  const updatedAssociationData = {
    ...assocation,
    etat: "modification_acceptée"
  };
  let associationRef = this.firestore.collection('Association').doc(assocation.id); 
  return associationRef.update(updatedAssociationData);
}

getAdminByLoginAndPassword(login: string, password: string): Observable<Admin | undefined> {
  return this.firestore.collection<Admin>('Admin', ref => ref.where('login', '==', login).where('mdp', '==', password))
    .valueChanges({ idField: 'id' })
    .pipe(
      map(admins => admins[0]) // Supposant que le login est unique, nous prenons le premier élément trouvé
    );
}


getAdminById(adminId: string): Observable<Admin | undefined> {
  return this.firestore.collection<Admin>('Admin').doc(adminId).valueChanges({ idField: 'id' });
}

logOut() {
  this.compte = false;
  localStorage.removeItem('compte');
  localStorage.removeItem('adminId'); // Supprimez l'ID de l}
  this.route.navigate(['/admin'], { replaceUrl: true });
}

logIn(login: string, password: string): Observable<boolean> {
  return this.getAdminByLoginAndPassword(login, password).pipe(
    map(admin => {
      if (admin) {
        this.compte = true;
        localStorage.setItem('compte', 'true');
        localStorage.setItem('adminId', 'admin.id');
        this.id=localStorage.getItem('adminId');
        this.route.navigate(['/admin/profil', admin.id], { replaceUrl: true }); // Rediriger avec l'ID de l'administrateur dans l'URL
        return true; // Connexion réussie
      } else {
        this.showErrorNotification = true;
        console.error('Aucun administrateur trouvé avec ce login et ce mot de passe.');
        return false; // Connexion échouée
      }
    }),
    catchError(error => {
      console.error('Erreur lors de la recherche de l\'administrateur:', error);
      return of(false); // Retourner false en cas d'erreur
    })
  );
}

async getPendingDemandeCollectesCount(): Promise<number> {
  try {
    const querySnapshot = await this.firestore.collection('DemandeCollecte', ref => ref.where('etat', '==', 'en_attente')).get().toPromise();
    
    if (!querySnapshot) {
      console.error('Query snapshot is undefined');
      return 0;
    }
    
    return querySnapshot.size;
  } catch (error) {
    return 0;
  }
}

async getPendingDemandeActualitesCount(): Promise<number> {
  try {
    const querySnapshot = await this.firestore.collection('DemandeActualite', ref => ref.where('etat', '==', 'en_attente')).get().toPromise();
    
    if (!querySnapshot) {
      console.error('Query snapshot is undefined');
      return 0;
    }

    return querySnapshot.size;
  } catch (error) {
    return 0;
  }
}

async getPendingDemandeAssociationsCount(): Promise<number> {
  try {
    const querySnapshot = await this.firestore.collection('DemandeAssociation', ref => ref.where('etat', '==', 'en_attente')).get().toPromise();
    
    if (!querySnapshot) {
      console.error('Query snapshot is undefined');
      return 0;
    }
    
    return querySnapshot.size;
  } catch (error) {
    return 0;
  }
}

async getPendingDemandeModificationAssociationsCount(): Promise<number> {
  try {
    const querySnapshot = await this.firestore.collection('DemandeModificationAssociation', ref => ref.where('etat', '==', 'en_attente')).get().toPromise();
    
    if (!querySnapshot) {
      console.error('Query snapshot is undefined');
      return 0;
    }
    
    return querySnapshot.size;
  } catch (error) {
    return 0;
  }
}

async getPendingDemandeModificationCollectesCount(): Promise<number> {
  try {
    const querySnapshot = await this.firestore.collection('DemandeModificationCollecte', ref => ref.where('etat', '==', 'en_attente')).get().toPromise();
    
    if (!querySnapshot) {
      console.error('Query snapshot is undefined');
      return 0;
    }
    
    return querySnapshot.size;
  } catch (error) {
    return 0;
  }
}

async getPendingDemandeModificationActualitesCount(): Promise<number> {
  try {
    const querySnapshot = await this.firestore.collection('DemandeModificationActualite', ref => ref.where('etat', '==', 'en_attente')).get().toPromise();
    
    if (!querySnapshot) {
      console.error('Query snapshot is undefined');
      return 0;
    }
    
    return querySnapshot.size;
  } catch (error) {
    return 0;
  }
}

async getPendingDemandeSuppressionActualitesCount(): Promise<number> {
  try {
    const querySnapshot = await this.firestore.collection('DemandeSuppressionActualite', ref => ref.where('etat', '==', 'en_attente')).get().toPromise();
    
    if (!querySnapshot) {
      console.error('Query snapshot is undefined');
      return 0;
    }
    
    return querySnapshot.size;
  } catch (error) {
    return 0;
  }
}

async getPendingDemandeSuppressionCollectesCount(): Promise<number> {
  try {
    const querySnapshot = await this.firestore.collection('DemandeSuppressionCollecte', ref => ref.where('etat', '==', 'en_attente')).get().toPromise();
    
    if (!querySnapshot) {
      console.error('Query snapshot is undefined');
      return 0;
    }
    
    return querySnapshot.size;
  } catch (error) {
    return 0;
  }
}

async getAssociationsByCategory(): Promise<Association[]> {
  try {
    const associationDocs = await getDocs(collection(this.fs, 'Association'));
    const associations: Association[] = [];
    associationDocs.forEach(doc => {
      associations.push({id: doc.id, ...doc.data()} as Association);
    });
    return associations;
  } catch (error) {
    console.error('Error getting associations by category:', error);
    return [];
  }
}

getAllDonAssociation(): Observable<DonAssociation[]> {
  return this.firestore.collection<DonAssociation>('DonAssociation').valueChanges();
}

getAllDonCollecte(): Observable<DonCollecte[]> {
  return this.firestore.collection<DonCollecte>('DonCollecte').valueChanges();
}

getAssociationIdFromCollecte(collecteId: string): Observable<string | undefined> {
  return this.firestore.doc<DonCollecte>(`DonCollecte/${collecteId}`).valueChanges()
    .pipe(
      switchMap((donCollecte: DonCollecte | undefined) => {
        if (!donCollecte) {
          return [];
        }
        return this.firestore.doc<Collecte>(`Collecte/${donCollecte.id_collecte}`).valueChanges();
      }),
      map((collecte: Collecte | undefined) => collecte?.id_association)
    );
}

}
