import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Api } from '../service/api';
import { RouterLink, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf, NgFor],
  templateUrl: './input.html',
  styleUrl: './input.css'
})
export class Input {
  item = { description: '', quantity: 0, price: 0 };
  items: any[] = [];
  subtotal = 0;
  tax = 0;
  total = 0;
  dueDate = '';

  payment = {
    method: '',
    account_number: '',
    bank: ''
  };

  constructor(private api: Api, private router: Router) {}

  addItem() {
    const total = this.item.quantity * this.item.price;
    this.items.push({ ...this.item, total });
    this.calculateTotals();
    this.item = { description: '', quantity: 0, price: 0 };
  }

  calculateTotals() {
    this.subtotal = this.items.reduce((sum, i) => sum + i.total, 0);
    this.tax = this.subtotal * 0.15; // Match backend 15% tax
    this.total = this.subtotal + this.tax;
  }

  AddDetails(form: NgForm) {
    if (form.invalid || this.items.length === 0) {
      console.log("Invalid form or no items.");
      return;
    }

    const data = {
      customer: {
        CId: form.value.CId,
        name: form.value.Name,
        phone: form.value.PhoneNumber,
        company: form.value.CName,
        address: form.value.Address,
        email: form.value.Email
      },
      items: this.items,
      payment: {
        method: this.payment.method,
        account_number: this.payment.account_number,
        bank: this.payment.bank
      }
    };

    this.api.PostComments(data).subscribe({
      next: (res) => {
        console.log("Response:", res);
        alert("Invoice Submitted!");
        this.items = [];
        form.resetForm();
      },
      error: (err) => console.error("Error:", err)
    });
  }
}
