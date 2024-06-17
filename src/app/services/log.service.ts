import { Injectable } from '@angular/core';
import { Log } from '../interfaces/log';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private http: HttpClient) {}

  addLog(log: Log): Observable<Log[]> {
    return this.http.post<Log[]>(`http://localhost:3000/logs`, log).pipe(
      catchError((error) => {
        console.error('Error adding log:', error);
        return throwError(error);
      }),
    );
  }
}
