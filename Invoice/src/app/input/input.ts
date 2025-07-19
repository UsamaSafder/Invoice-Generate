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
  styleUrls: ['./input.css'],  // fixed typo from 'styleUrl' to 'styleUrls'
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

  CId: number | null = null;
  CIdExists = false;

  todayDate: string;

  // Example existing IDs - replace with your real data or API call
  existingCIds: number[] = [1001, 1002, 1003];

  constructor(private api: Api, private router: Router) {
    // Set today's date string in yyyy-MM-dd format
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];
  }

  addItem() {
    if (this.item.quantity > 0 && this.item.price > 0 && this.item.description.trim() !== '') {
      const total = this.item.quantity * this.item.price;
      this.items.push({ ...this.item, total });
      this.calculateTotals();
      this.item = { description: '', quantity: 0, price: 0 };
    } else {
      alert("Please fill in item description, quantity and price correctly.");
    }
  }

  calculateTotals() {
    this.subtotal = this.items.reduce((sum, i) => sum + i.total, 0);
    this.tax = this.subtotal * 0.15; // 15% tax
    this.total = this.subtotal + this.tax;
  }

  // Check if CId is unique on blur or change
  checkCIdUnique(id: number | null) {
    if (id === null) {
      this.CIdExists = false;
      return;
    }
    this.CIdExists = this.existingCIds.includes(id);
  }

  AddDetails(form: NgForm) {
    if (form.invalid || this.items.length === 0 || this.CIdExists || !this.CId) {
      alert("Please fill all fields correctly and add at least one invoice item.");
      return;
    }

    // Extra due date validation: ensure dueDate not in past (redundant if min attribute is used)
    const due = new Date(this.dueDate);
    const today = new Date(this.todayDate);
    if (due < today) {
      alert("Due date cannot be before today.");
      return;
    }

    const data = {
      customer: {
        CId: this.CId,
        name: form.value.Name,
        phone: form.value.PhoneNumber,
        company: form.value.CName,
        address: form.value.Address,
        email: form.value.Email
      },
      items: this.items,
      dueDate: this.dueDate,
      payment: {
        method: this.payment.method,
        account_number: this.payment.account_number,
        bank: this.payment.bank
      }
    };

    this.api.PostComments(data).subscribe({
      next: (res) => {
        alert("Invoice Submitted!");
        this.items = [];
        form.resetForm();
        this.dueDate = '';
        this.payment = { method: '', account_number: '', bank: '' };
        this.CId = null;
        this.CIdExists = false;
      },
      error: (err) => {
        console.error("Error:", err);
        alert("Failed to submit invoice. Please try again.");
      }
    });
  }
}
