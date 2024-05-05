import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyseSentiment } from '../interfaces/analyse-sentiment';


@Injectable({
  providedIn: 'root'
})
export class AnalyseSentimentsService {
  private apiUrl = 'http://localhost:5000'; 

  constructor(private http: HttpClient) { }
  
  getSatisfactionRate(): Observable<AnalyseSentiment> {
    return this.http.get<AnalyseSentiment>(`${this.apiUrl}/satisfaction-rate`);
  }
  
  analyseSentiment(commentaires: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/analyze-sentiment`, { commentaires });
  }

  generateWordCloud(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/wordcloud`, { responseType: 'blob' });
  }
  



}
