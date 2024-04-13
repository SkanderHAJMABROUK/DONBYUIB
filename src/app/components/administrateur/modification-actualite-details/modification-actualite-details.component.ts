import { Component, Input, OnInit } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { DemandeModificationActualite } from 'src/app/interfaces/demande-modification-actualite';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { Actualite } from 'src/app/interfaces/actualite';
import { ActualiteService } from 'src/app/services/actualite.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modification-actualite-details',
  templateUrl: './modification-actualite-details.component.html',
  styleUrls: ['./modification-actualite-details.component.css']
})
export class ModificationActualiteDetailsComponent {

  @Input() demande!: DemandeModificationActualite;

  faXmark = faXmark;
  modifiedFields: { label: string, oldValue: any, newValue: any }[] = [];
  commonFields: { label: string, oldValue: any, newValue: any }[] = [];
  acceptedFields: { label: string, oldValue: any, newValue: any }[] = [];
  refusedFields: { label: string, oldValue: any, newValue: any }[] = [];
  nbrChampsConcernes:number=0;
  rapportRefus : string = '';

  constructor(public adminService: AdministrateurService, private actualiteService: ActualiteService,
    private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.compareFields();
  }

  compareFields(): void {
    if (this.demande.id_actualite) {
      this.actualiteService.getActualiteById(this.demande.id_actualite).subscribe(existingActualite => {
        if (existingActualite) {
          const commonFields: (keyof Actualite & keyof DemandeModificationActualite)[] = [
            'titre', 'image', 'description'
          ];
  
          commonFields.forEach(field => {
            if (existingActualite[field] !== this.demande[field]) {
              const modifiedFieldIndex = this.modifiedFields.findIndex(item => item.label === field);
              if (modifiedFieldIndex === -1) {
                this.modifiedFields.push({
                  label: field,
                  oldValue: existingActualite[field],
                  newValue: this.demande[field]
                });
                this.nbrChampsConcernes = this.modifiedFields.length;
                console.log(this.modifiedFields)
              }
            } else {
              const commonFieldIndex = this.commonFields.findIndex(item => item.label === field);
              if (commonFieldIndex === -1) {
                this.commonFields.push({
                  label: field,
                  oldValue: existingActualite[field],
                  newValue: this.demande[field]
                });
                console.log(this.commonFields)
              }
            }
          });
        } else {
          console.log('Pas d\'actualité trouvé!')
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
            if (this.demande.id_actualite) {

                const modifiedField = this.modifiedFields.find(field => field.label === label);

                if (modifiedField) {
                    const remainingFields = this.modifiedFields.filter(field => field.label !== label);
                    this.modifiedFields = remainingFields;
                    this.acceptedFields.push(modifiedField);
                    if (this.acceptedFields.length === this.nbrChampsConcernes && this.demande.id) {
                        this.updateDemandeEtat(this.demande.id, 'accepté')
                            .then(() => {
                                console.log('Demandes : ', this.modifiedFields);
                            });
                    }

                    this.actualiteService.updateActualiteField(this.demande.id_actualite, label as keyof Partial<Actualite>, modifiedField.newValue)
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
      if (this.demande.id_actualite) {

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
    const demandeRef = this.firestore.collection('DemandeModificationActualite').doc(id);
    return demandeRef.update({ etat: etat });
  } 

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


}
