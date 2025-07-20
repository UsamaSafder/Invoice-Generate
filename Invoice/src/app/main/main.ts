import { Component } from '@angular/core';
import { Api } from '../service/api';
import * as domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  templateUrl: './main.html',
  styleUrls: ['./main.css']
})
export class Main {
  CId: number = 0;

  customer: any = null;
  company: any = null;
  invoices: any[] = [];
  errorMessage: string = '';
  dataFetched: boolean = false;

  constructor(private api: Api) {}

  fetchInvoiceData() {
    this.errorMessage = '';
    this.dataFetched = false;

    if (!this.CId || this.CId <= 0) {
      this.errorMessage = "Please enter a valid Customer ID.";
      this.clearData();
      return;
    }

    this.api.GetComments(this.CId).subscribe(
      (response: any) => {
        if (response?.error) {
          this.errorMessage = response.error;
          this.clearData();
        } else {
          this.customer = response.customer;
          this.company = response.company;
          this.invoices = response.invoices;
          console.log("Customer Info:", this.customer);
          console.log("Company Info:", this.company);
          console.log("Invoices:", this.invoices);
        }
        this.dataFetched = true;
      },
      (error: any) => {
        console.error("Error fetching invoice data:", error);
        this.errorMessage = "Failed to fetch invoice.";
        this.clearData();
        this.dataFetched = true;
      }
    );
  }

  clearData() {
    this.customer = null;
    this.company = null;
    this.invoices = [];
  }
downloadPDF() {
  const invoiceElement = document.getElementById('invoice');
  if (!invoiceElement) return;

  // Scroll to top to avoid hidden content issues
  window.scrollTo(0, 0);

  // Clone node to avoid modifying the visible layout
  const clone = invoiceElement.cloneNode(true) as HTMLElement;
  clone.style.transform = 'scale(1)';
  clone.style.transformOrigin = 'top left';
  clone.style.position = 'fixed';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.zIndex = '-1'; // hide from view
  document.body.appendChild(clone);

  setTimeout(() => {
    domtoimage.toPng(clone, {
      bgcolor: 'white',
      quality: 1,
      width: clone.offsetWidth,
      height: clone.offsetHeight
    }).then((dataUrl: string) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);

      const pxWidth = imgProps.width;
      const pxHeight = imgProps.height;

      const mmWidth = (pxWidth * 25.4) / 96;
      const mmHeight = (pxHeight * 25.4) / 96;

      const pageWidth = 210;
      const pageHeight = 297;

      let scaledWidth = mmWidth;
      let scaledHeight = mmHeight;

      const widthScale = pageWidth / scaledWidth;
      const heightScale = pageHeight / scaledHeight;
      const scale = Math.min(widthScale, heightScale);

      scaledWidth *= scale;
      scaledHeight *= scale;

      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;

      pdf.addImage(dataUrl, 'PNG', x, y, scaledWidth, scaledHeight);
      pdf.save('invoice.pdf');

      // Clean up
      document.body.removeChild(clone);
    }).catch((err: any) => {
      console.error('PDF generation failed:', err);
      this.errorMessage = 'PDF generation failed. Try again.';
      document.body.removeChild(clone);
    });
  }, 300);
}




}
