import { Component } from '@angular/core';
import { faList, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Actualite } from '../actualite';
import { ActualiteService } from '../shared/actualite.service';
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
   
  getCollectesByAssociationId(){
    const associationId=this.service.getAssociationIdFromUrl();
    console.log(associationId);

    this.service.getActualitesByAssociationId(associationId).subscribe((res)=>{
      this.actualites=res;
      console.log(this.actualites)
    })
  }
  ngOnInit(): void {
    this.getCollectesByAssociationId();}

  // supprimerCollecte(collecte: Collecte) {
  //  this.service.deleteTodo(todo).subscribe((response) => {
  // //     this.todoList = response;
  // //     this.filteredTodoList = this.todoList; // Update filteredTodoList after deleting a todo
  // //   });
  // // }

//   afficherDetails(collecte: Collecte) {
//     if(collecte.id){
//     this.service.getCollecteById(collecte.id).subscribe((response) => {
//       this.selectedCollecte = response!;
//       this.service.collecteDetailShowModal = true;
//       console.log(response)
//     });
//   }
// }

//   modifierCollecte(collecte: Collecte) {
//     if(collecte.id){
//     this.service.getCollecteById(collecte.id).subscribe((response) => {
//       this.selectedCollecte = response!;
//       this.service.collecteModifierShowModal = true;
//     });
//   }

// }
  // searchTodo() {
  //   // Filter the todoList based on the searchTerm
  //   this.filteredTodoList = this.todoList.filter((todo) =>
  //     todo.title.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }
}

