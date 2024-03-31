import { Injectable } from '@angular/core';
// import OpenAIApi  from 'openai';
// import{Configuration} from 'openai';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // private openai!: OpenAIApi;
  // configuration = new Configuration({
  //   apiKey: "Your API KEY", //generate key https://platform.openai.com/
  // });

  // constructor() {    
  //    this.openai = new OpenAIApi(this.configuration);
  // }

  // generateText(prompt: string):Promise<string | undefined>{
  //   return this.openai.createCompletion({
  //        model: "text-davinci-003",
  //        prompt: prompt,
  //        max_tokens: 256
  //      }).then(response => {
  //        return response.data.choices[0].text;
  //      }).catch(error=>{
  //        return '';
  //      });
  //  }
}
