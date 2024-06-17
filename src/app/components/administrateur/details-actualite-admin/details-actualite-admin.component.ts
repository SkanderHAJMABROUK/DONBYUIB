import { Component, Input } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Actualite } from 'src/app/interfaces/actualite';
import { ActualiteService } from 'src/app/services/actualite.service';
import { AdministrateurService } from 'src/app/services/administrateur.service';

@Component({
  selector: 'app-details-actualite-admin',
  templateUrl: './details-actualite-admin.component.html',
  styleUrls: ['./details-actualite-admin.component.css'],
})
export class DetailsActualiteAdminComponent {
  @Input() actualite!: Actualite;
  faXmark = faXmark;

  constructor(
    public service: ActualiteService,
    public adminService: AdministrateurService,
  ) {}
}
