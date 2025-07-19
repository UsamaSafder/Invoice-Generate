import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Api {

  constructor(private http:HttpClient){

  }
  
  PostComments(data:any){
    const url="https://hmftj.com/interns/UApi/createInvoice.php";
    this.http.post('url',data);

  }

}
