import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CollecteService } from '../shared/collecte.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Collecte } from '../collecte';
import { AssociationService } from '../shared/associationService.service';

@Component({
  selector: 'app-modifier-collecte',
  templateUrl: './modifier-collecte.component.html',
  styleUrls: ['./modifier-collecte.component.css']
})
export class ModifierCollecteComponent {
  @Input() collecte!:Collecte;
  collecteForm!: FormGroup;

  constructor(public service:CollecteService,private formBuilder: FormBuilder,public serviceAssociation:AssociationService){}
  
  ngOnInit(): void {
    this.collecteForm = this.formBuilder.group({
      nom: [this.collecte.nom],
      description: [this.collecte.description],
      image: [this.collecte.image],
      montant: [this.collecte.montant],
      date_debut: [this.collecte.date_debut instanceof Date ? this.collecte.date_debut.toISOString().split('T')[0] : this.collecte.date_debut],
      date_fin: [this.collecte.date_fin instanceof Date ? this.collecte.date_fin.toISOString().split('T')[0] : this.collecte.date_fin]
    });
  }
  
 

  async modifierCollecte(): Promise<void> {
    if (this.collecteForm.valid) {
      let collecteDataToUpdate: Collecte = {
        id: this.collecte.id, // Assurez-vous de récupérer l'ID de la collecte
        ...this.collecteForm.value // Utilisez les valeurs du formulaire
      };
      const logoFile = this.collecteForm.value.image;
      const logoDownloadUrl = await this.service.uploadLogo(logoFile);
      if(logoDownloadUrl){collecteDataToUpdate.image = logoDownloadUrl;
      this.service.modifierCollecte({...collecteDataToUpdate,image:logoDownloadUrl})
     

        .then(() => window.location.reload()) // Rechargez la page après la modification
        .catch(error => console.error('Erreur lors de la modification de la collecte :', error));
    } else {
      console.error('Formulaire invalide. Veuillez corriger les erreurs.');
    }
  }}


}