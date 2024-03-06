import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeadBarComponent } from './head-bar/head-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './footer/footer.component';
import { InscrireAssociationComponent } from './inscrire-association/inscrire-association.component';
import {  HttpClientModule } from '@angular/common/http';
import { NgxCaptchaModule } from 'ngx-captcha';
import { RouterModule , RouterOutlet, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AssociationService} from './shared/associationService.service';
import { AssociationDemandeComponent } from './association-demande/association-demande.component';
import { AssociationListComponent } from './association-list/association-list.component';
import { ProfilAssociationComponent } from './profil-association/profil-association.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { CategorieComponent } from './categorie/categorie.component';
import { SideBarComponent } from './profil-association/side-bar/side-bar.component';
import { CollecteListComponent } from './collecte-list/collecte-list.component';
import { Firestore } from 'firebase/firestore';
import { ModifierAssociationComponent } from './modifier-association/modifier-association.component';
import { NgxSliderModule } from 'ngx-slider-v2';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { CollecteDetailsComponent } from './collecte-details/collecte-details.component';
import { CompteAssociationComponent } from './profil-association/compte-association/compte-association.component';
import { SinscrireComponent } from './sinscrire/sinscrire.component';
import { AjouterCollecteComponent } from './ajouter-collecte/ajouter-collecte.component';
import { ModifierCollecteComponent } from './modifier-collecte/modifier-collecte.component';
import { CollecteListAssociationComponent } from './collecte-list-association/collecte-list-association.component';
import { CollecteDetailsAssocationComponent } from './collecte-details-assocation/collecte-details-assocation.component';




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
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),

    RouterModule.forRoot([

      
      {path:'inscrireAssociation',component:InscrireAssociationComponent},
      {path:'Sinscrire',component:SinscrireComponent},


      {path:'listeAssociations',component:AssociationListComponent},
      { path: 'listeAssociations/details/:id', component: AssociationDemandeComponent },

      {path:'listeCollectes',component:CollecteListComponent},
      { path: 'listeCollectes/details/:id', component: CollecteDetailsComponent },



      {path:'login',component:LoginComponent},
      {path: 'login/profilAssociation/:id', component: ProfilAssociationComponent},

      {path:'login/profilAssociation/:id/compteAssociation', component:CompteAssociationComponent},


    ])
  ],
  providers: [AssociationService,AngularFirestore,AngularFireModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
