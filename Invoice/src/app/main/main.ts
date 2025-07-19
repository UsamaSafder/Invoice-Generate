import { Component } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import * as domtoimage from 'dom-to-image';


import jsPDF from 'jspdf';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {



downloadPDF() {
  const element = document.getElementById('invoice');
  if (!element) return;

  // Scroll to top to avoid rendering issues
  window.scrollTo(0, 0);

  // Force full width and remove all gaps
  domtoimage.toPng(element, {
    bgcolor: 'white', // set background to match your theme
    style: {
      'margin': '0',
      'padding': '0',
      'width': '1200px',
      'height': '700',
      'transform': 'scale(1)', // ensure no accidental scaling
    }
  }).then((dataUrl: string) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(dataUrl);

    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('invoice.pdf');
  }).catch((err: any) => {
    console.error('PDF generation failed:', err);
  });
}


}
