import { Component, Input } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { DemandeAssociation } from 'src/app/interfaces/demande-association';
import { AdministrateurService } from 'src/app/services/administrateur.service';

@Component({
  selector: 'app-demande-association-details',
  templateUrl: './demande-association-details.component.html',
  styleUrls: ['./demande-association-details.component.css']
})
export class DemandeAssociationDetailsComponent {
  @Input() association!:DemandeAssociation;

  faXmark=faXmark;
  constructor(public adminService:AdministrateurService){}

}
