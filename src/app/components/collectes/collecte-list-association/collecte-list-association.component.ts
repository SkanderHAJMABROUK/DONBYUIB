import { Component, OnInit } from '@angular/core';
import {
  faList,
  faPenToSquare,
  faTrash,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { Collecte } from '../../../interfaces/collecte';
import { CollecteService } from '../../../services/collecte.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-collecte-list-association',
  templateUrl: './collecte-list-association.component.html',
  styleUrls: ['./collecte-list-association.component.css'],
})
export class CollecteListAssociationComponent implements OnInit {
  faTrash = faTrash;
  faList = faList;
  faPenToSquare = faPenToSquare;
  faCircleExclamation = faCircleExclamation;

  filteredCollecteList: Collecte[] = [];
  searchTerm: string = '';
  selectedCollecte: Collecte = {} as Collecte;

  constructor(
    public service: CollecteService,
    private router: Router,
    private firestore: AngularFirestore,
  ) {}

  collectes: Collecte[] = [];

  getCollectesByAssociationId() {
    const associationId = this.service.getAssociationIdFromUrl();
    console.log(associationId);

    this.service.getCollectesByAssociationId(associationId).subscribe((res) => {
      this.collectes = res;
      this.filteredCollecteList = [...this.collectes];
      console.log(this.collectes);
    });
  }

  ngOnInit(): void {
    this.getCollectesByAssociationId();
  }

  afficherDetails(collecte: Collecte) {
    if (collecte.id) {
      this.service.getCollecteById(collecte.id).subscribe((response) => {
        this.selectedCollecte = response!;
        this.service.collecteDetailShowModal = true;
        console.log(response);
      });
    }
  }

  modifierCollecte(collecte: Collecte) {
    if (collecte.id) {
      this.service.getCollecteById(collecte.id).subscribe((response) => {
        this.selectedCollecte = response!;
        this.service.collecteModifierShowModal = true;
      });
    }
  }
  chercherCollecte(searchTerm: string) {
    this.filteredCollecteList = this.collectes.filter((collecte) =>
      collecte.nom.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  supprimerCollecte(collecte: Collecte) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous ne pourrez pas annuler cela !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le !',
    }).then((result) => {
      if (result.isConfirmed) {
        if (collecte.id) {
          // Vérifie si l'identifiant de la collecte est défini
          this.updateCollecteEtat(collecte.id, 'en_attente_de_suppression') // Met à jour l'état de la collecte
            .then(() => {
              this.service.supprimerCollecte(collecte).subscribe(
                () => {
                  this.getCollectesByAssociationId(); 
                  this.service.collecteModifierShowModal = false// Rafraîchit la liste après la suppression
                  Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success',
                  );
                },
                (error) => {
                  console.error('Error while deleting collecte:', error);
                  Swal.fire(
                    'Error!',
                    'An error occurred while deleting the collecte.',
                    'error',
                  );
                },
              );
            })
            .catch((error) => {
              console.error('Error updating collecte state:', error);
              Swal.fire(
                'Error!',
                'An error occurred while updating the collecte state.',
                'error',
              );
            });
        } else {
          console.error('Collecte ID is undefined.');
          Swal.fire('Error!', 'The collecte ID is undefined.', 'error');
        }
      }
    });
  }

  updateCollecteEtat(id: string, etat: string): Promise<void> {
    const demandeRef = this.firestore.collection('Collecte').doc(id);
    return demandeRef.update({ etat: etat });
  }
}
