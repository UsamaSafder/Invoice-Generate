import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Api } from '../service/api';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor,RouterLink],
  templateUrl: './input.html',
  styleUrls: ['./input.css'],
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

  existingCIds: number[] = [1001, 1002, 1003];

  errorMessage: string = '';
  successMessage: string = '';

  
  constructor(private api: Api, private router: Router) {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];
  }

  
  addItem() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.item.description.trim() === '' || this.item.quantity <= 0 || this.item.price <= 0) {
      this.errorMessage = 'Please enter valid item details: description, quantity > 0, price > 0.';
      return;
    }

    const total = this.item.quantity * this.item.price;
    this.items.push({ ...this.item, total });
    this.calculateTotals();

    this.item = { description: '', quantity: 0, price: 0 };
  }

  calculateTotals() {
    this.subtotal = this.items.reduce((sum, i) => sum + i.total, 0);
    this.tax = this.subtotal * 0.15;
    this.total = this.subtotal + this.tax;
  }

  checkCIdUnique(id: number | null) {
    this.CIdExists = id !== null && this.existingCIds.includes(id);
  }

  AddDetails(form: NgForm) {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid || this.items.length === 0 || this.CIdExists || !this.CId) {
      this.errorMessage = 'Please fill all fields correctly and add at least one invoice item.';
      return;
    }

    const due = new Date(this.dueDate);
    const today = new Date(this.todayDate);
    if (due < today) {
      this.errorMessage = 'Due date cannot be before today.';
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
      payment: this.payment
    };

    this.api.PostComments(data).subscribe({
      next: () => {
        this.successMessage = 'Invoice Submitted!';
        this.items = [];
        this.item = { description: '', quantity: 0, price: 0 };
        form.resetForm();
        this.dueDate = '';
        this.payment = { method: '', account_number: '', bank: '' };
        this.CId = null;
        this.CIdExists = false;
      },
      error: (err) => {
        console.error('Submission Error:', err);
        this.errorMessage = 'Failed to submit invoice. Please try again.';
      }
    });
  }
}
