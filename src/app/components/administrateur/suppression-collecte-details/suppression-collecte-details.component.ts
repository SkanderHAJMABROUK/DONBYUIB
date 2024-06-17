import { Component, Input } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Collecte } from 'src/app/interfaces/collecte';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { CollecteService } from 'src/app/services/collecte.service';

@Component({
  selector: 'app-suppression-collecte-details',
  templateUrl: './suppression-collecte-details.component.html',
  styleUrls: ['./suppression-collecte-details.component.css'],
})
export class SuppressionCollecteDetailsComponent {
  @Input() collecte!: Collecte;
  faXmark = faXmark;

  constructor(
    public service: CollecteService,
    public adminService: AdministrateurService,
  ) {}
}
