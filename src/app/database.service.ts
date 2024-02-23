import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  connectToDatabase() {
    return this.http.get('http://localhost/DonByUIB/db_connexion.php');
  }
}