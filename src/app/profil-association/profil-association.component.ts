import { Component } from '@angular/core';
import { AssociationService } from '../shared/associationService.service';
import { Association } from '../association';
import { ActivatedRoute, Router } from '@angular/router';
import { DonateurService } from '../shared/donateur.service';

@Component({
  selector: 'app-profil-association',
  templateUrl: './profil-association.component.html',
  styleUrls: ['./profil-association.component.css']
})
export class ProfilAssociationComponent {
constructor(public service:AssociationService){}

}
