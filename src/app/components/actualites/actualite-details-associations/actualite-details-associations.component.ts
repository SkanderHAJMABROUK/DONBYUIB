import { Component, Input } from '@angular/core';
import { Actualite } from '../../../interfaces/actualite';
import { ActualiteService } from '../../../services/actualite.service';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-actualite-details-associations',
  templateUrl: './actualite-details-associations.component.html',
  styleUrls: ['./actualite-details-associations.component.css']
})
export class ActualiteDetailsAssociationsComponent {
  @Input() actualite!:Actualite
  faXmark=faXmark;

  // On a injecté le TodoService
  constructor(public service:ActualiteService){}

 
}
