import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AssociationService } from '../shared/associationService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public service: AssociationService, private router: Router) {}

  protected verificationForm!: FormGroup;

  ngOnInit(): void {
    this.verificationForm = this.formBuilder.group({
      codeOTP: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  checkEmail() {
    const enteredCode = this.verificationForm.get('codeOTP')?.value;
    const storedCode = localStorage.getItem('code');
    console.log(enteredCode);
    console.log(storedCode);

    if (enteredCode === storedCode) {
      // Code matches, proceed with whatever action you need
      console.log('Code matched!');
      // Redirect to another page or perform any desired action
      this.router.navigate(['/']); // Change '/some-page' to your desired route
    } else {
      // Code does not match, handle this case accordingly
      console.log('Code did not match!');
      // You may want to display an error message or take some other action here
    }
  }
}
