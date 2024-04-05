import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements OnInit {

  protected queryFormGroup!: FormGroup;
  result: any;
  messages = [{
    role: "system",
    content: "You are a helpful assistant"
  }];

  constructor(private fb: FormBuilder, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.queryFormGroup = this.fb.group({
      query: this.fb.control("")
    });
  }


askGpt(){
  let url ="https://api.openai.com/v1/chat/completions";
  let httpHeaders=new HttpHeaders().set("Authorization","Bearer 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");
  
  // Réinitialiser la liste de messages
  this.messages = [{
    role: "system",
    content: "You are a helpful assistant"
  }];

  
  this.messages.push({
    role:"user",content:this.queryFormGroup.value.query
  })
  
  let payload={
    model :"gpt-3.5-turbo",
    messages : this.messages
  };
  this.httpClient.post(url,payload,{headers:httpHeaders})
  .subscribe({
    next:(response)=>{
      this.result=response;
      this.result.choices.forEach((choice:any)=>{  this.messages.push({
        role:"assistant", content:choice.message.content
      })})}})
    
    
    }
    
    
    
    }

  