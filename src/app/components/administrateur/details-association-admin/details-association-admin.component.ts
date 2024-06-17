import { Component, Input } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Association } from 'src/app/interfaces/association';
import { DemandeAssociation } from 'src/app/interfaces/demande-association';
import { AdministrateurService } from 'src/app/services/administrateur.service';

@Component({
  selector: 'app-details-association-admin',
  templateUrl: './details-association-admin.component.html',
  styleUrls: ['./details-association-admin.component.css'],
})
export class DetailsAssociationAdminComponent {
  @Input() association!: Association;

  faXmark = faXmark;
  constructor(public adminService: AdministrateurService) {}
}
