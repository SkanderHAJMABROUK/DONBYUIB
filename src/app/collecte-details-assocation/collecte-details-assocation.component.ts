import { Component, Input } from '@angular/core';
import { CollecteService } from '../shared/collecte.service';
import { Collecte } from '../collecte';

@Component({
  selector: 'app-collecte-details-assocation',
  templateUrl: './collecte-details-assocation.component.html',
  styleUrls: ['./collecte-details-assocation.component.css']
})
export class CollecteDetailsAssocationComponent {
  @Input() collecte!:Collecte

  // On a injecté le TodoService
  constructor(public service:CollecteService){}

 


}
