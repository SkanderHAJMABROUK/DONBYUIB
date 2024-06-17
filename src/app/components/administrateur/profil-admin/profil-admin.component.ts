import { Component, OnInit } from '@angular/core';
import { AdministrateurService } from 'src/app/services/administrateur.service';

@Component({
  selector: 'app-profil-admin',
  templateUrl: './profil-admin.component.html',
  styleUrls: ['./profil-admin.component.css'],
})
export class ProfilAdminComponent implements OnInit {
  constructor(public service: AdministrateurService) {}

  ngOnInit() {
    this.service.compte = true;
  }
}
