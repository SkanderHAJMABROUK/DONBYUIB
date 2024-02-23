import { Component } from '@angular/core';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Router} from '@angular/router';

@Component({
  selector: 'app-head-bar',
  templateUrl: './head-bar.component.html',
  styleUrls: ['./head-bar.component.css']
})
export class HeadBarComponent {
  isMenuOpen: boolean = false;
  faB = faBars;
  faX = faXmark;
  constructor(private  router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log("Menu opened:", this.isMenuOpen);
  }
}
