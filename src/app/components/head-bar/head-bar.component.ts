import { Component, OnInit } from '@angular/core';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Router} from '@angular/router';
import { AssociationService } from 'src/app/services/associationService.service';
import { Association } from 'src/app/interfaces/association';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-head-bar',
  templateUrl: './head-bar.component.html',
  styleUrls: ['./head-bar.component.css']
})
export class HeadBarComponent implements OnInit{
  isMenuOpen: boolean = false;
  faB = faBars;
  faX = faXmark;


  constructor(private  router: Router,
     public service:AssociationService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log("Menu opened:", this.isMenuOpen);
   
  }

 
  association!:Association|undefined;
  connexion=localStorage.getItem('connexion');
  nomAssociation=localStorage.getItem('nomAssociation');

ngOnInit()
{

  if(this.connexion && this.nomAssociation){
  this.service.connexion=this.connexion==='true';
  console.log(this.service.connexion);
  this.service.nomAssociation=this.nomAssociation;
}


}

}



