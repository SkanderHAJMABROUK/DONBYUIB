import { Component } from '@angular/core';
import { AssociationService } from '../../../services/associationService.service';
import { Association } from '../../../interfaces/association';
import { ActivatedRoute, Router } from '@angular/router';
import { DonateurService } from '../../../services/donateur.service';

@Component({
  selector: 'app-profil-association',
  templateUrl: './profil-association.component.html',
  styleUrls: ['./profil-association.component.css']
})
export class ProfilAssociationComponent {
constructor(public service:AssociationService){}

}
