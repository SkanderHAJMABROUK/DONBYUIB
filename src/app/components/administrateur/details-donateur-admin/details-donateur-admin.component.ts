import { Component, Input } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Donateur } from 'src/app/interfaces/donateur';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { DonateurService } from 'src/app/services/donateur.service';

@Component({
  selector: 'app-details-donateur-admin',
  templateUrl: './details-donateur-admin.component.html',
  styleUrls: ['./details-donateur-admin.component.css']
})
export class DetailsDonateurAdminComponent {
  @Input() donateur!:Donateur
  faXmark=faXmark;

  
  constructor(public service:DonateurService,public adminService:AdministrateurService){}

}
