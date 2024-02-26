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
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AssociationService} from './shared/associationService.service';
import { AssociationDemandeComponent } from './association-demande/association-demande.component';
import { AssociationListComponent } from './association-list/association-list.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireStorage } from '@angular/fire/compat/storage';



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
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxCaptchaModule,
    AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),


    RouterModule.forRoot([
      
      {path:'inscrireAssociation',component:InscrireAssociationComponent},
      {path:'listeAssociations',component:AssociationListComponent},
      {path:'login',component:LoginComponent},
      { path: 'listeAssociations/details/:id', component: AssociationDemandeComponent },


    ])

  ],
  providers: [AssociationService,
    AngularFireStorage],
  bootstrap: [AppComponent]
})
export class AppModule { }
