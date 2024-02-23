import { Component,OnInit } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'donbyuib';
  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.dbService.connectToDatabase().subscribe(
      response => {
        console.log('Connexion à la base de données établie avec succès:', response);
      },
      error => {
        console.error('Erreur lors de la connexion à la base de données:', error);
      }
    );
  }
}