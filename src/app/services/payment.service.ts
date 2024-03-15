import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  // Méthode pour initier un paiement
  initiatePayment(reference: string, affiliation: string, devise: string, montant: number, login: string, password: string, urlStatus: string): void {
    
    
    // Génération d'un SID (Session ID) unique
    const sid = Math.round(Date.now()) + Math.floor(Math.random() * 1000);
    // Données de paiement regroupées dans un objet
    const payload = {
      reference,
      affiliation,
      devise,
      montant,
      login,
      password,
      sid,
      urlStatus
    };
    // Envoi d'une requête POST vers l'URL de paiement avec les données de paiement
    this.http.post<any>('https://ipay.clictopay.com/payment/rest/register.do', payload).subscribe(
      (response) => {
        // En cas de succès, récupérer l'URL de paiement depuis la réponse et rediriger vers cette URL
        const paymentUrl = response.formUrl;
        window.location.href = paymentUrl;
      },
      (error) => {
        console.error('Erreur lors de l\'initiation du paiement : ', error);
      }
    );
  }

  // Méthode pour vérifier le statut d'une commande
  checkOrderStatus(orderId: string): void {
    // Données de la commande regroupées dans un objet
    const payload = {
      userName: '1218426011',
      password: 'wtE5E9sH2',
      orderId
    };
    // Envoi d'une requête POST vers l'URL de vérification du statut de commande avec les données de la commande
    this.http.post<any>('https://ipay.clictopay.com/payment/rest/getOrderStatus.do', payload).subscribe(
      (response) => {
        // En cas de succès, récupérer le statut de la commande depuis la réponse et traiter en conséquence
        const orderStatus = response.OrderStatus;
        console.log('Statut de la commande : ', orderStatus);
        // Traiter le statut de la commande ici
      },
      (error) => {
        console.error('Erreur lors de la vérification du statut de la commande : ', error);
      }
    );
  }
}
