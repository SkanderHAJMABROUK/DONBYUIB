import { Component } from '@angular/core';
import { AssociationService } from '../../../services/association.service';


@Component({
  selector: 'app-profil-association',
  templateUrl: './profil-association.component.html',
  styleUrls: ['./profil-association.component.css']
})
export class ProfilAssociationComponent {
constructor(public service:AssociationService){}

}
