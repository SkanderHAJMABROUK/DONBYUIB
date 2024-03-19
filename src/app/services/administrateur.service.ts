import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdministrateurService {

  compte: boolean = true;

  crudUtilisateurs:boolean = false;

  constructor() { }
}
