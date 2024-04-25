import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'https://test.clictopay.com/payment/rest';
  private userName = '1218446019';
  private password = 'Uzb92Gn5';

  constructor(private http: HttpClient) { }

  // Etape 1: Authorization
  authorizePayment(orderNumber: string, amount: number, returnUrl: string): Observable<any> {
    const url = `${this.baseUrl}/register.do`;
    const params = {
      userName: this.userName,
      password: this.password,
      orderNumber: orderNumber,
      amount: (amount * 1000).toString(),
      currency: '788',
      returnUrl: returnUrl
    };
    return this.http.get<any>(url, { params });
  }

  // Etape 2: Confirmation
  confirmPayment(orderId: string, amount: number): Observable<any> {
    const url = `${this.baseUrl}/deposit.do`;
    const params = {
      userName: this.userName,
      password: this.password,
      orderId: orderId,
      amount: amount.toString(),
      currency: '788',
      language: 'en'
    };
    return this.http.get<any>(url, { params });
  }
}
