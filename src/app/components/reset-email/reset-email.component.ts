import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import { NgxSpinnerService } from 'ngx-spinner';
import { Association } from 'src/app/interfaces/association';
import { Donateur } from 'src/app/interfaces/donateur';
import { AssociationService } from 'src/app/services/association.service';
import { DonateurService } from 'src/app/services/donateur.service';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-reset-email',
  templateUrl: './reset-email.component.html',
  styleUrls: ['./reset-email.component.css']
})
export class ResetEmailComponent {

  aFormGroup!: FormGroup;
  showErrorNotification: boolean = false;
  isFormModified: boolean = false;
  association!:Association;
  donateur!:Donateur;
  id!:string;
  codeOtp!: string;

  constructor(private formBuilder: FormBuilder, 
    public associationService: AssociationService,
    public donateurService : DonateurService,
    private router: Router, 
    private route:ActivatedRoute, 
    private spinner:NgxSpinnerService) { }

  ngOnInit():void{
    this.aFormGroup = this.formBuilder.group({
      confirm_email: ['', [Validators.required, Validators.email]]
    });
    this.route.params.subscribe(params =>  {
      this.id = params['id'];
      this.associationService.getAssociationById(this.id).subscribe(association =>{
        if(association){
          this.association=association;
          console.log('Association',this.id);
        } else {
          this.donateurService.getDonateurById(this.id).subscribe(donateur =>{
            if(donateur){
              this.donateur=donateur;
              console.log('Donateur',this.id);
            }else {
              console.error('No object found with this ID:', this.id);
            }
          })
        }
      })
    })

    this.aFormGroup.valueChanges.subscribe(() => {
      this.isFormModified = !this.aFormGroup.pristine;
    });
  }


  onSubmit() { 

  }

  async sendVerificationEmail() {

    this.codeOtp = this.associationService.genererCodeOTP().toString();
  
    emailjs.init('_Y9fCqzL5ZcxWYmmg');

    emailjs.send('service_hc9gqua', 'template_c1bhstr', {
      from_name: "DonByUIB",
      to_name: this.aFormGroup.value.nom,
      code_otp: this.codeOtp,
      to_email: this.aFormGroup.value.email
    });

  }

}
