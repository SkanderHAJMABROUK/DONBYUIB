import { Component, Input } from '@angular/core';
import { CollecteService } from '../../../services/collecte.service';
import { Collecte } from '../../../interfaces/collecte';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-collecte-details-assocation',
  templateUrl: './collecte-details-assocation.component.html',
  styleUrls: ['./collecte-details-assocation.component.css'],
})
export class CollecteDetailsAssocationComponent {
  @Input() collecte!: Collecte;
  faXmark = faXmark;

  // On a injecté le TodoService
  constructor(public service: CollecteService) {}
}
