import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DemandeAssociation } from 'src/app/interfaces/demande-association';
import { AssociationService } from 'src/app/services/association.service';
import {
  faList,
  faCheck,
  faXmark,
  faChevronRight,
  faChevronLeft,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import Swal from 'sweetalert2';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Association } from 'src/app/interfaces/association';
import { OcrService } from 'src/app/services/ocr.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-demandes-associations',
  templateUrl: './demandes-associations.component.html',
  styleUrls: ['./demandes-associations.component.css'],
})
export class DemandesAssociationsComponent implements OnInit {
  results!: any[];
  VerifOCR: boolean = false;
  hasMatriculeFiscal: boolean = false;
  matricule: string = '';

  faChevronRight = faChevronRight;
  Association!: Association;
  faChevronLeft = faChevronLeft;
  faList = faList;
  faCheck = faCheck;
  faXmark = faXmark;
  faMagnifyingGlass = faMagnifyingGlass;

  showConfirmationModal: boolean = false;

  demandesAssociations: DemandeAssociation[] = [];
  filteredDemandeAssociationList: DemandeAssociation[] = [];
  searchTerm: string = '';
  selectedDemandeAssociation: DemandeAssociation = {} as DemandeAssociation;
  pageSize: number = 10;
  currentPage: number = 1;
  selectedPageSize: string = '10'; // Par défaut, la taille de la page est définie sur 10
  categories: string[] = [];
  selectedCategorie: string = '';
  imageAffichee: string = ''; // URL de l'image affichée dans la lightbox
  selectedAssociation!: DemandeAssociation;
  rapportRefus: string = '';

  constructor(
    private associationService: AssociationService,
    private router: Router,
    public adminService: AdministrateurService,
    private firestore: AngularFirestore,
    private ocr: OcrService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.selectedPageSize = '10';
    this.getAssociations();
  }

  afficherDetails(association: DemandeAssociation) {
    if (association.id) {
      this.associationService
        .getDemandeAssociationById(association.id)
        .subscribe((response) => {
          this.selectedAssociation = response!;
          this.adminService.associationDetailShowModal = true;
          console.log(response);
        });
    }
  }

  getCategories() {
    this.categories = Array.from(
      new Set(
        this.demandesAssociations
          .map((demandeAssociation) => demandeAssociation.categorie)
          .filter((categorie) => !!categorie),
      ),
    );
  }

  getAssociations(): void {
    this.associationService
      .getPendingDemandesAssociations()
      .subscribe((demandesAssociations) => {
        this.demandesAssociations = demandesAssociations;
        this.getCategories();
        this.chercherAssociation();
      });
  }

  chercherAssociation(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredDemandeAssociationList = this.demandesAssociations.filter(
      (demandeAssociation, index) =>
        index >= startIndex &&
        index < endIndex &&
        demandeAssociation.nom
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) &&
        (!this.selectedCategorie ||
          demandeAssociation.categorie === this.selectedCategorie),
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.chercherAssociation();
  }

  onPageSizeChange(): void {
    this.pageSize = +this.selectedPageSize; // Convertit la chaîne en nombre
    this.currentPage = 1; // Réinitialise à la première page
    this.chercherAssociation(); // Réapplique la pagination avec la nouvelle taille de page
    this.getTotalPages(); // Recalcule le nombre total de pages
  }

  getTotalPages(): number {
    return Math.ceil(this.demandesAssociations.length / this.pageSize);
  }

  afficherImage(url: string): void {
    this.imageAffichee = url; // Afficher l'image dans la lightbox
  }

  cacherImage(): void {
    this.imageAffichee = '';
  }

  refuserAssociation(selectedDemandeAssociation: DemandeAssociation): void {
    Swal.fire({
      title: `Vous voulez refuser la demande de ${selectedDemandeAssociation.nom} ?`,
      text: 'La demande sera refusée définitivement',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, refuser',
      input: 'textarea', // Use input type textarea
      inputPlaceholder: 'Raison du refus', // Placeholder for the textarea
      inputAttributes: {
        autocapitalize: 'off',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.rapportRefus += this.capitalizeFirstLetter(result.value);

        if (selectedDemandeAssociation.id) {
          this.updateDemandeEtat(selectedDemandeAssociation.id, 'refusé')
            .then(() => {
              if (selectedDemandeAssociation.id_association) {
                this.associationService
                  .deleteAssociationById(
                    selectedDemandeAssociation.id_association,
                  )
                  .then(() => {
                    if (selectedDemandeAssociation.id) {
                      this.envoyerRapport(selectedDemandeAssociation.id);
                    } else {
                      console.error('ID de la demande indéfini.');
                    }

                    Swal.fire({
                      title: 'Refusé!',
                      text: `La demande de ${selectedDemandeAssociation.nom} a été refusée.`,
                      icon: 'success',
                    });

                    if (
                      selectedDemandeAssociation &&
                      selectedDemandeAssociation.id_association
                    ) {
                      this.associationService
                        .getAssociationEmailById(
                          selectedDemandeAssociation.id_association,
                        )
                        .subscribe((toEmail) => {
                          if (toEmail) {
                            console.log('Retrieved email:', toEmail);
                            if (selectedDemandeAssociation.id_association) {
                              // Use getAssociationNameById from associationService
                              this.associationService
                                .getAssociationNameById(
                                  selectedDemandeAssociation.id_association,
                                )
                                .subscribe((associationName) => {
                                  if (associationName) {
                                    const titreDemande = `l\'inscription de l\'association "${selectedDemandeAssociation.nom}"`;
                                    const typeDemande =
                                      "INSCRIPTION D'ASSOCIATION";
                                    const dateDemande =
                                      selectedDemandeAssociation.date
                                        ? this.formatDate(
                                            new Date(
                                              selectedDemandeAssociation.date,
                                            ),
                                          )
                                        : '';
                                    const dateReponse = this.formatDate(
                                      new Date(),
                                    );
                                    const causeRefus = this.rapportRefus;
                                    this.adminService.sendRefusNotification(
                                      toEmail,
                                      associationName,
                                      titreDemande,
                                      typeDemande,
                                      dateDemande,
                                      dateReponse,
                                      causeRefus,
                                    );
                                  }
                                });
                            }
                          } else {
                            console.error(
                              'Email address not found for the association.',
                            );
                          }
                        });
                    }
                  })
                  .catch((error) => {
                    console.error(
                      "Erreur lors de la suppression de l'association:",
                      error,
                    );
                    Swal.fire({
                      title: 'Erreur',
                      text: "Une erreur s'est produite lors du refus de la demande.",
                      icon: 'error',
                    });
                  });
              } else {
                console.error("ID de l'association indéfini.");
                Swal.fire({
                  title: 'Erreur',
                  text: "ID de l'association indéfini.",
                  icon: 'error',
                });
              }
            })
            .catch((error) => {
              console.error(
                "Erreur lors de la mise à jour de l'état de la demande:",
                error,
              );
              Swal.fire({
                title: 'Erreur',
                text: "Une erreur s'est produite lors du refus de la demande.",
                icon: 'error',
              });
            });
        } else {
          console.error('ID de la demande indéfini.');
          Swal.fire({
            title: 'Erreur',
            text: 'ID de la demande indéfini.',
            icon: 'error',
          });
        }
      }
    });
  }

  accepterAssociation(selectedDemandeAssociation: DemandeAssociation): void {
    if (
      !selectedDemandeAssociation ||
      !selectedDemandeAssociation.id_association
    ) {
      console.error(
        "La demande de l'association ou l'ID de l'association est indéfinie.",
      );
      Swal.fire({
        title: 'Erreur',
        text: "La demande de l'association ou l'ID de l'association est indéfinie.",
        icon: 'error',
      });
      return;
    }

    Swal.fire({
      title: `Vous voulez accepter la demande de ${selectedDemandeAssociation.nom} ?`,
      text: 'La demande sera acceptée définitivement',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, accepter',
    }).then((result) => {
      if (result.isConfirmed) {
        // Mettre à jour l'état de la demande à "accepté"
        if (selectedDemandeAssociation.id) {
          this.updateDemandeEtat(selectedDemandeAssociation.id, 'accepté')
            .then(() => {
              // Mettre à jour l'état de l'association à "actif"
              if (selectedDemandeAssociation.id_association) {
                this.updateAssociationEtat(
                  selectedDemandeAssociation.id_association,
                  'actif',
                )
                  .then(() => {
                    Swal.fire({
                      title: 'Accepté!',
                      text: `La demande de ${selectedDemandeAssociation.nom} a été acceptée.`,
                      icon: 'success',
                    });

                    if (
                      selectedDemandeAssociation &&
                      selectedDemandeAssociation.id_association
                    ) {
                      this.associationService
                        .getAssociationEmailById(
                          selectedDemandeAssociation.id_association,
                        )
                        .subscribe((toEmail) => {
                          if (toEmail) {
                            console.log('Retrieved email:', toEmail);
                            if (selectedDemandeAssociation.id_association) {
                              // Use getAssociationNameById from associationService
                              this.associationService
                                .getAssociationNameById(
                                  selectedDemandeAssociation.id_association,
                                )
                                .subscribe((associationName) => {
                                  if (associationName) {
                                    const titreDemande = `l\'inscription de l\'association "${selectedDemandeAssociation.nom}"`;
                                    const typeDemande =
                                      "INSCRIPTION D'ASSOCIATION";
                                    const dateDemande =
                                      selectedDemandeAssociation.date
                                        ? this.formatDate(
                                            new Date(
                                              selectedDemandeAssociation.date,
                                            ),
                                          )
                                        : '';
                                    const dateReponse = this.formatDate(
                                      new Date(),
                                    );
                                    this.adminService.sendAcceptationNotification(
                                      toEmail,
                                      associationName,
                                      titreDemande,
                                      typeDemande,
                                      dateDemande,
                                      dateReponse,
                                    );
                                  }
                                });
                            }
                          } else {
                            console.error(
                              'Email address not found for the association.',
                            );
                          }
                        });
                    }
                  })
                  .catch((error) => {
                    console.error(
                      "Erreur lors de la mise à jour de l'état de l'association:",
                      error,
                    );
                    Swal.fire({
                      title: 'Erreur',
                      text: "Une erreur s'est produite lors de l'acceptation de la demande.",
                      icon: 'error',
                    });
                  });
              } else {
                console.error("ID de l'association indéfini.");
                Swal.fire({
                  title: 'Erreur',
                  text: "ID de l'association indéfini.",
                  icon: 'error',
                });
              }
            })
            .catch((error) => {
              console.error(
                "Erreur lors de la mise à jour de l'état de la demande:",
                error,
              );
              Swal.fire({
                title: 'Erreur',
                text: "Une erreur s'est produite lors de l'acceptation de la demande.",
                icon: 'error',
              });
            });
        } else {
          console.error('ID de la demande indéfini.');
          Swal.fire({
            title: 'Erreur',
            text: 'ID de la demande indéfini.',
            icon: 'error',
          });
        }
      }
    });
  }

  updateDemandeEtat(id: string, etat: string): Promise<void> {
    const adminId = this.adminService.getCurrentAdminId();
    const demandeRef = this.firestore.collection('DemandeAssociation').doc(id);
    return demandeRef.update({ etat: etat, adminId: adminId });
  }

  updateAssociationEtat(associationId: string, etat: string): Promise<void> {
    const demandeRef = this.firestore
      .collection('Association')
      .doc(associationId);
    return demandeRef.update({ etat: etat });
  }

  verifOCR(associationId: string | undefined) {
    this.spinner.show();

    console.log(this.VerifOCR);
    console.log(associationId);
    if (associationId)
      this.ocr.processImage(associationId).subscribe(
        (data) => {
          this.results = data;
          console.log('ocr data', data);
          this.checkMatriculeFiscal(this.results);
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des résultats : ',
            error,
          );
        },
      );
  }

  checkMatriculeFiscal(results: any[]) {
    // Show spinner while processing

    this.hasMatriculeFiscal = false;

    for (const result of results) {
      if (result.matricule_fiscal !== null) {
        this.hasMatriculeFiscal = true;
        this.matricule = result.matricule_fiscal;
        console.log('Matricule fiscal trouvée :', this.matricule);
        break;
      }
    }

    console.log('hasMatriculeFiscal :', this.hasMatriculeFiscal);

    // Hide spinner after processing
    this.spinner.hide();

    if (this.hasMatriculeFiscal) {
      // Popup with a tick mark for success
      Swal.fire({
        title: 'Success!',
        text: 'Matricule fiscal trouvée : ' + this.matricule,
        icon: 'success',
      });
    } else {
      // Popup with a X mark for error
      Swal.fire({
        title: 'Error!',
        text: "OCR n'a pas pu capturer le matricule fiscal",
        icon: 'error',
      });
    }
  }

  envoyerRapport(id: string): void {
    if (id) {
      const demandeRef = this.firestore
        .collection('DemandeAssociation')
        .doc(id);

      demandeRef.get().subscribe((docSnapshot) => {
        if (docSnapshot.exists) {
          demandeRef
            .update({ rapport: this.rapportRefus })
            .then(() => {
              console.log('Rapport envoyé avec succès.');
            })
            .catch((error) => {
              console.error("Erreur lors de l'envoi du rapport :", error);
            });
        } else {
          console.error('Document does not exist for the given ID:', id);
        }
      });
    } else {
      console.error('ID de la demande indéfini.');
    }
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
