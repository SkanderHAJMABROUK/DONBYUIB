import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OcrService {

  constructor(private http: HttpClient) { }
  
  
  processImage(Id: string): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:5000/process_image/' + Id);
  }
}
