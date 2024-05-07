import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyseSentiment } from '../interfaces/analyse-sentiment';


@Injectable({
  providedIn: 'root'
})
export class AnalyseSentimentsService {
  private apiUrl = 'http://localhost:5000'; 
  private positiveWordcloudUrl = 'http://127.0.0.1:5000/positive-wordcloud';
  private sentimentAnalysisUrl = 'http://127.0.0.1:5000/sentiment-analysis';



  constructor(private http: HttpClient) { }
  
  getSatisfactionRate(): Observable<AnalyseSentiment> {
    return this.http.get<AnalyseSentiment>(`${this.apiUrl}/satisfaction-rate`);
  }
  
  getPositiveWordcloud(): Observable<Blob> {
    return this.http.get(this.positiveWordcloudUrl, { responseType: 'blob' });
  }
  getSentimentAnalysisChart(): Observable<Blob> {
    return this.http.get(this.sentimentAnalysisUrl, { responseType: 'blob' });
  }



}
