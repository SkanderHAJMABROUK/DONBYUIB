import { Component, HostListener, OnInit } from '@angular/core';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Router} from '@angular/router';
import { AssociationService } from 'src/app/services/association.service';
import { Association } from 'src/app/interfaces/association';
import { CookieService } from 'ngx-cookie-service';
import { DonateurService } from 'src/app/services/donateur.service';


@Component({
  selector: 'app-head-bar',
  templateUrl: './head-bar.component.html',
  styleUrls: ['./head-bar.component.css']
})
export class HeadBarComponent implements OnInit{

  isMenuOpen: boolean = false;
  faB = faBars;
  faX = faXmark;
  association!:Association|undefined;
  connexion=localStorage.getItem('connexion');
  nomAssociation=localStorage.getItem('nomAssociation');

  connexionDonateur=localStorage.getItem('connexionDonateur');
  nomDonateur=localStorage.getItem('nomDonateur');
  prenomDonateur=localStorage.getItem('prenomDonateur');

  associationid=localStorage.getItem('associationId');
  donateurid=localStorage.getItem('donateurId');

  constructor(private  router: Router,
     public serviceAssociation:AssociationService,public serviceDonateur:DonateurService) {}
   

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;   
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  ngOnInit() {
    if (this.connexion === 'true' && this.nomAssociation) {
      this.serviceAssociation.connexion = true;
      this.serviceAssociation.nomAssociation = this.nomAssociation;
    } else {
      // Si la connexion est fausse, effacez le nom de l'association
      this.serviceAssociation.connexion = false;
      this.serviceAssociation.nomAssociation = undefined;
    }
  
    if (this.connexionDonateur === 'true' && this.nomDonateur && this.prenomDonateur) {
      this.serviceDonateur.connexionDonateur = true;
      this.serviceDonateur.nomDonateur = this.nomDonateur;
      this.serviceDonateur.prenomDonateur = this.prenomDonateur;
    }
  }
  

logoutDonateur(){
  this.serviceDonateur.logOut();
}

}