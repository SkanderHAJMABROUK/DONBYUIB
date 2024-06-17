import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministrateurService } from 'src/app/services/administrateur.service';

@Component({
  selector: 'app-side-bar-admin',
  templateUrl: './side-bar-admin.component.html',
  styleUrls: ['./side-bar-admin.component.css'],
})
export class SideBarAdminComponent implements OnInit {
  constructor(public service: AdministrateurService) {}

  ngOnInit(): void {
    this.service
      .getPendingDemandeCollectesCount()
      .then((count) => {
        this.service.demandeCollectesCount = count;
      })
      .catch((error) => {
        console.error(error);
      });

    this.service
      .getPendingDemandeActualitesCount()
      .then((count) => {
        this.service.demandeActualitesCount = count;
      })
      .catch((error) => {
        console.error(error);
      });

    this.service
      .getPendingDemandeAssociationsCount()
      .then((count) => {
        this.service.demandeAssociationsCount = count;
      })
      .catch((error) => {
        console.error(error);
      });

    this.service
      .getPendingDemandeModificationAssociationsCount()
      .then((count) => {
        this.service.demandeModificationAssociationsCount = count;
      })
      .catch((error) => {
        console.error(error);
      });

    this.service
      .getPendingDemandeModificationCollectesCount()
      .then((count) => {
        this.service.demandeModificationCollectesCount = count;
      })
      .catch((error) => {
        console.error(error);
      });

    this.service
      .getPendingDemandeModificationActualitesCount()
      .then((count) => {
        this.service.demandeModificationActualitesCount = count;
      })
      .catch((error) => {
        console.error(error);
      });

    this.service
      .getPendingDemandeSuppressionActualitesCount()
      .then((count) => {
        this.service.demandeSuppressionActualitesCount = count;
      })
      .catch((error) => {
        console.error(error);
      });

    this.service
      .getPendingDemandeSuppressionCollectesCount()
      .then((count) => {
        this.service.demandeSuppressionCollectesCount = count;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  logOut() {
    this.service.logOut();
  }
}
