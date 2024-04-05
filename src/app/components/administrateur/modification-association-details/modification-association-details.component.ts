import { Component, Input, OnInit } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { DemandeModificationAssociation } from 'src/app/interfaces/demande-modification-association';
import { AdministrateurService } from 'src/app/services/administrateur.service';
import { Association } from 'src/app/interfaces/association';
import { AssociationService } from 'src/app/services/association.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modification-association-details',
  templateUrl: './modification-association-details.component.html',
  styleUrls: ['./modification-association-details.component.css']
})
export class ModificationAssociationDetailsComponent implements OnInit {
  @Input() demande!: DemandeModificationAssociation;

  faXmark = faXmark;
  modifiedFields: { label: string, oldValue: any, newValue: any }[] = [];
  commonFields: { label: string, oldValue: any, newValue: any }[] = [];
  acceptedFields: { label: string, oldValue: any, newValue: any }[] = [];
  refusedFields: { label: string, oldValue: any, newValue: any }[] = [];
  nbrChampsConcernes:number=0;
  

  constructor(public adminService: AdministrateurService, private associationService: AssociationService,
    private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.compareFields();
  }

  compareFields(): void {
      if (this.demande.id_association) {
        this.associationService.getAssociationById(this.demande.id_association).subscribe(existingAssociation => {
          if (existingAssociation) {
            const commonFields: (keyof Association & keyof DemandeModificationAssociation)[] = [
              'nom', 'categorie', 'adresse', 'description', 'email', 'rib', 'telephone'
            ];
  
            // Compare the values of the common fields
            commonFields.forEach(field => {
              if (existingAssociation[field] !== this.demande[field]) {
                this.modifiedFields.push({
                  label: field,
                  oldValue: existingAssociation[field],
                  newValue: this.demande[field]
                });
              } else {
                this.commonFields.push({
                  label: field,
                  oldValue: existingAssociation[field],
                  newValue: this.demande[field]
                });
              }
            });
          }
        });
        this.nbrChampsConcernes = this.modifiedFields.length;
      }  
    console.log('I was executed')
  }

  isModified(label: string): boolean {
    return this.modifiedFields.some(field => field.label === label);
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
            if (this.demande.id_association) {
                const modifiedField = this.modifiedFields.filter(field => field.label === label)[0];
                this.modifiedFields = this.modifiedFields.filter(field => field.label !== label);
                console.log('Nbr de demandes : ',this.modifiedFields.length);
                if (modifiedField) {
                    this.acceptedFields.push(modifiedField);
                    console.log('Nbr de demande acceptés',this.acceptedFields.length);
                    if (this.acceptedFields.length === this.nbrChampsConcernes) {
                      if (this.demande.id) {
                          this.updateDemandeEtat(this.demande.id, 'accepté');
                      }
                  }
                    this.associationService.updateAssociationField(this.demande.id_association, label as keyof Partial<Association>, modifiedField.newValue).then(() => {
                        Swal.fire({
                            title: "Accepté!",
                            text: `Le champ ${label} a été modifié`,
                            icon: "success"
                        });
                    }).catch(error => {
                        console.error('Erreur lors de la mise à jour du champ de l\'association:', error);
                        Swal.fire({
                            title: "Erreur!",
                            text: `Une erreur s'est produite lors de la mise à jour du champ de l'association.`,
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
                console.error('ID de l\'association non défini.');
                Swal.fire({
                    title: "Erreur!",
                    text: `ID d'association non défini.`,
                    icon: "error"
                });
            }
        }
    });
} 

  rejectModification(label: string): void {
    Swal.fire({
      title: "Confirmez votre choix!",
      text: `Vous refusez la modification du champ ${label} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Refuser"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Refusé!",
          text: `Modification refusée`,
          icon: "success"
        });
      }
    });  }

    rejectAllModifications(labels: string[]): void {
    Swal.fire({
      title: "Confirmez votre choix!",
      text: "Vous refusez toutes les modifications ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Refuser"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Refusé!",
          text: "Modifications refusées",
          icon: "success"
        });
      }
    });  }

  acceptAllModifications(labels: string[]): void {
    Swal.fire({
      title: "Confirmez votre choix!",
      text: "Vous acceptez toutes les modifications ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Accepter"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Accepté!",
          text: "Modification acceptées",
          icon: "success"
        });
      }
    });  }

  getModifiedLabels(): string[] {
    return this.modifiedFields.map(field => field.label);
  }

  updateDemandeEtat(id: string, etat: string): Promise<void> {
    const demandeRef = this.firestore.collection('DemandeModificationAssociation').doc(id);
    return demandeRef.update({ etat: etat });
  } 

}
