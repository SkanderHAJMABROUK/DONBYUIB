import { Component } from '@angular/core';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-head-bar',
  templateUrl: './head-bar.component.html',
  styleUrls: ['./head-bar.component.css']
})
export class HeadBarComponent {
  isMenuOpen: boolean = false;
  faB = faBars;
  faX = faXmark;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log("Menu opened:", this.isMenuOpen);
  }
}
