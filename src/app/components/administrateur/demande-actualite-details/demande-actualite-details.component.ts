import { Component, Input } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { DemandeActualite } from 'src/app/interfaces/demande-actualite';
import { ActualiteService } from 'src/app/services/actualite.service';
import { AdministrateurService } from 'src/app/services/administrateur.service';

@Component({
  selector: 'app-demande-actualite-details',
  templateUrl: './demande-actualite-details.component.html',
  styleUrls: ['./demande-actualite-details.component.css'],
})
export class DemandeActualiteDetailsComponent {
  @Input() actualite!: DemandeActualite;
  faXmark = faXmark;

  constructor(
    public service: ActualiteService,
    public adminService: AdministrateurService,
  ) {}
}
