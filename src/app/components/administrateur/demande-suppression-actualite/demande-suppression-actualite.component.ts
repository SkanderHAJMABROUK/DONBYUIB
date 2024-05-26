import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DemandeSuppressionActualite } from 'src/app/interfaces/demande-suppression-actualite';
import { AssociationService } from 'src/app/services/association.service';
import { faList, faCheck, faXmark, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import Swal from 'sweetalert2';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActualiteService } from 'src/app/services/actualite.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { Actualite } from 'src/app/interfaces/actualite';

@Component({
  selector: 'app-demande-suppression-actualite',
  templateUrl: './demande-suppression-actualite.component.html',
  styleUrls: ['./demande-suppression-actualite.component.css']
})
export class DemandeSuppressionActualiteComponent {

  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faList = faList;
  faCheck = faCheck;
  faXmark = faXmark;

  rapportRefus : string = '';

  associationsNames: string[] = [];
  selectedAssociation: string = '';
  associationsIds : string[] = []; 

  actualitesNames: string[] = [];
  actualitesIds : string[] = [];

  showConfirmationModal: boolean = false;

  demandesSuppressionActualites: DemandeSuppressionActualite[] = [];
  filteredDemandeSuppressionActualiteList: DemandeSuppressionActualite[] = [];
  searchTerm: string = '';
  selectedDemandeSuppressionActualite: DemandeSuppressionActualite = {} as DemandeSuppressionActualite;
  pageSize: number = 10;
  currentPage: number = 1;
  selectedPageSize: string = '10'; 
  imageAffichee: string = ''; 
  selectedTri: string = 'none'; // Par défaut, aucun tri sélectionné
  @Input() selectedActualite!: Actualite; 

  constructor(public actualiteService: ActualiteService, private router: Router, public adminService:AdministrateurService,
    private firestore: AngularFirestore, private associationService: AssociationService) { }

    ngOnInit(): void {
      this.selectedPageSize = '10';
      this.getDemandesSuppressionActualites();
    }

    getDemandesSuppressionActualites(): void {
      this.actualiteService.getPendingDemandesSuppressionActualites().subscribe(demandesSuppressionActualites => {
        this.demandesSuppressionActualites = demandesSuppressionActualites;
        this.getAssociationsIds();
        this.getActualitesIds();
        this.chercherActualite();
      });
    } 
    
    afficherDetails(actualite: DemandeSuppressionActualite) {
      if (actualite.id_actualite) {
        this.actualiteService.getActualiteById(actualite.id_actualite).subscribe((response) => {
          this.selectedActualite = response!;
          this.adminService.demandeSuppressionActualiteDetails = true;
          console.log(response);
        });
      } else {
        console.error('ID de l\'actualite associé non défini.');
      }
    }

    chercherActualite(): void {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
  
      this.filteredDemandeSuppressionActualiteList = this.demandesSuppressionActualites.filter((demandeActualite, index) =>
        index >= startIndex && index < endIndex &&
        (
        (!this.searchTerm || this.getActualiteNameById(demandeActualite.id_actualite)?.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
        (!this.selectedAssociation || this.getAssociationNameById(demandeActualite.id_association) === this.selectedAssociation) 
      ))
        
      switch (this.selectedTri) {
        case 'plusRecents':
          this.filteredDemandeSuppressionActualiteList = this.filteredDemandeSuppressionActualiteList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          break;
        case 'plusAnciens':
          this.filteredDemandeSuppressionActualiteList = this.filteredDemandeSuppressionActualiteList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          break;
        default:
          break;
      }
    }

    onPageChange(page: number): void {
      this.currentPage = page;
      this.chercherActualite();
    }
  
    onPageSizeChange(): void {
      this.pageSize = +this.selectedPageSize; // Convertit la chaîne en nombre
      this.currentPage = 1; // Réinitialise à la première page
      this.chercherActualite(); // Réapplique la pagination avec la nouvelle taille de page
      this.getTotalPages(); // Recalcule le nombre total de pages
    }
    
  
    getTotalPages(): number {
      return Math.ceil(this.demandesSuppressionActualites.length / this.pageSize);
    }
  
    afficherImage(url: string): void {
      this.imageAffichee = url; // Afficher l'image dans la lightbox
    }
  
    cacherImage(): void {
      this.imageAffichee = ''; // Cacher l'image en vidant l'URL
    }

    updateDemandeEtat(id: string, etat: string): Promise<void> {
      const adminId = this.adminService.getCurrentAdminId();
      const demandeRef = this.firestore.collection('DemandeSuppressionActualite').doc(id);
      return demandeRef.update({ etat: etat, adminId: adminId }); 
    }
    updateActualiteEtat(actualiteId: string, etat: string): Promise<void> {
      const demandeRef = this.firestore.collection('Actualite').doc(actualiteId);
      return demandeRef.update({ etat: etat });
    }
  
    getAssociationsIds(): void {
      this.associationsIds = Array.from(new Set(
        this.demandesSuppressionActualites
          .map(demandeActualite => demandeActualite.id_association)
          .filter(id_association => id_association !== undefined && id_association !== null)
      )) as string[];
  
      this.getAssociationsNamesByIds(this.associationsIds); // Call function to fetch association names 
    }
  
    getAssociationsNamesByIds(ids: string[]) {
      const observables: Observable<string | undefined>[] = ids.map(id =>
        this.associationService.getAssociationNameById(id).pipe(
          map(name => name ?? undefined) // Convert undefined values to Observable<undefined>
        )
      );
          observables.forEach((observable, index) =>
        observable.subscribe(name => {
          console.log(`Observable ${index + 1} emitted value:`, name); // Log emitted values
          if (name !== undefined) {
            this.associationsNames.push(name);
            console.log('Pushed name:', name); // Log pushed name
            console.log(this.associationsNames);
          }
        })
      )
    } 
    
    getAssociationNameById(id: string | undefined): string {
      if (!id) {
        return 'Unknown Association';
      }
      const index = this.associationsIds.indexOf(id);
      if (index !== -1) {
        return this.associationsNames[index];
      } else {
        return 'Association not found';
      }
    }
  
    getActualitesIds(): void {
      this.actualitesIds = Array.from(new Set(
        this.demandesSuppressionActualites
          .map(demandeActualite => demandeActualite.id_actualite)
          .filter(id_actualite => id_actualite !== undefined && id_actualite !== null)
      )) as string[];
  
      this.getActualitesNamesByIds(this.actualitesIds); // Call function to fetch association names 
    }
  
    getActualitesNamesByIds(ids: string[]) {
      const observables: Observable<string | undefined>[] = ids.map(id =>
        this.actualiteService.getActualiteTitleById(id).pipe(
          map(name => name ?? undefined) // Convert undefined values to Observable<undefined>
        )
      );
          observables.forEach((observable, index) =>
        observable.subscribe(name => {
          console.log(`Observable ${index + 1} emitted value:`, name); // Log emitted values
          if (name !== undefined) {
            this.actualitesNames.push(name);
            console.log('Pushed name:', name); // Log pushed name
            console.log(this.actualitesNames);
          }
        })
      )
    } 
    
    getActualiteNameById(id: string | undefined): string {
      if (!id) {
        return 'Unknown Actualite';
      }
      const index = this.actualitesIds.indexOf(id);
      if (index !== -1) {
        return this.actualitesNames[index];
      } else {
        return 'Actualite not found';
      }
    }

    refuserSuppressionActualite(selectedDemandeActualite: DemandeSuppressionActualite): void {

      Swal.fire({
        title: `Vous voulez refuser la demande de suppression de cette actualité ?`,
        text: "La demande sera refusée définitivement",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, refuser",
        input: 'textarea', 
    inputPlaceholder: 'Raison du refus', 
    inputAttributes: {
      autocapitalize: 'off'
    }
      }).then((result) => {
        if (result.isConfirmed && selectedDemandeActualite.id) {
          this.rapportRefus += result.value + ` \n`;
          this.envoyerRapport(selectedDemandeActualite.id);
          if (selectedDemandeActualite.id) {
            this.updateDemandeEtat(selectedDemandeActualite.id, "refusé").then(() => {
              console.log(selectedDemandeActualite.id_actualite);
              if (selectedDemandeActualite.id_actualite) {
                this.updateActualiteEtat(selectedDemandeActualite.id_actualite,"accepté").then(() => {
                  Swal.fire({
                    title: "Refusé!",
                    text: `La demande de suppression a été refusée.`,
                    icon: "success"
                  });

                  if (selectedDemandeActualite && selectedDemandeActualite.id_association) {
                    this.associationService.getAssociationEmailById(selectedDemandeActualite.id_association).subscribe(toEmail => {
                      if (toEmail) {
                        console.log('Retrieved email:', toEmail);
                  
                        if (selectedDemandeActualite.id_association) {
                          this.associationService.getAssociationNameById(selectedDemandeActualite.id_association).subscribe(associationName => {
                            if (associationName) {
                  
                              if (selectedDemandeActualite.id_actualite) {
                                this.actualiteService.getActualiteTitleById(selectedDemandeActualite.id_actualite).subscribe(actualiteTitre => {
                                  const titreDemande = `la suppression de l'actualité "${actualiteTitre}"`;
                                  const typeDemande = "SUPPRESSION D'ACTUALITÉ";
                                  const dateDemande = selectedDemandeActualite.date ? this.formatDate(new Date(selectedDemandeActualite.date)) : '';
                                  const dateReponse = this.formatDate(new Date());
                                  const causeRefus = this.rapportRefus;
                  
                                  this.adminService.sendRefusNotification(toEmail, associationName, titreDemande, typeDemande, dateDemande, dateReponse, causeRefus);
                                });
                              } else {
                                console.error('ID d\'actualité non défini.');
                              }
                  
                            }
                          });
                        }
                      } else {
                        console.error('Email address not found for the association.');
                      }
                    });
                  }

                }).catch(error => {
                  console.error('Erreur lors de la suppression de la collecte:', error);
                  Swal.fire({
                    title: "Erreur",
                    text: "Une erreur s'est produite lors du refus de la demande.",
                    icon: "error"
                  });
                });
              } else {
                console.error('ID de la collecte indéfini.');
                Swal.fire({
                  title: "Erreur",
                  text: "ID de la collecte indéfini.",
                  icon: "error"
                });
              }
            }).catch(error => {
              console.error('Erreur lors de la mise à jour de l\'état de la demande:', error);
              Swal.fire({
                title: "Erreur",
                text: "Une erreur s'est produite lors du refus de la demande.",
                icon: "error"
              });
            });
          } else {
            console.error('ID de la demande indéfini.');
            Swal.fire({
              title: "Erreur",
              text: "ID de la demande indéfini.",
              icon: "error"
            });
          }
        }
      });
    }
  
    accepterSuppressionActualite(selectedDemandeActualite: DemandeSuppressionActualite): void {
      if (!selectedDemandeActualite || !selectedDemandeActualite.id_actualite) {
        console.error('La demande de l\'actualité ou l\'ID de l\'actualité est indéfinie.');
        Swal.fire({
          title: "Erreur",
          text: "La demande de l'actualité ou l'ID de l'actualité est indéfinie.",
          icon: "error"
        });
        return;
      }
    
      Swal.fire({
        title: `Vous voulez accepter la demande de suppression ?`,
        text: "La demande sera acceptée définitivement",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, accepter",
      }).then((result) => {
        if (result.isConfirmed) {
          // Mettre à jour l'état de la demande à "accepté"
          if (selectedDemandeActualite.id) {
            this.updateDemandeEtat(selectedDemandeActualite.id, "accepté").then(() => {
              // Mettre à jour l'état de l'association à "accepté"
              if (selectedDemandeActualite.id_actualite) {
                this.updateActualiteEtat(selectedDemandeActualite.id_actualite, "supprimé").then(() => {
                  Swal.fire({
                    title: "Accepté!",
                    text: `La demande de suppression a été acceptée.`,
                    icon: "success"
                  });

                  if (selectedDemandeActualite && selectedDemandeActualite.id_association) {
                    this.associationService.getAssociationEmailById(selectedDemandeActualite.id_association).subscribe(toEmail => {
                      if (toEmail) {
                        console.log('Retrieved email:', toEmail);
                  
                        if (selectedDemandeActualite.id_association) {
                          this.associationService.getAssociationNameById(selectedDemandeActualite.id_association).subscribe(associationName => {
                            if (associationName) {
                  
                              if (selectedDemandeActualite.id_actualite) {
                                this.actualiteService.getActualiteTitleById(selectedDemandeActualite.id_actualite).subscribe(actualiteTitre => {
                                  const titreDemande = `la suppression de l'actualité "${actualiteTitre}"`;
                                  const typeDemande = "SUPPRESSION D'ACTUALITÉ";
                                  const dateDemande = selectedDemandeActualite.date ? this.formatDate(new Date(selectedDemandeActualite.date)) : '';
                                  const dateReponse = this.formatDate(new Date());
                  
                                  this.adminService.sendAcceptationNotification(toEmail, associationName, titreDemande, typeDemande, dateDemande, dateReponse);
                                });
                              } else {
                                console.error('ID d\'actualité non défini.');
                              }
                  
                            }
                          });
                        }
                      } else {
                        console.error('Email address not found for the association.');
                      }
                    });
                  }

                }).catch(error => {
                  console.error('Erreur lors de la mise à jour de l\'état de l\'actualité:', error);
                  Swal.fire({
                    title: "Erreur",
                    text: "Une erreur s'est produite lors de l'acceptation de la demande.",
                    icon: "error"
                  });
                });
              } else {
                console.error('ID de l\'actualité indéfini.');
                Swal.fire({
                  title: "Erreur",
                  text: "ID de l'\actualité indéfini.",
                  icon: "error"
                });
              }
            }).catch(error => {
              console.error('Erreur lors de la mise à jour de l\'état de la demande:', error);
              Swal.fire({
                title: "Erreur",
                text: "Une erreur s'est produite lors de l'acceptation de la demande.",
                icon: "error"
              });
            });
          } else {
            console.error('ID de la demande indéfini.');
            Swal.fire({
              title: "Erreur",
              text: "ID de la demande indéfini.",
              icon: "error"
            });
          }
        }
      });
    }
     
    envoyerRapport(id:string): void {
        const demandeRef = this.firestore.collection('DemandeSuppressionActualite').doc(id);
        demandeRef.update({ rapport: this.rapportRefus })
          .then(() => {
            console.log('Rapport envoyé avec succès.');
          })
          .catch(error => {
            console.error('Erreur lors de l\'envoi du rapport :', error);
          });      
    }

    formatDate(date: Date): string {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based in JavaScript
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day} - ${month} - ${year} ${hours}:${minutes}`;
    }

  
}
