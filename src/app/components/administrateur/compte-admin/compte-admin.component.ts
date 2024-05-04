import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Admin } from 'src/app/interfaces/admin';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { Chart, registerables} from 'node_modules/chart.js'
import { Observable, Subscription, combineLatest, forkJoin } from 'rxjs';
import { DonAssociation } from 'src/app/interfaces/don-association';
import { DonCollecte } from 'src/app/interfaces/don-collecte';
Chart.register(...registerables);
import firebase from 'firebase/compat/app';
import { AssociationService } from 'src/app/services/association.service';
import { ActualiteService } from 'src/app/services/actualite.service';
import { CollecteService } from 'src/app/services/collecte.service';


@Component({
  selector: 'app-compte-admin',
  templateUrl: './compte-admin.component.html',
  styleUrls: ['./compte-admin.component.css']
})
export class CompteAdminComponent implements OnInit{


  constructor(public service:AdministrateurService ,private route:ActivatedRoute, private router:Router,
    private associationService:AssociationService,
    private actualiteService: ActualiteService,
    private collecteService: CollecteService
  ){}


  id!: string;
  data: Admin |undefined; 
  selectedAdmin!: Admin |undefined; 
  associationsByCategory: { category: string, count: number }[] = [];
  pieChart: any;
  donationsData: { date: Date, associationDonations: number, collecteDonations: number }[] = [];
  assDonData: DonAssociation[] = [];
  colDonData: DonCollecte[] = [];
  lineChart: any;
  donationsSubscription: Subscription | undefined;
  barChart: any;
  doughnutChart: any;

  
   ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id']; 
      this.service.id=this.id;
      console.log(this.id);
       this.getAdminById(this.id); 
     });

     this.getAssociationsByCategory();
     this.fetchDonationsData();
     this.renderBarChart();
     this.renderDoughnutChart();    
   
   }

   ngAfterViewInit(): void {
    this.renderPieChart();
    this.renderLineChart();
    this.renderBarChart();
    this.renderDoughnutChart();
    if (this.donationsSubscription) {
      this.donationsSubscription.unsubscribe();
    }
  }


   getAdminById(id: string){
    this.service.getAdminById(id).subscribe(
      (data) => {
        this.selectedAdmin = data; 
        console.log(data);
      },
      error => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }
  
  
  async getAssociationsByCategory() {
    try {
      const associations = await this.service.getAssociationsByCategory();
      // Calculate count of associations for each category
      const categoryCounts: { [key: string]: number } = {};
      associations.forEach(association => {
        if (categoryCounts.hasOwnProperty(association.categorie)) {
          categoryCounts[association.categorie]++;
        } else {
          categoryCounts[association.categorie] = 1;
        }
      });

      // Convert category counts to array format
      this.associationsByCategory = Object.keys(categoryCounts).map(category => ({
        category: category,
        count: categoryCounts[category]
      }));

      // Render pie chart after getting data
      this.renderPieChart();
    } catch (error) {
      console.error('Error retrieving associations by category:', error);
    }
  }

  fetchDonationsData() {
    console.log('Fetching donations data...');
    
    this.service.getAllDonAssociation().subscribe(
      donAssociation => {
        this.service.getAllDonCollecte().subscribe(
          donCollecte => {
            if (donAssociation.length === 0 && donCollecte.length === 0) {
              console.log('No data available in DonAssociation and DonCollecte collections.');
              return;
            }
              this.donationsData = this.aggregateDonationsData(donAssociation, donCollecte);
            console.log('Aggregated Donations Data:', this.donationsData);
  
            this.renderLineChart();
          },
          error => {
            console.error('Error fetching donations to collecte:', error);
          }
        );
      },
      error => {
        console.error('Error fetching donations to associations:', error);
      }
    );
  }
  
     

  aggregateDonationsData(donAssociation: DonAssociation[], donCollecte: DonCollecte[]): { date: Date, associationDonations: number, collecteDonations: number }[] {
    console.log('Aggregating donations data...');
    console.log('Don Association:', donAssociation);
    console.log('Don Collecte:', donCollecte);
  
    const aggregatedData: { [key: string]: { date: Date, associationDonations: number, collecteDonations: number } } = {};
  
    console.log('Starting aggregation process...');
  
    donAssociation.forEach(donation => {
      // Check if donation.date is a Timestamp object
      if (donation.date instanceof firebase.firestore.Timestamp) {
        const dateKey = donation.date.toDate().toDateString(); // Convert Timestamp to Date
        if (!aggregatedData.hasOwnProperty(dateKey)) {
          aggregatedData[dateKey] = {
            date: donation.date.toDate(), // Convert Timestamp to Date
            associationDonations: donation.montant,
            collecteDonations: 0
          };
        } else {
          aggregatedData[dateKey].associationDonations += donation.montant;
        }
      }
    });
  
    donCollecte.forEach(donation => {
      // Check if donation.date is a Timestamp object
      if (donation.date instanceof firebase.firestore.Timestamp) {
        const dateKey = donation.date.toDate().toDateString(); // Convert Timestamp to Date
        if (!aggregatedData.hasOwnProperty(dateKey)) {
          aggregatedData[dateKey] = {
            date: donation.date.toDate(), // Convert Timestamp to Date
            associationDonations: 0,
            collecteDonations: donation.montant
          };
        } else {
          aggregatedData[dateKey].collecteDonations += donation.montant;
        }
      }
    });
  
    console.log('Aggregated Data:', Object.values(aggregatedData));
    return Object.values(aggregatedData);
  }

  aggregateDonationsPerAssociation(donAssociations: DonAssociation[], donCollectes: DonCollecte[]): { [key: string]: number } {
    const aggregatedData: { [key: string]: number } = {};
  
    // Array to store Observables from getAssociationIdFromCollecte
    const observables = donCollectes.map((donation: DonCollecte) => {
      const collecteId = donation.id_collecte;
      return this.getAssociationIdFromCollecte(collecteId);
    });
  
    // Use forkJoin to wait for all Observables to complete
    forkJoin(observables).subscribe((associationIds: (string | undefined)[]) => {
      donAssociations.forEach((donation: DonAssociation) => {
        const associationId = donation.id_association;
        aggregatedData[associationId] = (aggregatedData[associationId] || 0) + donation.montant;
      });
  
      associationIds.forEach((associationId, index) => {
        if (associationId) {
          const donation = donCollectes[index];
          aggregatedData[associationId] = (aggregatedData[associationId] || 0) + donation.montant;
        } else {
          const donation = donCollectes[index];
          console.log('Error: Association ID not found for DonCollecte:', donation);
        }
      });
      });
    console.log('Aggregated data:', aggregatedData);

    return aggregatedData;
  }
  
  getAssociationIdFromCollecte(collecteId: string): Observable<string | undefined> {
    return new Observable<string | undefined>((observer) => {
      this.collecteService.getCollecteById(collecteId).subscribe(
        (collecte) => {
          if (collecte) {
            observer.next(collecte.id_association);
          } else {
            observer.next(undefined);
            console.log('Collecte not found for ID:', collecteId);
          }
          observer.complete();
        },
        (error) => {
          console.error('Error fetching collecte:', error);
          observer.error(error);
        }
      );
    });
  }
  
  renderPieChart() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    const canvas: any = document.querySelector('.piechart');
    const ctx = canvas.getContext('2d');

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.associationsByCategory.map(item => item.category),
        datasets: [{
          label: 'Nombre d\'associations',
          data: this.associationsByCategory.map(item => item.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true
      }
    });
  } 
  
  renderLineChart() {
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    const canvas: any = document.querySelector('.linechart');
    const ctx = canvas.getContext('2d');
  
    console.log('Rendering Line Chart...');
    console.log('Donations Data:', this.donationsData);
  
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.donationsData.map(item => item.date.toLocaleDateString()),
        datasets: [{
          label: 'Association Donations',
          data: this.donationsData.map(item => item.associationDonations),
          borderColor: 'rgba(255, 99, 132, 0.5)',
          borderWidth: 1,
          fill: false
        }, {
          label: 'Collecte Donations',
          data: this.donationsData.map(item => item.collecteDonations),
          borderColor: 'rgba(54, 162, 235, 0.5)',
          borderWidth: 1,
          fill: false
        }]
      },
      options: {        
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Durée',
              color: '#911',
              font: {
                family: 'Times',
                size: 20,
                style: 'normal',
                lineHeight: 1.2
              },
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Montant',
              color: '#191',
              font: {
                family: 'Times',
                size: 20,
                style: 'normal',
                lineHeight: 1.2
              },
            }
          }
        }
    
      }
    });
  }  

  renderBarChart(): void {
    // Fetch data for accepted and refused demands for each type
    combineLatest([
      this.associationService.getAcceptedDemandesAssociations(),
      this.associationService.getRefusedDemandesAssociations(),
      this.collecteService.getAcceptedDemandesCollectes(),
      this.collecteService.getRefusedDemandesCollectes(),
      this.actualiteService.getAcceptedDemandesActualites(),
      this.actualiteService.getRefusedDemandesActualites()
    ]).subscribe(([associationsAccepted, associationsRefused, collecteAccepted, collecteRefused, actualiteAccepted, actualiteRefused]) => {
      // Aggregate data into arrays for Chart.js
      const data = {
        labels: ['Association', 'Collecte', 'Actualité'],
        datasets: [
          {
            label: 'Accepted',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            data: [
              associationsAccepted.length,
              collecteAccepted.length,
              actualiteAccepted.length
            ]
          },
          {
            label: 'Refused',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            data: [
              associationsRefused.length,
              collecteRefused.length,
              actualiteRefused.length
            ]
          }
        ]
      };

      if (this.barChart) {
        this.barChart.destroy();
      }
  
      // Create the chart
      const canvas: any = document.getElementById('barChart');
      const ctx = canvas.getContext('2d');
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }

  renderDoughnutChart(): void {
    this.service.getAllDonAssociation().subscribe((donAssociations: DonAssociation[]) => {
      this.service.getAllDonCollecte().subscribe((donCollectes: DonCollecte[]) => {
        const aggregatedData = this.aggregateDonationsPerAssociation(donAssociations, donCollectes);
        console.log('aggregated data in render',aggregatedData)
        const data = {
          labels: Object.keys(aggregatedData),
          datasets: [{
            label: 'Donations per Association',
            data: Object.values(aggregatedData),
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              // Add more colors as needed
            ],
            borderWidth: 1
          }]
        };
  
        const canvas: any = document.getElementById('doughnutChart');
        if (!canvas) {
          console.error('Chart container not found');
          return;
        }
  
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error('Canvas context not found');
          return;
        }
  
        if (this.doughnutChart) {
          this.doughnutChart.destroy();
        }
  
        try {
          this.doughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
              responsive: true
            }
          });
        } catch (error) {
          console.error('Error creating doughnut chart:', error);
        }
      });
    });
  }
  
    
}