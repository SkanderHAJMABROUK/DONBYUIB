import { Component } from '@angular/core';
import { ActualiteService } from '../../../services/actualite.service';
import { Actualite } from '../../../interfaces/actualite';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Association } from 'src/app/interfaces/association';
import { AssociationService } from 'src/app/services/association.service';
import { Collecte } from 'src/app/interfaces/collecte';
import { CollecteService } from 'src/app/services/collecte.service';
import { Router } from '@angular/router';
import { DonateurService } from 'src/app/services/donateur.service';

@Component({
  selector: 'app-actualite-list',
  templateUrl: './actualite-list.component.html',
  styleUrls: ['./actualite-list.component.css'],
})
export class ActualiteListComponent {
  constructor(
    public actualiteService: ActualiteService,
    public associationService: AssociationService,
    public collecteService: CollecteService,
    public donateurService: DonateurService,
    private router: Router,
  ) {}

  customOptions: OwlOptions = {
    autoplay: true,
    autoplayTimeout: 4000,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    center: true,
    navText: ['Précédent', 'Suivant'],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: true,
  };

  actualites: Actualite[] = [];
  associations: Association[] = [];
  collectes: Collecte[] = [];

  ngOnInit(): void {
    const donateurId = localStorage.getItem('donateurid');
    const associationId = localStorage.getItem('associationid');

    if (donateurId) {
      this.donateurService.connexionDonateur = true;
    } else if (associationId) {
      this.associationService.connexion = true;
    } else {
      console.log('No user connected');
    }

    this.actualiteService.getAcceptedActualites().subscribe((res) => {
      this.actualites = res;
      console.log(this.actualites);
    });
    this.associationService.getActiveAssociations().subscribe((res) => {
      this.associations = res;
      console.log(this.associations);
    });
    this.collecteService.getAcceptedCollectes().subscribe((res) => {
      this.collectes = res;
      console.log(this.collectes);
    });
  }

  toggleShowDetails() {
    this.actualiteService.showDetails = true;
    localStorage.setItem('service.showDetails', 'true');
  }

  getProgressPercentage(collecte: Collecte): number {
    if (collecte && collecte.montant && collecte.cumul !== undefined) {
      const montant = collecte.montant;
      const cumul = collecte.cumul;
      if (montant > 0) {
        return Math.floor((cumul / montant) * 100);
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  getAssociationName(associationId: string): string {
    const association = this.associations.find(
      (association) => association.id === associationId,
    );
    return association ? association.nom : '';
  }

  getTimeRemaining(startDate: Date, endDate: Date): string {
    const now = new Date();
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);

    if (now < startTime) {
      const timeDiff = startTime.getTime() - now.getTime();
      const daysUntilStart = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return 'Commence dans ' + daysUntilStart + ' jours';
    }

    const timeDiff = endTime.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysRemaining <= 0) {
      return 'Terminée';
    } else if (daysRemaining === 1) {
      return '1 jour restant';
    } else {
      return 'Il reste ' + daysRemaining + ' jours';
    }
  }
}
