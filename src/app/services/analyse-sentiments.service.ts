import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyseSentiment } from '../interfaces/analyse-sentiment';

@Injectable({
  providedIn: 'root',
})
export class AnalyseSentimentsService {
  // private baseUrl = 'http://127.0.0.1:5000';
  private baseUrl = '/flaskapi';

  constructor(private http: HttpClient) {}

  getSatisfactionRate(): Observable<AnalyseSentiment> {
    return this.http.get<AnalyseSentiment>(`${this.baseUrl}/satisfaction-rate`);
  }

  getPositiveWordcloud(): Observable<Blob> {
    const url = `${this.baseUrl}/positive-wordcloud`;
    console.log(`Fetching Positive Wordcloud from: ${url}`);
    return this.http.get(url, { responseType: 'blob' });
  }

  getSentimentAnalysisChart(): Observable<Blob> {
    const url = `${this.baseUrl}/sentiment-analysis`;
    console.log(`Fetching Sentiment Analysis Chart from: ${url}`);
    return this.http.get(url, { responseType: 'blob' });
  }
}
