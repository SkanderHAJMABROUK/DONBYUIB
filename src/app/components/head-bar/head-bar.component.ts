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
  connexion=sessionStorage.getItem('connexion');
  nomAssociation=sessionStorage.getItem('nomAssociation');

  connexionDonateur=sessionStorage.getItem('connexionDonateur');
  nomDonateur=sessionStorage.getItem('nomDonateur');
  prenomDonateur=sessionStorage.getItem('prenomDonateur');

  constructor(private  router: Router,
     public serviceAssociation:AssociationService,public serviceDonateur:DonateurService) {}
   

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;   
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

ngOnInit()
{

  if(this.connexion && this.nomAssociation){
  this.serviceAssociation.connexion=this.connexion==='true';
  console.log(this.serviceAssociation.connexion);
  this.serviceAssociation.nomAssociation=this.nomAssociation;
}
if(this.connexionDonateur && this.nomDonateur && this.prenomDonateur){
  this.serviceDonateur.connexionDonateur=this.connexionDonateur==='true';
  console.log(this.serviceDonateur.connexionDonateur);
  this.serviceDonateur.nomDonateur=this.nomDonateur;
  this.serviceDonateur.prenomDonateur=this.prenomDonateur;

}


}

logoutDonateur(){
  this.serviceDonateur.logOut();
  
}

}