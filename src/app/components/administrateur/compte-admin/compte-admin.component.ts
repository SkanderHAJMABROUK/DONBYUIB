import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Admin } from 'src/app/interfaces/admin';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { Chart, registerables} from 'node_modules/chart.js'
import { Observable, Subscription, catchError, combineLatest, filter, forkJoin, map, of, switchMap, take } from 'rxjs';
import { DonAssociation } from 'src/app/interfaces/don-association';
import { DonCollecte } from 'src/app/interfaces/don-collecte';
Chart.register(...registerables);
import firebase from 'firebase/compat/app';
import { AssociationService } from 'src/app/services/association.service';
import { ActualiteService } from 'src/app/services/actualite.service';
import { CollecteService } from 'src/app/services/collecte.service';
import { AnalyseSentimentsService } from 'src/app/services/analyse-sentiments.service';
import { AnalyseSentiment } from 'src/app/interfaces/analyse-sentiment';
import { DonateurService } from 'src/app/services/donateur.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Donateur } from 'src/app/interfaces/donateur';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_tunisiaLow from '@amcharts/amcharts4-geodata/tunisiaLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(am4themes_animated);


@Component({
  selector: 'app-compte-admin',
  templateUrl: './compte-admin.component.html',
  styleUrls: ['./compte-admin.component.css']
})
export class CompteAdminComponent implements OnInit{
  satisfactionRate!: number;
  positiveWordcloudData:any;

  constructor(public service:AdministrateurService ,private route:ActivatedRoute, private router:Router,
    private associationService:AssociationService,
    private actualiteService: ActualiteService,
    private collecteService: CollecteService,
    private donateurService: DonateurService,
    private analyse:AnalyseSentimentsService,
    private firestore: AngularFirestore
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
  doughnutChartSubscription: Subscription | undefined;

  barChart: any;
  doughnutChart: any;
  allDonations: { associationName: string, totalDonation: number }[] = [];
  topDonators: { donatorId: string, totalDonation: number, name: string }[] = [];

  private chart: am4maps.MapChart | undefined; 

  
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
     this.getDashboardData();  
    this.fetchTopDonations();
    this.fetchTopDonators();
    this.mapChart();

   
   }

   ngAfterViewInit(): void {
    this.getDashboardData(); 
  
    this.renderPieChart();
    this.renderLineChart();
    this.renderBarChart();
    if (this.donationsSubscription) {
      this.donationsSubscription.unsubscribe();
    }
   }

  ngOnDestroy(): void {
    if (this.doughnutChartSubscription) {
      this.doughnutChartSubscription.unsubscribe();
    }
    if(this.chart){
      this.chart.dispose();
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
  

  mapChart(): void {
    const tunisiaRegionalData = [
      { region: 'Tunis', value: 100 },
      { region: 'Ariana', value: 100 },
      { region: 'Ben Arous', value: 100 },
      { region: 'Manouba', value: 100 },
      { region: 'Nabeul', value: 100 },
      { region: 'Bizerte', value: 100 },
      { region: 'Beja', value: 100 },
      { region: 'Jendouba', value: 100 },
      { region: 'Kef', value: 100 },
      { region: 'Siliana', value: 100 },
      { region: 'Sousse', value: 10100 },
      { region: 'Mahdia', value: 100 },
      { region: 'Sfax', value: 100 },
      { region: 'Kairouan', value: 100 },
      { region: 'Kasserine', value: 100 },
      { region: 'Sidi Bouzid', value: 100 },
      { region: 'Gabes', value: 100 },
      { region: 'Medenine', value: 100 },
      { region: 'Tataouine', value: 100 },
      { region: 'Tozeur', value: 100 },
      { region: 'Gafsa', value: 100 },
    ];

    this.chart = am4core.create('chartdiv', am4maps.MapChart);
    this.chart.geodata = am4geodata_tunisiaLow; // Use Tunisia map data
    this.chart.projection = new am4maps.projections.Miller();
  
    let polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
  
    // Configure the series to display the data
    polygonSeries.data = tunisiaRegionalData;
    polygonSeries.dataFields.value = 'value';
    console.log('value',tunisiaRegionalData.values)
    polygonSeries.dataFields.id = 'region';
  
    // Configure the map polygon appearance
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{name}: {value}';
    polygonTemplate.fillOpacity = 0.6;
  
    // Add a legend to the chart
    this.chart.legend = new am4maps.Legend();
    this.chart.legend.position = 'bottom';
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

  aggregateDonationsPerAssociation(donAssociations: DonAssociation[], donCollectes: DonCollecte[]): Observable<{ [key: string]: number }> {
    const aggregatedData: { [key: string]: number } = {};
  
    const observables: Observable<string | undefined>[] = [];
  
    donCollectes.forEach((donCollecte: DonCollecte) => {
      const collecteId = donCollecte.id_collecte;
      observables.push(this.getAssociationIdFromCollecte(collecteId));
    });
  
    return forkJoin(observables).pipe(
      map((associationIds: (string | undefined)[]) => {

        donAssociations.forEach((donAssociation: DonAssociation) => {
          const associationId = donAssociation.id_association;
          aggregatedData[associationId] = (aggregatedData[associationId] || 0) + donAssociation.montant;
        });
  
        donCollectes.forEach((donCollecte: DonCollecte, index: number) => {
          const associationId = associationIds[index];
          if (associationId) {
            aggregatedData[associationId] = (aggregatedData[associationId] || 0) + donCollecte.montant;
          } else {
            console.log('Error: Association ID not found for DonCollecte:', donCollecte);
          }
        });
  
        return aggregatedData;
      })
    );
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
  this.service.getAllDonAssociation().subscribe(
    (donAssociations: DonAssociation[]) => {
      this.service.getAllDonCollecte().subscribe(
        (donCollectes: DonCollecte[]) => {
          this.aggregateDonationsPerAssociation(donAssociations, donCollectes).subscribe(aggregatedData => {
            console.log('Aggregated data doughnut:', aggregatedData);

            const associationIds = Object.getOwnPropertyNames(aggregatedData);
            console.log('Association IDs:', associationIds);

            // Fetch association names for each ID and replace them in labels
            const labelsPromises = associationIds.map(id => this.getAssociationNameById(id));
            
            Promise.all(labelsPromises).then(labels => {
              console.log('Labels:', labels);

              const datasets = [{
                data: Object.values(aggregatedData),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.5)',
                  'rgba(54, 162, 235, 0.5)',
                  'rgba(255, 206, 86, 0.5)',
                ],
                borderWidth: 1
              }];

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
                  data: {
                    labels: labels,
                    datasets: datasets
                  },
                  options: {
                    responsive: true
                  }
                });
              } catch (error) {
                console.error('Error creating doughnut chart:', error);
              }
            }).catch(error => {
              console.error('Error fetching association names:', error);
            });
          });
        },
        (error) => {
          console.error('Error fetching donations to collecte:', error);
        }
      );
    },
    (error) => {
      console.error('Error fetching donations to associations:', error);
    }
  );
}


fetchTopDonations() {
  console.log('Fetching all donations...');
  this.service.getAllDonAssociation().subscribe(
    (donAssociations: DonAssociation[]) => {
      this.service.getAllDonCollecte().subscribe(
        (donCollectes: DonCollecte[]) => {
          this.aggregateDonationsPerAssociation(donAssociations, donCollectes).subscribe(aggregatedData => {
            // Sort aggregated data to get all donations
            const sortedDonations = Object.entries(aggregatedData)
              .map(([associationId, totalDonation]) => ({ associationId, totalDonation }))
              .sort((a, b) => b.totalDonation - a.totalDonation);

            // Fetch association names for each ID
            const labelsPromises = sortedDonations.map(({ associationId }) => this.getAssociationNameById(associationId));

            Promise.all(labelsPromises).then(labels => {
              console.log('All Donations:', sortedDonations);
              console.log('Association Names:', labels);

              // Store all donations with association names
              this.allDonations = sortedDonations.map(({ totalDonation }, index) => ({
                associationName: labels[index],
                totalDonation
              }));
            }).catch(error => {
              console.error('Error fetching association names:', error);
            });
          });
        },
        (error) => {
          console.error('Error fetching donations to collecte:', error);
        }
      );
    },
    (error) => {
      console.error('Error fetching donations to associations:', error);
    }
  );
}
  
  getDashboardData(): void {
    this.analyse.getSatisfactionRate().subscribe(
      (data: AnalyseSentiment) => {
        this.satisfactionRate = Math.floor(data.satisfaction_rate);
        console.log('Taux de satisfaction:', this.satisfactionRate);
      },
      error => {
        console.log('Erreur lors de la récupération du taux de satisfaction :', error);
      }
    );
  }

  getAssociationNameById(associationId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Assuming there's an asynchronous operation here, like an HTTP request
      this.associationService.getAssociationNameById(associationId).subscribe(
        (name: string | undefined) => { // Explicitly specify the parameter type
          if (name !== undefined) {
            resolve(name);
          } else {
            reject('Association name not found');
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
 
  fetchTopDonators() {
    console.log('Fetching top donators with names...');
    this.service.getAllDonAssociation().subscribe(
      (donAssociations: DonAssociation[]) => {
        this.service.getAllDonCollecte().subscribe(
          (donCollectes: DonCollecte[]) => {
            this.aggregateDonationsPerDonator(donAssociations, donCollectes).subscribe(aggregatedData => {
<<<<<<< HEAD
              console.log('Top donators aggregated data', aggregatedData);
              const sortedDonators = Object.entries(aggregatedData)
                .map(([donatorId, totalDonation]) => ({ donatorId, totalDonation }))
                .sort((a, b) => b.totalDonation - a.totalDonation);
        
=======
              console.log('top donateurs aggregated data', aggregatedData);
              const sortedDonators = Object.entries(aggregatedData)
                .map(([donatorId, totalDonation]) => ({ donatorId, totalDonation }))
                .sort((a, b) => b.totalDonation - a.totalDonation);
  
>>>>>>> bd7b7d7bb4cdb209e79a5550c9d0ee4973d40dce
              const namesObservables = sortedDonators.map(({ donatorId }) => {
                return this.getDonatorNameById(donatorId);
              });
  
              console.log('Names Observables:', namesObservables);
  
<<<<<<< HEAD
              forkJoin(namesObservables).subscribe(names => {
                console.log('Names:', names);
                this.topDonators = sortedDonators.map((donator, index) => ({
                  donatorId: donator.donatorId,
                  totalDonation: donator.totalDonation,
                  name: names[index] || 'Unknown' // Provide a default value if name is undefined
                }));
                console.log('Top Donators:', this.topDonators);
              }, error => {
                console.error('Error fetching donator names:', error);
=======
              namesObservables.forEach((observable, index) => {
                observable.subscribe({
                  next: name => {
                    console.log(`Value emitted by Observable ${index}:`, name);
                  },
                  error: err => {
                    console.error(`Error in Observable ${index}:`, err);
                  },
                  complete: () => {
                    console.log(`Observable ${index} completed.`);
                  }
                });
              });
  
              forkJoin(namesObservables).subscribe({
                next: names => {
                  console.log('Names:', names);
                  this.topDonators = sortedDonators.map((donator, index) => ({
                    ...donator,
                    name: names[index]
                  }));
                  console.log('Top Donators:', this.topDonators);
                },
                error: err => {
                  console.error('Error fetching donator names:', err);
                }
>>>>>>> bd7b7d7bb4cdb209e79a5550c9d0ee4973d40dce
              });
            });
          },
          (error) => {
            console.error('Error fetching donations to collecte:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching donations to associations:', error);
      }
    );
  }
  
<<<<<<< HEAD
    
=======

>>>>>>> bd7b7d7bb4cdb209e79a5550c9d0ee4973d40dce
  
  aggregateDonationsPerDonator(donAssociations: DonAssociation[], donCollectes: DonCollecte[]): Observable<{ [key: string]: number }> {
    const aggregatedData: { [key: string]: number } = {};
  
    donAssociations.forEach((donation: DonAssociation) => {
      const donatorId = donation.id_donateur;
      if (donatorId) {
        aggregatedData[donatorId] = (aggregatedData[donatorId] || 0) + donation.montant;
      }
    });
  
    donCollectes.forEach((donation: DonCollecte) => {
      const donatorId = donation.id_donateur;
      if (donatorId) {
        aggregatedData[donatorId] = (aggregatedData[donatorId] || 0) + donation.montant;
      }
    });
  
    return of(aggregatedData);
  }

  getDonatorNameById(donatorId: string): Observable<string> {
    return this.firestore.collection('Donateur').doc(donatorId).get().pipe(
      map(doc => {
        if (doc.exists) {
          const data = doc.data() as Donateur;
          return `${data.nom} ${data.prenom}`;
        } else {
          throw new Error(`No user found with id ${donatorId}`);
        }
      }),
      take(1) // Ensure the Observable completes after emitting a value
    );
  }
<<<<<<< HEAD
  
  
   
=======

>>>>>>> bd7b7d7bb4cdb209e79a5550c9d0ee4973d40dce
}