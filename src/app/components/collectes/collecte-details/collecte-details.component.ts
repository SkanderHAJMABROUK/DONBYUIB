import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Options } from 'ngx-slider-v2';
import { Collecte } from 'src/app/interfaces/collecte';
import { CollecteService } from 'src/app/services/collecte.service';
import { PaymentService } from 'src/app/services/payment.service';
import { DonateurService } from 'src/app/services/donateur.service';
import Swal from 'sweetalert2';
import { AssociationService } from 'src/app/services/association.service';
import { EMPTY, Observable, interval, map } from 'rxjs';
import { Donateur } from 'src/app/interfaces/donateur';

@Component({
  selector: 'app-collecte-details',
  templateUrl: './collecte-details.component.html',
  styleUrls: ['./collecte-details.component.css'],
})
export class CollecteDetailsComponent {
  constructor(
    public service: CollecteService,
    public route: ActivatedRoute,
    private paymentService: PaymentService,
    public router: Router,
    private donateurService: DonateurService,
    public associationService: AssociationService
  ) {}

  value = 0;
  options: Options = {
    floor: 0,
    ceil: 2000,
  };
  id!: string;
  data: Collecte | undefined;
  selectedCollecte!: Collecte | undefined;
  donationAmount: number = 0;
  orderId: string = '';
  orderStatus: number = 0;
  donateurId: string | null = null;
  donateurEMail: string | undefined;
  totalDonationAmount: number = 0;
  amountLeft: number = 0;
  associationName: string | undefined;
  associationLogo: string | undefined;
  isDonationAllowed = false;
  countdown: Observable<string> = EMPTY;
  showFullDescription: boolean = false;
  @ViewChild('calendarContainer') calendarContainer!: ElementRef;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      console.log(this.id);
      this.getCollecteById(this.id);
    });

    this.donateurId = this.donateurService.id;

    if (this.donateurId != null) {
      this.donateurService
        .getDonateurById(this.donateurId)
        .subscribe((donateur) => {
          this.donateurEMail = donateur?.email;
          console.log('Donateur email:', this.donateurEMail);
        });
    } else {
      console.log('Donateur ID is null or undefined.');
    }

    this.orderId = localStorage.getItem('order-Id') || '';
    console.log('order id', this.orderId);
  }

  loadAssociationName() {
    console.log('Loading association name...');
    console.log('Selected collecte:', this.selectedCollecte);
    if (this.selectedCollecte && this.selectedCollecte.id_association) {
      console.log('Selected collecte and association ID are defined.');
      console.log('Association ID:', this.selectedCollecte.id_association);
      this.associationService
        .getAssociationNameById(this.selectedCollecte.id_association)
        .subscribe((name) => {
          console.log('Association name received from service:', name);
          if (name) {
            this.associationName = name;
            console.log('Association name:', this.associationName);
          } else {
            this.associationName = 'Default Association Name';
            console.log(
              'Association name set to default:',
              this.associationName
            );
          }
        });
    } else {
      console.log('Selected collecte or association ID is undefined.');
    }
  }

  loadAssociationLogo() {
    console.log('Loading association logo...');
    console.log('Selected collecte:', this.selectedCollecte);
    if (this.selectedCollecte && this.selectedCollecte.id_association) {
      console.log('Selected collecte and association ID are defined.');
      console.log('Association ID:', this.selectedCollecte.id_association);
      this.associationService
        .getAssociationLogoById(this.selectedCollecte.id_association)
        .subscribe((logo) => {
          console.log('Association name received from service:', logo);
          if (logo) {
            this.associationLogo = logo;
            console.log('Association name:', this.associationLogo);
          } else {
            this.associationLogo = 'Default Association Logo';
            console.log(
              'Association logo set to default:',
              this.associationLogo
            );
          }
        });
    } else {
      console.log('Selected collecte or association ID is undefined.');
    }
  }

  getCollecteById(id: string) {
    this.service.getCollecteById(id).subscribe({
      next: (data: Collecte | undefined) => {
        if (data !== undefined) {
          this.selectedCollecte = data;
          localStorage.setItem('service.showDetails', 'true');
          console.log(data);
          console.log(this.service.showDetails);
          this.loadAssociationName();
          this.loadAssociationLogo();
          this.fetchTotalDonationAmount();
          this.getProgressPercentage();

          this.isDonationAllowed =
            new Date() >= new Date(this.selectedCollecte.date_debut);

          if (!this.isDonationAllowed) {
            const countdownEnd = new Date(
              this.selectedCollecte.date_debut
            ).getTime();

            this.countdown = interval(1000).pipe(
              map(() => {
                const now = Date.now();
                const distance = countdownEnd - now;

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                  (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                  (distance % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                return `${days}j:${hours}h:${minutes}min:${seconds}s`;
              })
            );
          }
          if (this.orderId) {
            this.getOrderStatus(this.orderId);
          }
        } else {
          console.error("Erreur: Aucune donnée n'a été renvoyée.");
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      },
    });
  }

  getTimeRemaining(endDate: Date): string {
    const now = new Date();
    const endTime = new Date(endDate);
    const timeDiff = endTime.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysRemaining <= 0) {
      return 'Terminée';
    } else if (daysRemaining === 1) {
      return '1 jour restant';
    } else {
      return daysRemaining + ' jours restants';
    }
  }

  updateDonationAmountFromButton(amount: number) {
    this.donationAmount = amount;
  }

  updateDonationAmountFromSlider(event: any) {
    this.donationAmount = event.value;
  }

  initiatePayment(): void {
    const returnUrl = `https://localhost:4200/listeCollectes/details/${this.id}`;
    const randomIdentifier = Math.random().toString(36).substring(2, 10);

    this.paymentService
      .authorizePayment(randomIdentifier, this.donationAmount, returnUrl)
      .subscribe(
        (response) => {
          window.open(response.formUrl, '_blank');
          localStorage.setItem('order-Id', response.orderId);
          this.orderId = response.orderId;

          this.confirmPayment(response.orderId, this.donationAmount);
        },
        (error) => {
          console.error('Authorization failed:', error);
        }
      );
  }

  confirmPayment(orderId: string, amount: number): void {
    this.paymentService.confirmPayment(orderId, amount).subscribe(
      (response) => {
        if (this.selectedCollecte && this.selectedCollecte.id) {
          const date = new Date();
          console.log('Adding donation to DonCollecte collection...');
          console.log('Order ID:', orderId);
          console.log('Amount:', amount);
          const donateurId = this.donateurId || '';
          this.paymentService
            .addDonCollecte(this.selectedCollecte.id, amount, date, donateurId)
            .then(() => {
              console.log('Don ajouté avec succès à la collection');
              if (
                this.selectedCollecte &&
                this.selectedCollecte.cumul + amount >=
                  this.selectedCollecte.montant
              ) {
                if (this.selectedCollecte.id) {
                  this.service.updateCollecteEtat(
                    this.selectedCollecte.id,
                    'terminee'
                  );
                }
              }
            })
            .catch((error) => {
              console.error(
                "Erreur lors de l'ajout du don à la collection :",
                error
              );
            });

          this.service.updateCumulativeDonationAmount(
            this.selectedCollecte.id,
            this.totalDonationAmount + amount
          );
        } else {
          console.error(
            'Erreur: Aucune collecte sélectionnée ou ID non défini.'
          );
        }
        console.log('Payment confirmed:', response);
      },
      (error) => {
        // Handle error
        console.error('Confirmation failed:', error);
      }
    );
  }

  getOrderStatus(orderId: string): void {
    this.paymentService.getOrderStatus(orderId).subscribe(
      (response) => {
        console.log(response);
        this.orderStatus = response.OrderStatus as number;
        console.log('order status in function', this.orderStatus);

        if (this.orderStatus == 2) {
          this.showSuccessMessage();

          if (this.selectedCollecte && this.selectedCollecte.id_association) {
            this.associationService
              .getAssociationNameById(this.selectedCollecte.id_association)
              .subscribe(
                (name) => {
                  this.associationName = name || 'Default Association Name';
                  console.log('Association name:', this.associationName);

                  if (this.donateurEMail) {
                    console.log('Sending email to:', this.donateurEMail);
                    this.paymentService
                      .envoyerRemerciement(
                        this.associationName,
                        this.donateurEMail
                      )
                      .then((response) => {
                        console.log('Email sent:', response);
                      })
                      .catch((error) => {
                        console.error('Error while sending email:', error);
                      });
                  } else {
                    console.log(
                      'email',
                      this.associationName,
                      this.donateurEMail
                    );
                  }
                },
                (error) => {
                  console.error('Error fetching association name:', error);
                }
              );
          } else {
            console.error(
              'Erreur: selectedCollecte or id_association is undefined.'
            );
          }
        }
      },
      (error) => {
        console.error('Error fetching order status:', error);
      }
    );
  }

  showSuccessMessage() {
    if (this.selectedCollecte) {
      const nomCollecte = this.selectedCollecte.nom;
      const imageCollecte = this.selectedCollecte.image;

      Swal.fire({
        title: 'Félicitations!',
        text: `Votre don à la collecte '${nomCollecte}' a été transmis avec succès`,
        imageUrl: imageCollecte,
        imageWidth: 300,
        imageHeight: 200,
        imageAlt: 'Oops!',
      });
    } else {
      console.log('selectedCollecte is null or undefined');
    }
    localStorage.removeItem('order-Id');
  }

  validateDonationAmount() {
    if (
      this.selectedCollecte &&
      this.selectedCollecte.montant &&
      this.selectedCollecte.cumul !== undefined
    ) {
      if (this.amountLeft == 0) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title:
            'La collecte a déjà atteint son objectif. Merci pour votre générosité!',
          showConfirmButton: false,
          timer: 2500,
        });
      } else if (this.donationAmount === 0) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Le montant du don ne peut pas être zéro!',
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (this.amountLeft < this.donationAmount) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: `Il ne reste que ${this.amountLeft}DT vers l'objectif de cette collecte, merci de votre générosité!`,
          showConfirmButton: false,
          timer: 2500,
        });
      } else {
        this.initiatePayment();
      }
    } else {
      console.error('Erreur: Les données de la collecte sont invalides.');
    }
  }

  fetchTotalDonationAmount(): void {
    this.paymentService.getTotalDonationAmountForCollecte(this.id).subscribe(
      (totalAmount) => {
        this.totalDonationAmount = totalAmount;
        console.log('Total donation amount:', totalAmount);
        this.amountLeft = this.getAmountLeft();
        console.log('amount left', this.amountLeft);
      },
      (error) => {
        console.error('Error fetching total donation amount:', error);
      }
    );
  }

  getProgressPercentage(): number {
    if (
      this.selectedCollecte &&
      this.selectedCollecte.montant &&
      this.selectedCollecte.cumul !== undefined
    ) {
      const montant = this.selectedCollecte.montant;
      const cumul = this.selectedCollecte.cumul;
      if (montant > 0) {
        return Math.floor((cumul / montant) * 100);
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  getAmountLeft(): number {
    if (this.selectedCollecte) {
      return this.selectedCollecte.montant - this.selectedCollecte.cumul;
    } else {
      console.log('Erreur');
    }
    return 0;
  }

  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }
  
}
