import { Component } from '@angular/core';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Router} from '@angular/router';
import { AssociationService } from '../shared/associationService.service';
import { Association } from '../association';

@Component({
  selector: 'app-head-bar',
  templateUrl: './head-bar.component.html',
  styleUrls: ['./head-bar.component.css']
})
export class HeadBarComponent {
  isMenuOpen: boolean = false;
  faB = faBars;
  faX = faXmark;
 

  constructor(private  router: Router, public service:AssociationService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log("Menu opened:", this.isMenuOpen);
   
  }

 
  association!:Association|undefined;
ngOnInit()
{

  const connexion=localStorage.getItem('this.service.connexion');
   const nomAssociation=localStorage.getItem(this.service.nomAssociation);
  if(connexion!=null && nomAssociation!=null){
  this.service.connexion=connexion==='true';
  console.log(this.service.connexion);
  this.service.nomAssociation=nomAssociation;
}


}

}



