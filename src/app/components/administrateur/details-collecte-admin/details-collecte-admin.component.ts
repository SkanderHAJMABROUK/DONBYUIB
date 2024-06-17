import { Component, Input } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Collecte } from 'src/app/interfaces/collecte';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { CollecteService } from 'src/app/services/collecte.service';

@Component({
  selector: 'app-details-collecte-admin',
  templateUrl: './details-collecte-admin.component.html',
  styleUrls: ['./details-collecte-admin.component.css'],
})
export class DetailsCollecteAdminComponent {
  @Input() collecte!: Collecte;
  faXmark = faXmark;

  constructor(
    public service: CollecteService,
    public adminService: AdministrateurService,
  ) {}
}
