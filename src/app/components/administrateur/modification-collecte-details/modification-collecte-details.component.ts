import { Component, Input, OnInit } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { DemandeModificationCollecte } from 'src/app/interfaces/demande-modification-collecte';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { Collecte } from 'src/app/interfaces/collecte';
import { CollecteService } from 'src/app/services/collecte.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Swal from 'sweetalert2';
import { AssociationService } from 'src/app/services/association.service';

@Component({
  selector: 'app-modification-collecte-details',
  templateUrl: './modification-collecte-details.component.html',
  styleUrls: ['./modification-collecte-details.component.css']
})
export class ModificationCollecteDetailsComponent implements OnInit{

  @Input() demande!: DemandeModificationCollecte;

  faXmark = faXmark;
  modifiedFields: { label: string, oldValue: any, newValue: any }[] = [];
  commonFields: { label: string, oldValue: any, newValue: any }[] = [];
  acceptedFields: { label: string, oldValue: any, newValue: any }[] = [];
  refusedFields: { label: string, oldValue: any, newValue: any }[] = [];
  nbrChampsConcernes:number=0;
  rapportRefus : string = '';

  constructor(public adminService: AdministrateurService, private collecteService: CollecteService,
    private firestore: AngularFirestore, private associationService:AssociationService) { }

  ngOnInit(): void {
    this.modifiedFields = [];
    this.commonFields = [];
    this.compareFields();
  }

  compareFields(): void {
    if (this.demande.id_collecte) {
      this.collecteService.getCollecteById(this.demande.id_collecte).subscribe(existingCollecte => {
        if (existingCollecte) {
          const commonFields: (keyof Collecte & keyof DemandeModificationCollecte)[] = [
            'nom', 'image', 'description','date_debut', 'date_fin'
          ];
  
          commonFields.forEach(field => {
            if (existingCollecte[field] !== this.demande[field]) {
              const modifiedFieldIndex = this.modifiedFields.findIndex(item => item.label === field);
              if (modifiedFieldIndex === -1) {
                this.modifiedFields.push({
                  label: field,
                  oldValue: existingCollecte[field],
                  newValue: this.demande[field]
                });
                this.nbrChampsConcernes = this.modifiedFields.length;
              }
            } else {
              const commonFieldIndex = this.commonFields.findIndex(item => item.label === field);
              if (commonFieldIndex === -1) {
                this.commonFields.push({
                  label: field,
                  oldValue: existingCollecte[field],
                  newValue: this.demande[field]
                });
                console.log(this.commonFields)
              }
            }
          });
        } else {
          console.log('Pas de collecte trouvé!')
        }
      });
    }  
  }

  acceptModification(label: string): void {
    Swal.fire({
        title: "Confirmez votre choix!",
        text: `Vous acceptez la modification du champ ${label} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Accepter"
    }).then((result) => {
        if (result.isConfirmed) {
            if (this.demande.id_collecte) {

                const modifiedField = this.modifiedFields.find(field => field.label === label);

                if (modifiedField) {
                    const remainingFields = this.modifiedFields.filter(field => field.label !== label);
                    this.modifiedFields = remainingFields;
                    this.acceptedFields.push(modifiedField);
                    if (this.acceptedFields.length === this.nbrChampsConcernes && this.demande.id) {
                        this.updateDemandeEtat(this.demande.id, 'accepté')
                            .then(() => {
                                console.log('Demandes : ', this.modifiedFields);
                                if (this.demande && this.demande.id_association) {
                                  this.associationService.getAssociationEmailById(this.demande.id_association).subscribe(toEmail => {
                                    if (toEmail) {
                                      console.log('Retrieved email:', toEmail);
                                      if (this.demande.id_association) {
                                        // Use getAssociationNameById from associationService
                                        this.associationService.getAssociationNameById(this.demande.id_association).subscribe(associationName => {
                                          if (associationName) {
                                            // Ensure id_collecte is a string before using it
                                            const id_collecte = this.demande.id_collecte ? this.demande.id_collecte : '';
                                            if (id_collecte) {
                                              this.collecteService.getCollecteNameById(id_collecte).subscribe(collecteName => {
                                                const dateDemande = this.demande.date ? this.formatDate(new Date(this.demande.date)) : '';
                                                const detailsModifications = this.generateDetailsModifications(1);
                                                this.adminService.sendModificationResultNotification(toEmail, collecteName, associationName, dateDemande, detailsModifications);
                                              });
                                            } else {
                                              console.error('id_collecte is undefined or not a valid string.');
                                            }
                                          }
                                        });
                                      }
                                    } else {
                                      console.error('Email address not found for the association.');
                                    }
                                  });
                                }
                                
                            });
                    }

                    this.collecteService.updateCollecteField(this.demande.id_collecte, label as keyof Partial<Collecte>, modifiedField.newValue)
                        .then(() => {
                            console.log('Demandes acceptés', this.acceptedFields);
                            Swal.fire({
                                title: "Accepté!",
                                text: `Le champ ${label} a été modifié`,
                                icon: "success"
                            });
                        })
                        .catch(error => {
                            console.error('Erreur lors de la mise à jour du champ de la collecte:', error);
                            Swal.fire({
                                title: "Erreur!",
                                text: `Une erreur s'est produite lors de la mise à jour du champ de la collecte.`,
                                icon: "error"
                            });
                        });
                } else {
                    console.error('Champ modifié non trouvé dans la liste des champs modifiés.');
                    Swal.fire({
                        title: "Erreur!",
                        text: `Champ modifié non trouvé dans la liste des champs modifiés.`,
                        icon: "error"
                    });
                }
            } else {
                console.error('ID de la collecte non défini.');
                Swal.fire({
                    title: "Erreur!",
                    text: `ID de la collecte non défini.`,
                    icon: "error"
                });
            }
        }
    });
}

rejectModification(label: string): void {
  Swal.fire({
    title: `Confirmez votre choix!`,
    text: `Vous refusez la modification du champ ${label} ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Refuser',
    input: 'textarea', 
    inputPlaceholder: 'Raison du refus', 
    inputAttributes: {
      autocapitalize: 'off'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.rapportRefus += this.capitalizeFirstLetter(label) + ` : ` + result.value + `\n`;
      console.log(this.rapportRefus);
      if (this.demande.id_collecte) {

        const modifiedField = this.modifiedFields.find(field => field.label === label);

        if (modifiedField) {
            const remainingFields = this.modifiedFields.filter(field => field.label !== label);
            this.modifiedFields = remainingFields;
            this.refusedFields.push(modifiedField);

            if (this.refusedFields.length >= 1
              && this.acceptedFields.length + this.refusedFields.length === this.nbrChampsConcernes
              && this.demande.id) {
                this.updateDemandeEtat(this.demande.id, 'refusé')
                    .then(() => {
                        console.log('Demandes : ', this.modifiedFields);
                        this.envoyerRapport();
                        Swal.fire({
                            title: "Refusé!",
                            text: `La modification du champ ${label} a été refusée.`,
                            icon: "success"
                        });

                        if (this.demande && this.demande.id_association) {
                          this.associationService.getAssociationEmailById(this.demande.id_association).subscribe(toEmail => {
                            if (toEmail) {
                              console.log('Retrieved email:', toEmail);
                              if (this.demande.id_association) {
                                // Use getAssociationNameById from associationService
                                this.associationService.getAssociationNameById(this.demande.id_association).subscribe(associationName => {
                                  if (associationName) {
                                    // Ensure id_collecte is a string before using it
                                    const id_collecte = this.demande.id_collecte ? this.demande.id_collecte : '';
                                    if (id_collecte) {
                                      this.collecteService.getCollecteNameById(id_collecte).subscribe(collecteName => {
                                        const dateDemande = this.demande.date ? this.formatDate(new Date(this.demande.date)) : '';
                                        const detailsModifications = this.generateDetailsModifications(0);
                                        this.adminService.sendModificationResultNotification(toEmail, collecteName, associationName, dateDemande, detailsModifications);
                                      });
                                    } else {
                                      console.error('id_collecte is undefined or not a valid string.');
                                    }
                                  }
                                });
                              }
                            } else {
                              console.error('Email address not found for the association.');
                            }
                          });
                        }
                    });
            } else {
                Swal.fire({
                    title: "Refusé!",
                    text: `La modification du champ ${label} a été refusée.`,
                    icon: "success"
                });
            }
        } else {
            console.error('Champ modifié non trouvé dans la liste des champs modifiés.');
            Swal.fire({
                title: "Erreur!",
                text: `Champ modifié non trouvé dans la liste des champs modifiés.`,
                icon: "error"
            });
        }
    } else {
        console.error('ID de la collecte non défini.');
        Swal.fire({
            title: "Erreur!",
            text: `ID de la collecte non défini.`,
            icon: "error"
        });
    }
    }
  });
}

envoyerRapport(): void {
  if (this.acceptedFields.length + this.refusedFields.length === this.nbrChampsConcernes
    && this.refusedFields.length > 0
  ) {
    const demandeRef = this.firestore.collection('DemandeModificationCollecte').doc(this.demande.id);
    demandeRef.update({ rapport: this.rapportRefus })
      .then(() => {
        console.log('Rapport envoyé avec succès.');
      })
      .catch(error => {
        console.error('Erreur lors de l\'envoi du rapport :', error);
      });
  }
}


updateDemandeEtat(id: string, etat: string): Promise<void> {
  const adminId = this.adminService.getCurrentAdminId();
  const demandeRef = this.firestore.collection('DemandeModificationCollecte').doc(id);
  return demandeRef.update({ etat: etat, adminId: adminId }); 
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

  generateDetailsModifications(scenario: number): string {
    if (scenario === 1) {
      return this.acceptedFields.map(field => `${this.capitalizeFirstLetter(field.label)}: Modification acceptée`).join('\n');
    } else {
      const acceptedDetails = this.acceptedFields.map(field => `${this.capitalizeFirstLetter(field.label)}: Modification acceptée`).join('\n');
      const refusedDetails = this.refusedFields.map(field => `${this.capitalizeFirstLetter(field.label)}: Modification refusée`).join('\n');
      return `${acceptedDetails}\n${refusedDetails}\n\nRapport des refus : ${this.rapportRefus}`;
    }
  }

}
