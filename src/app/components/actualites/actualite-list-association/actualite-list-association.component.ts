import { Component } from '@angular/core';
import { faList, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Actualite } from '../../../interfaces/actualite';
import { ActualiteService } from '../../../services/actualite.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actualite-list-association',
  templateUrl: './actualite-list-association.component.html',
  styleUrls: ['./actualite-list-association.component.css']
})
export class ActualiteListAssociationComponent {

  faTrash = faTrash;
  faList = faList;
  faPenToSquare = faPenToSquare;

  filteredActualiteList: Actualite[] = [];
  searchTerm: string = '';
  selectedActualite: Actualite = {} as Actualite;

  constructor(public service: ActualiteService, private router: Router) {
   
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

  // supprimerCollecte(collecte: Collecte) {
  //  this.service.deleteTodo(todo).subscribe((response) => {
  // //     this.todoList = response;
  // //     this.filteredTodoList = this.todoList; // Update filteredTodoList after deleting a todo
  // //   });
  // // }

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
}

