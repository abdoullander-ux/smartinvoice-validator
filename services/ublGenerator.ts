import { InvoiceData } from "../types";

// Fonction utilitaire pour échapper les caractères spéciaux XML
const escapeXML = (str: string | null | undefined): string => {
  if (!str) return '';
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

// Formater la date YYYY-MM-DD (format UBL standard)
const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  return dateStr;
};

export const generateUBLXML = (data: InvoiceData): string => {
  const currencyID = data.currency || 'EUR';
  const invoiceID = escapeXML(data.invoiceNumber || 'UNKNOWN');
  const issueDate = formatDate(data.invoiceDate);
  const typeCode = data.invoiceType === 'CREDIT_NOTE' ? '381' : '380';

  // Calculs par défaut si manquants pour assurer un XML valide
  const totalNet = data.totalNet || 0;
  const totalTax = data.totalTax || 0;
  const totalAmount = data.totalAmount || (totalNet + totalTax);

  // Construction du XML UBL 2.1
  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
    <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
    <cbc:CustomizationID>urn:cen.eu:en16931:2017</cbc:CustomizationID>
    <cbc:ID>${invoiceID}</cbc:ID>
    <cbc:IssueDate>${issueDate}</cbc:IssueDate>
    <cbc:InvoiceTypeCode>${typeCode}</cbc:InvoiceTypeCode>
    <cbc:DocumentCurrencyCode>${escapeXML(currencyID)}</cbc:DocumentCurrencyCode>
    
    ${data.orderNumber ? `<cac:OrderReference><cbc:ID>${escapeXML(data.orderNumber)}</cbc:ID></cac:OrderReference>` : ''}
    
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyName>
                <cbc:Name>${escapeXML(data.supplierName)}</cbc:Name>
            </cac:PartyName>
            <cac:PostalAddress>
                <cbc:StreetName>${escapeXML(data.supplierAddress)}</cbc:StreetName>
                <cac:Country>
                    <cbc:IdentificationCode>FR</cbc:IdentificationCode>
                </cac:Country>
            </cac:PostalAddress>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>${escapeXML(data.supplierVatId)}</cbc:CompanyID>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>
        </cac:Party>
    </cac:AccountingSupplierParty>
    
    <cac:AccountingCustomerParty>
        <cac:Party>
            <cac:PartyName>
                <cbc:Name>${escapeXML(data.customerName)}</cbc:Name>
            </cac:PartyName>
            <cac:PostalAddress>
                <cbc:StreetName>${escapeXML(data.customerAddress)}</cbc:StreetName>
                <cac:Country>
                    <cbc:IdentificationCode>FR</cbc:IdentificationCode>
                </cac:Country>
            </cac:PostalAddress>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>${escapeXML(data.customerVatId)}</cbc:CompanyID>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>
        </cac:Party>
    </cac:AccountingCustomerParty>
    
    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="${escapeXML(currencyID)}">${totalTax.toFixed(2)}</cbc:TaxAmount>
        <cac:TaxSubtotal>
            <cbc:TaxableAmount currencyID="${escapeXML(currencyID)}">${totalNet.toFixed(2)}</cbc:TaxableAmount>
            <cbc:TaxAmount currencyID="${escapeXML(currencyID)}">${totalTax.toFixed(2)}</cbc:TaxAmount>
            <cac:TaxCategory>
                <cbc:ID>S</cbc:ID>
                <cbc:Percent>${totalNet > 0 ? ((totalTax / totalNet) * 100).toFixed(0) : '20'}</cbc:Percent>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:TaxCategory>
        </cac:TaxSubtotal>
    </cac:TaxTotal>
    
    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount currencyID="${escapeXML(currencyID)}">${totalNet.toFixed(2)}</cbc:LineExtensionAmount>
        <cbc:TaxExclusiveAmount currencyID="${escapeXML(currencyID)}">${totalNet.toFixed(2)}</cbc:TaxExclusiveAmount>
        <cbc:TaxInclusiveAmount currencyID="${escapeXML(currencyID)}">${totalAmount.toFixed(2)}</cbc:TaxInclusiveAmount>
        <cbc:PayableAmount currencyID="${escapeXML(currencyID)}">${totalAmount.toFixed(2)}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>
    
    <!-- Ligne de facture générique car l'extraction IA ne détaille pas ligne par ligne actuellement -->
    <cac:InvoiceLine>
        <cbc:ID>1</cbc:ID>
        <cbc:InvoicedQuantity unitCode="EA">1</cbc:InvoicedQuantity>
        <cbc:LineExtensionAmount currencyID="${escapeXML(currencyID)}">${totalNet.toFixed(2)}</cbc:LineExtensionAmount>
        <cac:Item>
            <cbc:Name>Services / Marchandises (Global)</cbc:Name>
        </cac:Item>
        <cac:Price>
            <cbc:PriceAmount currencyID="${escapeXML(currencyID)}">${totalNet.toFixed(2)}</cbc:PriceAmount>
        </cac:Price>
    </cac:InvoiceLine>
</Invoice>`;
};
