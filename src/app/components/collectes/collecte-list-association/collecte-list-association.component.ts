import { Component, OnInit } from '@angular/core';
import { faList, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Collecte } from '../../../interfaces/collecte';
import { CollecteService } from '../../../services/collecte.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collecte-list-association',
  templateUrl: './collecte-list-association.component.html',
  styleUrls: ['./collecte-list-association.component.css']
})
export class CollecteListAssociationComponent implements OnInit{
  faTrash = faTrash;
  faList = faList;
  faPenToSquare = faPenToSquare;

  filteredCollecteList: Collecte[] = [];
  searchTerm: string = '';
  selectedCollecte: Collecte = {} as Collecte;

  constructor(public service: CollecteService, private router: Router) {
   
  }


  collectes:Collecte[]=[];
   
  getCollectesByAssociationId(){
    const associationId=this.service.getAssociationIdFromUrl();
    console.log(associationId);

    this.service.getCollectesByAssociationId(associationId).subscribe((res)=>{
      this.collectes=res;
      this.filteredCollecteList = [...this.collectes];
      console.log(this.collectes);
    })
  }
  ngOnInit(): void {
    this.getCollectesByAssociationId();

    
  }

  // supprimerCollecte(collecte: Collecte) {
  //  this.service.deleteTodo(todo).subscribe((response) => {
  // //     this.todoList = response;
  // //     this.filteredTodoList = this.todoList; // Update filteredTodoList after deleting a todo
  // //   });
  // // }

  afficherDetails(collecte: Collecte) {
    if(collecte.id){
    this.service.getCollecteById(collecte.id).subscribe((response) => {
      this.selectedCollecte = response!;
      this.service.collecteDetailShowModal = true;
      console.log(response)
    });
  }
}

  modifierCollecte(collecte: Collecte) {
    if(collecte.id){
    this.service.getCollecteById(collecte.id).subscribe((response) => {
      this.selectedCollecte = response!;
      this.service.collecteModifierShowModal = true;
    });
  }

}
chercherCollecte(searchTerm: string) {
  this.filteredCollecteList = this.collectes.filter((collecte) =>
    collecte.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

supprimerCollecte(collecte: Collecte) {
  this.service.supprimerCollecte(collecte).subscribe((response) => {
     this.collectes = response;
     this.filteredCollecteList = this.collectes; 
   });
 }

}
