import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { Invoice } from './types';
import { formatPrice, getInvoicePaymentTypeLabel, getInvoiceTotal } from './utils';
import { getIntl } from '../language/config/translation';

// Interface pour les données de l'entreprise
interface CompanyData {
  name: string;
  address: string;
  phone: string;
  email: string;
  siret?: string;
  tva?: string;
}

// Fonction pour générer et ouvrir le PDF de la facture
export const generateInvoicePDF = async (
  invoice: Invoice,
  companyData: CompanyData,
  intl: any
): Promise<void> => {
  // Créer un élément temporaire pour le rendu HTML
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.top = '-9999px';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '210mm'; // Format A4
  tempDiv.style.minHeight = '297mm';
  tempDiv.style.padding = '20mm';
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  tempDiv.style.fontSize = '12px';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.color = 'black';

  document.body.appendChild(tempDiv);

  // Calculer les totaux
  const totalHT = getInvoiceTotal(invoice);
  const tvaRate = 0.2; // 20% TVA
  const tvaAmount = totalHT * tvaRate;
  const totalTTC = totalHT + tvaAmount;

  // Formater les dates
  const locale = localStorage.getItem('language') || 'fr';
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateLong = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Contenu HTML du PDF
  tempDiv.innerHTML = `
    <div style="
      font-family: Arial, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #000;
      max-width: 170mm;
      margin: 0 auto;
    ">
      <!-- En-tête -->
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 40px;
        border-bottom: 2px solid #e0e0e0;
        padding-bottom: 20px;
      ">
        <div style="flex: 1;">
          <div style="
            font-size: 24px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 10px;
          ">
            ${companyData.name}
          </div>
        </div>
        <div style="
          font-size: 36px;
          font-weight: bold;
          color: #000;
          text-align: right;
        ">
          FACTURE
        </div>
      </div>

      <!-- Informations facture et dates -->
      <div style="
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        font-size: 11px;
      ">
        <div>
          <strong>DATE :</strong> ${formatDate(invoice.issue_date)}<br>
          <strong>ÉCHÉANCE :</strong> ${formatDate(invoice.payment_due_date)}
        </div>
        <div style="text-align: right;">
          <strong>FACTURE N° :</strong> ${invoice.invoice_number}
        </div>
      </div>

      <!-- Émetteur et Destinataire -->
      <div style="
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
      ">
        <div style="flex: 1; margin-right: 20px;">
          <div style="
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 11px;
          ">ÉMETTEUR :</div>
          <div style="font-size: 10px; line-height: 1.6;">
            <strong>${companyData.name}</strong><br>
            ${companyData.phone}<br>
            ${companyData.email}<br>
            ${companyData.address}
          </div>
        </div>
        <div style="flex: 1; text-align: right;">
          <div style="
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 11px;
          ">DESTINATAIRE :</div>
          <div style="font-size: 10px; line-height: 1.6;">
            <strong>${invoice.project?.client?.name || 'Client'}</strong><br>
            ${invoice.project?.client?.email || ''}<br>
            ${invoice.project?.client?.address || ''}<br>
            ${invoice.project?.client?.city || ''}
          </div>
        </div>
      </div>

      <!-- Tableau des prestations -->
      <table style="
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
        font-size: 10px;
      ">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              font-weight: bold;
            ">Description :</th>
            <th style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: right;
              font-weight: bold;
              width: 80px;
            ">Prix Unitaire :</th>
            <th style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              font-weight: bold;
              width: 60px;
            ">Quantité :</th>
            <th style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: right;
              font-weight: bold;
              width: 80px;
            ">Total :</th>
          </tr>
        </thead>
        <tbody>
          ${
            invoice.invoice_lines
              ?.map(
                (line) => `
            <tr>
              <td style="
                border: 1px solid #ddd;
                padding: 8px;
                vertical-align: top;
              ">${line.description}</td>
              <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: right;
              ">${formatPrice(line.unit_price)}</td>
              <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
              ">${line.quantity}</td>
              <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: right;
                font-weight: bold;
              ">${formatPrice(line.unit_price * line.quantity)}</td>
            </tr>
          `
              )
              .join('') || ''
          }
          <!-- Lignes vides pour le design -->
          <tr>
            <td style="border: 1px solid #ddd; padding: 15px;">&nbsp;</td>
            <td style="border: 1px solid #ddd; padding: 15px;">&nbsp;</td>
            <td style="border: 1px solid #ddd; padding: 15px;">&nbsp;</td>
            <td style="border: 1px solid #ddd; padding: 15px;">&nbsp;</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 15px;">&nbsp;</td>
            <td style="border: 1px solid #ddd; padding: 15px;">&nbsp;</td>
            <td style="border: 1px solid #ddd; padding: 15px;">&nbsp;</td>
            <td style="border: 1px solid #ddd; padding: 15px;">&nbsp;</td>
          </tr>
        </tbody>
      </table>

      <!-- Totaux -->
      <div style="
        display: flex;
        justify-content: flex-end;
        margin-bottom: 40px;
      ">
        <div style="width: 200px;">
          <div style="
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 11px;
          ">
            <strong>TOTAL HT :</strong>
            <strong>${formatPrice(totalHT)}</strong>
          </div>
          <div style="
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 11px;
          ">
            <strong>TVA 20% :</strong>
            <strong>${formatPrice(tvaAmount)}</strong>
          </div>
          <div style="
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 11px;
          ">
            <strong>REMISE :</strong>
            <strong>-</strong>
          </div>
          <div style="
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 12px;
            font-weight: bold;
            border-top: 2px solid #000;
            margin-top: 5px;
          ">
            <strong>TOTAL TTC :</strong>
            <strong>${formatPrice(totalTTC)}</strong>
          </div>
        </div>
      </div>

      <!-- Informations de règlement -->
      <div style="
        margin-bottom: 30px;
        padding: 15px;
        background-color: #f9f9f9;
        border-left: 4px solid #1976d2;
      ">
        <div style="
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 11px;
        ">RÈGLEMENT :</div>
        <div style="font-size: 10px; line-height: 1.6;">
          <strong>${getIntl(locale).formatMessage({
            id: getInvoicePaymentTypeLabel(invoice.payment_type),
          })}</strong>
        </div>
      </div>


      ${
        invoice.footer_note
          ? `
        <!-- Note de bas de page -->
        <div style="
          margin-top: 30px;
          padding: 15px;
          background-color: #f0f8ff;
          border-radius: 5px;
          border: 1px solid #e0e0e0;
        ">
          <div style="
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 11px;
            color: #1976d2;
          ">NOTE :</div>
          <div style="font-size: 10px; line-height: 1.5;">
            ${invoice.footer_note}
          </div>
        </div>
      `
          : ''
      }
    </div>
  `;

  try {
    // Conversion HTML vers Canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: tempDiv.offsetWidth,
      height: tempDiv.offsetHeight,
    });

    // Suppression de l'élément temporaire
    document.body.removeChild(tempDiv);

    // Création du PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');

    const imgWidth = 210; // Largeur A4 en mm
    const pageHeight = 295; // Hauteur A4 en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Ajouter la première page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Ajouter des pages supplémentaires si nécessaire
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Ouvrir le PDF dans un nouvel onglet
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');

    // Nettoyer l'URL après utilisation
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 1000);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};

// Composant React pour le preview HTML (optionnel)
interface InvoicePDFPreviewProps {
  invoice: Invoice;
  companyData: CompanyData;
}

export const InvoicePDFPreview: React.FC<InvoicePDFPreviewProps> = ({ invoice, companyData }) => {
  const totalHT = getInvoiceTotal(invoice);
  const tvaRate = 0.2;
  const tvaAmount = totalHT * tvaRate;
  const totalTTC = totalHT + tvaAmount;

  const locale = localStorage.getItem('language') || 'fr';
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: 1.4,
        color: '#000',
        maxWidth: '170mm',
        margin: '0 auto',
        padding: '20mm',
        backgroundColor: 'white',
      }}
    >
      {/* Contenu identique à celui généré dans la fonction generateInvoicePDF */}
      {/* ... */}
    </div>
  );
};
