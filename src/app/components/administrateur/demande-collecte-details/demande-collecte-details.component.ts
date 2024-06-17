import { Component, Input } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { DemandeCollecte } from 'src/app/interfaces/demande-collecte';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { CollecteService } from 'src/app/services/collecte.service';

@Component({
  selector: 'app-demande-collecte-details',
  templateUrl: './demande-collecte-details.component.html',
  styleUrls: ['./demande-collecte-details.component.css'],
})
export class DemandeCollecteDetailsComponent {
  @Input() collecte!: DemandeCollecte;
  faXmark = faXmark;

  constructor(
    public service: CollecteService,
    public adminService: AdministrateurService,
  ) {}
}
