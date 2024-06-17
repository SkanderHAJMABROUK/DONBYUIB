import { Component, Input } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Actualite } from 'src/app/interfaces/actualite';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { ActualiteService } from 'src/app/services/actualite.service';
@Component({
  selector: 'app-suppression-actualite-details',
  templateUrl: './suppression-actualite-details.component.html',
  styleUrls: ['./suppression-actualite-details.component.css'],
})
export class SuppressionActualiteDetailsComponent {
  @Input() actualite!: Actualite;
  faXmark = faXmark;

  constructor(
    public service: ActualiteService,
    public adminService: AdministrateurService,
  ) {}
}
