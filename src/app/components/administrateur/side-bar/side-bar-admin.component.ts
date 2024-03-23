import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministrateurService } from 'src/app/services/administrateur.service';

@Component({
  selector: 'app-side-bar-admin',
  templateUrl: './side-bar-admin.component.html',
  styleUrls: ['./side-bar-admin.component.css']
})
export class SideBarAdminComponent implements OnInit{

  constructor(public service:AdministrateurService){}

  ngOnInit(): void {
   }
   logOut() {
    this.service.logOut();
  }

}
