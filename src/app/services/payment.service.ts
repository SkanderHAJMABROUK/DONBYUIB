import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = '/api';
  private userName = '1218446019';
  private password = 'Uzb92Gn5';

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
  ) {}

  // Etape 1: Authorization
  authorizePayment(
    orderNumber: string,
    amount: number,
    returnUrl: string,
  ): Observable<any> {
    const url = `${this.baseUrl}/register.do`;
    const params = {
      userName: this.userName,
      password: this.password,
      orderNumber: orderNumber,
      amount: (amount * 1000).toString(),
      currency: '788',
      returnUrl: returnUrl,
    };
    localStorage.setItem('paymentStatus', 'true');

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
      language: 'en',
    };
    return this.http.get<any>(url, { params });
  }

  getOrderStatus(orderId: string): Observable<any> {
    const url = `${this.baseUrl}/getOrderStatus.do`;
    const params = {
      userName: this.userName,
      password: this.password,
      orderId: orderId,
      language: 'fr',
    };
    return this.http.get<any>(url, { params });
  }

  addDonAssociation(
    idAssociation: string,
    montant: number,
    date: Date,
    idDonateur?: string,
  ) {
    return this.firestore.collection('DonAssociation').add({
      id_association: idAssociation,
      montant: montant,
      date: date,
      id_donateur: idDonateur,
    });
  }

  addDonCollecte(
    idCollecte: string,
    montant: number,
    date: Date,
    idDonateur?: string,
  ) {
    return this.firestore.collection('DonCollecte').add({
      id_collecte: idCollecte,
      montant: montant,
      date: date,
      id_donateur: idDonateur,
    });
  }

  getTotalDonationAmountForCollecte(idCollecte: string): Observable<number> {
    return this.firestore
      .collection<any>('DonCollecte', (ref) =>
        ref.where('id_collecte', '==', idCollecte),
      )
      .valueChanges()
      .pipe(
        map((donations) => {
          return donations.reduce(
            (total: number, donation: any) =>
              total + parseFloat(donation.montant),
            0,
          );
        }),
      );
  }

  async envoyerRemerciement(nomAssociation: string, email: string) {
    emailjs.init('MvwF-7177T4obuulo');
    emailjs.send('service_ogd42ys', 'template_x879hbi', {
      destinataire: nomAssociation,
      to_email: email,
    });
  }
}
