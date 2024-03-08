import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {  faEarth } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
faEarth=faEarth
faEnvelope=faEnvelope
constructor(private  router: Router) {}
  

}
