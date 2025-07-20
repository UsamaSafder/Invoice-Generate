import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Api {
  constructor(private http: HttpClient) {}

  // ✅ POST: Create new invoice
  PostComments(data: any) {
    const url = "https://hmftj.com/interns/UApi/createInvoice.php";
    return this.http.post(url, data);
  }

  // ✅ POST: Fetch invoice by CId
GetComments(CId: number) {
  const url = `https://hmftj.com/interns/UApi/downloadInvoice.php?CId=${CId}`;
  return this.http.get(url);
}

}
