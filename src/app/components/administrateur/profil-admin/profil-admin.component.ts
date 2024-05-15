import { Component } from '@angular/core';
import { AdministrateurService } from 'src/app/services/administrateur.service';


@Component({
  selector: 'app-profil-admin',
  templateUrl: './profil-admin.component.html',
  styleUrls: ['./profil-admin.component.css']
})
export class ProfilAdminComponent {
  constructor(public service:AdministrateurService){}
  
}
