import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministrateurService } from 'src/app/services/administrateur.service';

@Component({
  selector: 'app-side-bar-admin',
  templateUrl: './side-bar-admin.component.html',
  styleUrls: ['./side-bar-admin.component.css']
})
export class SideBarAdminComponent implements OnInit{

  

  constructor(public service:AdministrateurService){}

  ngOnInit(): void {

    this.service.getPendingDemandeCollectesCount().then(count => {
      this.service.demandeCollectesCount = count;
    }).catch(error => {
      console.error('Error fetching demande collectes count:', error);
    });

    this.service.getPendingDemandeActualitesCount().then(count => {
      this.service.demandeActualitesCount = count;
    }).catch(error => {
      console.error('Error fetching demande actualites count:', error);
    });

    this.service.getPendingDemandeAssociationsCount().then(count => {
      this.service.demandeAssociationsCount = count;
    }).catch(error => {
      console.error('Error fetching demande associations count:', error);
    });

    this.service.getPendingDemandeModificationAssociationsCount().then(count => {
      this.service.demandeModificationAssociationsCount = count;
    }).catch(error => {
      console.error('Error fetching demande associations count:', error);
    });

   }

   logOut() {
    this.service.logOut();
  }

}
