import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule  } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeadBarComponent } from './components/head-bar/head-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './components/footer/footer.component';
import { InscrireAssociationComponent } from './components/associations/inscrire-association/inscrire-association.component';
import {  HttpClientModule } from '@angular/common/http';
import { NgxCaptchaModule } from 'ngx-captcha';
import { RouterModule , RouterOutlet, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AssociationService} from './services/associationService.service';
import { AssociationDemandeComponent } from './components/associations/association-demande/association-demande.component';
import { AssociationListComponent } from './components/associations/association-list/association-list.component';
import { ProfilAssociationComponent } from './components/associations/profil-association/profil-association.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { CategorieComponent } from './components/categorie/categorie.component';
import { SideBarComponent } from './components/associations/side-bar/side-bar.component';
import { CollecteListComponent } from './components/collectes/collecte-list/collecte-list.component';
import { Firestore } from 'firebase/firestore';
import { ModifierAssociationComponent } from './components/associations/modifier-association/modifier-association.component';
import { NgxSliderModule } from 'ngx-slider-v2';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { CollecteDetailsComponent } from './components/collectes/collecte-details/collecte-details.component';
import { CompteAssociationComponent } from './components/associations/compte-association/compte-association.component';
import { SinscrireComponent } from './components/donateur/sinscrire/sinscrire.component';
import { AjouterCollecteComponent } from './components/collectes/ajouter-collecte/ajouter-collecte.component';
import { ModifierCollecteComponent } from './components/collectes/modifier-collecte/modifier-collecte.component';
import { CollecteListAssociationComponent } from './components/collectes/collecte-list-association/collecte-list-association.component';
import { CollecteDetailsAssocationComponent } from './components/collectes/collecte-details-assocation/collecte-details-assocation.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { ActualiteListComponent } from './components/actualites/actualite-list/actualite-list.component';
import { ActualiteListAssociationComponent } from './components/actualites/actualite-list-association/actualite-list-association.component';
import { AjouterActualiteComponent } from './components/actualites/ajouter-actualite/ajouter-actualite.component';
import { ActualiteDetailsAssociationsComponent } from './components/actualites/actualite-details-associations/actualite-details-associations.component';
import { ModifierActualiteComponent } from './components/actualites/modifier-actualite/modifier-actualite.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxSpinnerModule } from 'ngx-spinner';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ActualiteDetailsComponent } from './components/actualites/actualite-details/actualite-details.component';
import { ProfilDonateurComponent } from './components/donateur/profil-donateur/profil-donateur.component';
import { ModifierDonateurComponent } from './components/donateur/modifier-donateur/modifier-donateur.component';
import { SideBarAdminComponent } from './components/administrateur/side-bar/side-bar-admin.component';
import { ProfilAdminComponent } from './components/administrateur/profil-admin/profil-admin.component';
import { CrudUtilisateursComponent } from './components/administrateur/crud-utilisateurs/crud-utilisateurs.component';
import { CrudAssociationsComponent } from './components/administrateur/crud-associations/crud-associations.component';
import { AjouterDonateurAdminComponent } from './components/administrateur/ajouter-donateur-admin/ajouter-donateur-admin.component';
import { AjouterAssociationAdminComponent } from './components/administrateur/ajouter-association-admin/ajouter-association-admin.component';
import { DetailsAssociationAdminComponent } from './components/administrateur/details-association-admin/details-association-admin.component';
import { ModifierAssociationAdminComponent } from './components/administrateur/modifier-association-admin/modifier-association-admin.component';
import { CrudCollectesComponent } from './components/administrateur/crud-collectes/crud-collectes.component';
import { DetailsDonateurAdminComponent } from './components/administrateur/details-donateur-admin/details-donateur-admin.component';
import { ModifierDonateurAdminComponent } from './components/administrateur/modifier-donateur-admin/modifier-donateur-admin.component';
import { DetailsCollecteAdminComponent } from './components/administrateur/details-collecte-admin/details-collecte-admin.component';
import { ModifierCollecteAdminComponent } from './components/administrateur/modifier-collecte-admin/modifier-collecte-admin.component';
import { DetailsActualiteAdminComponent } from './components/administrateur/details-actualite-admin/details-actualite-admin.component';
import { ModifierActualiteAdminComponent } from './components/administrateur/modifier-actualite-admin/modifier-actualite-admin.component';
import { CrudActualitesComponent } from './components/administrateur/crud-actualites/crud-actualites.component';
import { DemandesAssociationsComponent } from './components/administrateur/demandes-associations/demandes-associations.component';
import { AjouterActualiteAdminComponent } from './components/administrateur/ajouter-actualite-admin/ajouter-actualite-admin.component';
import { AjouterCollecteAdminComponent } from './components/administrateur/ajouter-collecte-admin/ajouter-collecte-admin.component';
import { LoginAdminComponent } from './components/administrateur/login-admin/login-admin.component';
import { CompteAdminComponent } from './components/administrateur/compte-admin/compte-admin.component';
import { DemandesActualitesComponent } from './components/administrateur/demandes-actualites/demandes-actualites.component';
import { CommonModule } from '@angular/common';
import { DemandesCollectesComponent } from './components/administrateur/demandes-collectes/demandes-collectes.component';
import { DemandeAssociationDetailsComponent } from './components/administrateur/demande-association-details/demande-association-details.component';
import { DemandeActualiteDetailsComponent } from './components/administrateur/demande-actualite-details/demande-actualite-details.component';
import { DemandeCollecteDetailsComponent } from './components/administrateur/demande-collecte-details/demande-collecte-details.component';
import { ChatDialogComponent } from './components/chat-dialog/chat-dialog.component';

const firebaseConfig = {
  apiKey: "AIzaSyCLddLKQR_QtXMBEdt1yIO7vHp6jeWOA9U",
  authDomain: "donbyuib.firebaseapp.com",
  projectId: "donbyuib",
  storageBucket: "donbyuib.appspot.com",
  messagingSenderId: "586021322511",
  appId: "1:586021322511:web:fe97e78a0e10165d2b487a",
  measurementId: "G-D749N7NPLF"
};


@NgModule({
  declarations: [
    AppComponent,
    HeadBarComponent,
    FooterComponent,
    InscrireAssociationComponent,
    LoginComponent,
    AssociationDemandeComponent,
    AssociationListComponent,
    ProfilAssociationComponent,
    CategorieComponent,
    SideBarComponent,
    CollecteListComponent,
    ModifierAssociationComponent,
    CollecteDetailsComponent,
    CompteAssociationComponent,
    SinscrireComponent,
    AjouterCollecteComponent,
    ModifierCollecteComponent,
    CollecteListAssociationComponent,
    CollecteDetailsAssocationComponent,
    EmailVerificationComponent,
    ActualiteListComponent,
    ActualiteListAssociationComponent,
    AjouterActualiteComponent,
    ActualiteDetailsAssociationsComponent,
    ModifierActualiteComponent,
    ActualiteDetailsComponent,
    ProfilDonateurComponent,
    ModifierDonateurComponent,
    SideBarAdminComponent,
    ProfilAdminComponent,
    CrudUtilisateursComponent,
    CrudAssociationsComponent,
    AjouterDonateurAdminComponent,
    AjouterAssociationAdminComponent,
    DetailsAssociationAdminComponent,
    ModifierAssociationAdminComponent,
    CrudCollectesComponent,
    CrudActualitesComponent,
    DetailsDonateurAdminComponent,
    ModifierDonateurAdminComponent,
    DetailsCollecteAdminComponent,
    ModifierCollecteAdminComponent,
    DetailsActualiteAdminComponent,
    ModifierActualiteAdminComponent,
 
    DemandesAssociationsComponent,

    AjouterActualiteAdminComponent,
    AjouterCollecteAdminComponent,
    LoginAdminComponent,
    CompteAdminComponent,
    DemandesActualitesComponent,
    DemandesCollectesComponent,

    DemandeAssociationDetailsComponent,
    DemandeActualiteDetailsComponent,
    DemandeCollecteDetailsComponent,
    
  
    ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFirestoreModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxCaptchaModule,
    NgxSliderModule,
    NgxSpinnerModule,
    CarouselModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),

    RouterModule.forRoot([
      {path:'admin',component:LoginAdminComponent},
      {path:'admin/profil/:id',component:ProfilAdminComponent},

      {path:'chatbot',component:ChatDialogComponent},


      {path:'inscrireAssociation',component:InscrireAssociationComponent},
      {path:'inscrireAssociation/email',component:EmailVerificationComponent},

      {path:'',component:ActualiteListComponent},

      {path:'Sinscrire',component:SinscrireComponent},
      {path:'sinscrire/email',component:EmailVerificationComponent},

      {path:'listeAssociations',component:AssociationListComponent},
      { path: 'listeAssociations/details/:id', component: AssociationDemandeComponent },

      {path:'listeCollectes',component:CollecteListComponent},
      { path: 'listeCollectes/details/:id', component: CollecteDetailsComponent },

      {path:'listeActualites',component:ActualiteListComponent},
      { path: 'listeActualites/details/:id', component: ActualiteDetailsComponent },


      {path:'login',component:LoginComponent},
      {path: 'login/profilAssociation/:id', component: ProfilAssociationComponent},
      {path: 'login/profilDonateur/:id', component: ProfilDonateurComponent},
      {path: 'login/profilDonateur/:id/modifier', component: ModifierDonateurComponent},


    

      {path:'login/profilAssociation/:id/compteAssociation', component:CompteAssociationComponent},

      



    ])
  ],
  providers: [AssociationService,AngularFirestore,AngularFireModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
