import { Component } from '@angular/core';
import { faCircleExclamation, faList, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Actualite } from '../../../interfaces/actualite';
import { ActualiteService } from '../../../services/actualite.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-actualite-list-association',
  templateUrl: './actualite-list-association.component.html',
  styleUrls: ['./actualite-list-association.component.css']
})
export class ActualiteListAssociationComponent {

  faTrash = faTrash;
  faList = faList;
  faPenToSquare = faPenToSquare;
  faCircleExclamation=faCircleExclamation;

  filteredActualiteList: Actualite[] = [];
  searchTerm: string = '';
  selectedActualite: Actualite = {} as Actualite;

  constructor(public service: ActualiteService, private router: Router, private firestore: AngularFirestore) {
   
  }


  actualites:Actualite[]=[];
   
  getActualitesByAssociationId(){
    const associationId=this.service.getAssociationIdFromUrl();
    console.log(associationId);

    this.service.getActualitesByAssociationId(associationId).subscribe((res)=>{
      this.actualites=res;
      this.filteredActualiteList=this.actualites;
      console.log(this.actualites);
    })
  }
  ngOnInit(): void {
    this.getActualitesByAssociationId();
  }

  supprimerActualite(actualite: Actualite) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous ne pourrez pas annuler cela !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le !'
    }).then((result) => {
      if (result.isConfirmed) {
        if (actualite.id) { // Vérifie si l'identifiant de la collecte est défini
          this.updateCollecteEtat(actualite.id, 'en_attente_de_suppression') // Met à jour l'état de la collecte
            .then(() => {
              this.service.supprimerActualite(actualite).subscribe(() => {
                this.getActualitesByAssociationId(); // Rafraîchit la liste après la suppression
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
              }, (error) => {
                console.error('Error while deleting collecte:', error);
                Swal.fire('Error!', 'An error occurred while deleting the collecte.', 'error');
              });
            })
            .catch((error) => {
              console.error('Error updating collecte state:', error);
              Swal.fire('Error!', 'An error occurred while updating the collecte state.', 'error');
            });
        } else {
          console.error('Collecte ID is undefined.');
          Swal.fire('Error!', 'The collecte ID is undefined.', 'error');
        }
      }
    });
  }

  afficherDetails(actualite: Actualite) {
    if(actualite.id){
    this.service.getActualiteById(actualite.id).subscribe((response) => {
      this.selectedActualite = response!;
      this.service.actualiteDetailShowModal = true;
      console.log(response)
    });
  }
}

  modifierActualite(actualite: Actualite) {
    if(actualite.id){
    this.service.getActualiteById(actualite.id).subscribe((response) => {
      this.selectedActualite = response!;
      this.service.actualiteModifierShowModal = true;
    });
  }

 }

 chercherActualite(searchTerm: string) {
  // Filter the todoList based on the searchTerm
  this.filteredActualiteList = this.actualites.filter((actualite) =>
    actualite.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

updateCollecteEtat(id: string, etat: string): Promise<void> {
  const demandeRef = this.firestore.collection('Actualite').doc(id);
  return demandeRef.update({ etat: etat });
}

}

