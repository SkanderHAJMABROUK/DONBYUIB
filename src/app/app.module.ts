import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
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
  ],
  imports: [
    BrowserModule,
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
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),

    RouterModule.forRoot([

      
      {path:'inscrireAssociation',component:InscrireAssociationComponent},
      {path:'inscrireAssociation/email',component:EmailVerificationComponent},



      {path:'Sinscrire',component:SinscrireComponent},


      {path:'listeAssociations',component:AssociationListComponent},
      { path: 'listeAssociations/details/:id', component: AssociationDemandeComponent },

      {path:'listeCollectes',component:CollecteListComponent},
      { path: 'listeCollectes/details/:id', component: CollecteDetailsComponent },

      {path:'listeActualites',component:ActualiteListComponent},
      { path: 'listeActualites/details/:id', component: ActualiteDetailsComponent },


      {path:'login',component:LoginComponent},
      {path: 'login/profilAssociation/:id', component: ProfilAssociationComponent},
      {path: 'login/profilAssociation/:id/liste-actualites-association', component: ActualiteListAssociationComponent},

    

      {path:'login/profilAssociation/:id/compteAssociation', component:CompteAssociationComponent},

      



    ])
  ],
  providers: [AssociationService,AngularFirestore,AngularFireModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
