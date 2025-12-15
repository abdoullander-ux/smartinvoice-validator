import React, { useMemo, useState } from 'react';
import { InvoiceData, InvoiceUseCase, USE_CASE_LABELS, getRequiredFields, isFieldMissing, BASE_REQUIRED_FIELDS } from '../types';
import { CheckCircle2, AlertCircle, FileCode, Settings2, Copy } from 'lucide-react';

// Helper to ensure dates are YYYY-MM-DD for input type="date"
const formatDateForInput = (val: string | number | null | undefined): string => {
  if (!val) return '';
  const strVal = String(val).trim();
  // Try to parse basic formats
  // If it's already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(strVal)) return strVal;

  // If it's YYYY-MM-DDTHH:mm:ss... (ISO)
  if (strVal.includes('T')) {
    return strVal.split('T')[0];
  }

  // If we want to be more robust, we could try Date.parse, but be careful with timezones
  const d = new Date(strVal);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }

  // Return original as falback
  return strVal;
};

interface DataPanelProps {
  data: InvoiceData;
  onChange: (key: keyof InvoiceData, value: any) => void;
  onConfirm: () => void;
}

const DataPanel: React.FC<DataPanelProps> = ({ data, onChange, onConfirm }) => {
  const [expanded, setExpanded] = useState(false);

  // Calculate required fields dynamically based on the selected Use Case
  const currentRequiredFields = useMemo(() => {
    return getRequiredFields(data.useCase);
  }, [data.useCase]);

  const missingCount = useMemo(() => {
    return currentRequiredFields.filter(field => isFieldMissing(data[field])).length;
  }, [data, currentRequiredFields]);

  const isValid = missingCount === 0;

  const renderRow = (
    key: keyof InvoiceData,
    label: string,
    type: 'text' | 'number' | 'date' = 'text'
  ) => {
    // Check if this specific field is required for the CURRENT use case
    const isRequired = currentRequiredFields.includes(key);
    const rawValue = data[key];

    // Format value for input if type is date
    const value = type === 'date' ? formatDateForInput(rawValue as string) : rawValue;

    const isMissing = isRequired && isFieldMissing(rawValue as string | number | null);

    // Determine if it's a "Generic Structure" error (Red) or "Use Case Specific" error (Orange)
    // Structure error = It is in BASE_REQUIRED_FIELDS
    // Specific error = It is required BUT NOT in BASE_REQUIRED_FIELDS
    const isSpecificError = isMissing && !BASE_REQUIRED_FIELDS.includes(key);

    const errorBorderClass = isSpecificError ? 'border-orange-300 bg-orange-50 text-orange-900 focus:ring-orange-200 focus:border-orange-400 placeholder-orange-300'
      : 'border-red-300 bg-red-50 text-red-900 focus:ring-red-200 focus:border-red-400 placeholder-red-300';
    const labelColorClass = isMissing
      ? isSpecificError ? 'text-orange-600' : 'text-red-600'
      : 'text-slate-600';

    const requiredIndicatorColor = isSpecificError ? 'text-orange-500' : 'text-red-500';

    return (
      <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
        <td className="py-3 px-4 w-5/12 align-middle bg-white group-hover:bg-slate-50 transition-colors">
          <div className="flex flex-col">
            <span className={`text-sm font-medium ${labelColorClass}`}>
              {label}
              {isRequired && <span className={`${requiredIndicatorColor} ml-1`} title="Champ obligatoire pour ce cas d'usage">*</span>}
            </span>
            {isMissing && (
              <span className={`text-[10px] ${requiredIndicatorColor} font-semibold flex items-center mt-0.5`}>
                <AlertCircle size={10} className="mr-1" /> {isSpecificError ? 'Requis (Spécifique)' : 'Requis'}
              </span>
            )}
          </div>
        </td>
        <td className="py-2 px-4 align-middle bg-white group-hover:bg-slate-50 transition-colors">
          <input
            type={type}
            step={type === 'number' ? "0.01" : undefined}
            value={value ?? ''}
            onChange={(e) => {
              let val: any = e.target.value;
              if (type === 'number') {
                val = val === '' ? null : parseFloat(val);
              }
              onChange(key, val);
            }}
            className={`w-full px-3 py-1.5 rounded text-sm border focus:ring-2 focus:ring-opacity-50 outline-none transition-all ${isMissing
              ? errorBorderClass
              : 'border-slate-200 bg-white text-slate-800 focus:ring-brand-500 focus:border-brand-500 hover:border-slate-300'
              }`}
            placeholder={isMissing ? "Valeur manquante" : "—"}
          />
        </td>
      </tr>
    );
  };

  const renderSectionHeader = (title: string) => (
    <tr className="bg-slate-50/80">
      <td colSpan={2} className="py-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-y border-slate-200">
        {title}
      </td>
    </tr>
  );

  const FIELD_LABELS: Record<keyof InvoiceData, string> = {
    useCase: 'Cas d\'usage',
    supplierName: 'Nom / Raison Sociale',
    supplierAddress: 'Adresse',
    supplierVatId: 'Numéro TVA / SIREN',
    customerName: 'Nom du Client',
    customerAddress: 'Adresse Client',
    customerVatId: 'TVA Intracom / SIREN Client',
    invoiceNumber: 'Numéro Facture',
    invoiceDate: 'Date Émission',
    invoiceType: 'Type Facture',
    orderNumber: 'N° Bon de Commande',
    deliveryDate: 'Date Livraison / Mission',
    precedingInvoiceReference: 'Réf. Facture Précédente',
    currency: 'Devise',
    totalNet: 'Total HT',
    totalTax: 'Total TVA',
    totalAmount: 'Total TTC',
    paymentMeans: 'Moyen de paiement',
    paymentMeansID: 'Référence de paiement',
    payeeIBAN: 'IBAN',
    payeeBIC: 'BIC',
    payeeName: 'Nom du Bénéficiaire',
    paymentTerms: 'Conditions de règlement',
    buyerReference: 'Référence Acheteur / Mandat',
    contractReference: 'Référence Contrat',
    deliveryNoteReference: 'Réf. Bon de Livraison',
    paymentDate: 'Date Paiement',
    note: 'Note / Commentaire',
  } as const;

  const MANDATORY_NODES: { name: string; bt: string; ubl: string; fieldKey?: keyof InvoiceData }[] = [
    { name: 'Numéro de facture (unique)', bt: 'BT-1', ubl: 'cbc:ID', fieldKey: 'invoiceNumber' },
    { name: 'Date de facture', bt: 'BT-2', ubl: 'cbc:IssueDate', fieldKey: 'invoiceDate' },
    { name: 'Code devise', bt: 'BT-5', ubl: 'cbc:DocumentCurrencyCode', fieldKey: 'currency' },
    { name: 'Code pays du vendeur', bt: 'BT-40', ubl: 'cac:Country/cbc:IdentificationCode' },
    { name: 'Code pays de l\'acheteur', bt: 'BT-55', ubl: 'cac:Country/cbc:IdentificationCode' },
    { name: 'Numéro de TVA du vendeur', bt: 'BT-31', ubl: 'cac:PartyTaxScheme/cbc:CompanyID', fieldKey: 'supplierVatId' },
    { name: 'Numéro de TVA de l\'acheteur', bt: 'BT-48', ubl: 'cac:PartyTaxScheme/cbc:CompanyID', fieldKey: 'customerVatId' },
    { name: 'Code postal du vendeur', bt: 'BT-38', ubl: 'cbc:PostalZone', fieldKey: undefined },
    { name: 'Ville du vendeur', bt: 'BT-37', ubl: 'cbc:CityName', fieldKey: undefined },
    { name: 'Code postal de l\'acheteur', bt: 'BT-53', ubl: 'cbc:PostalZone', fieldKey: undefined },
    { name: 'Ville de l\'acheteur', bt: 'BT-52', ubl: 'cbc:CityName', fieldKey: undefined },
    { name: 'Montant total HT', bt: 'BT-106', ubl: 'cac:LegalMonetaryTotal/cbc:TaxExclusiveAmount', fieldKey: 'totalNet' },
    { name: 'Montant total TTC', bt: 'BT-112', ubl: 'cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount', fieldKey: 'totalAmount' },
    { name: 'Montant total de TVA', bt: 'BT-110', ubl: 'cac:TaxTotal/cbc:TaxAmount', fieldKey: 'totalTax' },
    { name: 'Base imposable par taux de TVA', bt: 'BT-116', ubl: 'cac:TaxSubtotal/cbc:TaxableAmount' },
    { name: 'Montant de TVA par taux', bt: 'BT-117', ubl: 'cac:TaxSubtotal/cbc:TaxAmount', fieldKey: 'totalTax' },
    { name: 'Taux de TVA', bt: 'BT-119', ubl: 'cac:TaxSubtotal/cbc:Percent' },
    { name: 'Catégorie de TVA', bt: 'BT-118', ubl: 'cac:TaxSubtotal/cac:TaxCategory/cbc:ID' },
    { name: "Code motif d'exonération de TVA (si applicable)", bt: 'BT-121', ubl: 'cac:TaxCategory/cbc:TaxExemptionReasonCode' },
    { name: "Raison de l'exonération de TVA (si applicable)", bt: 'BT-120', ubl: 'cac:TaxCategory/cbc:TaxExemptionReason' },
    { name: 'Code pays de taxation', bt: 'BT-122', ubl: 'cac:TaxScheme/cac:Country/cbc:IdentificationCode' },
    { name: 'Montant à payer', bt: 'BT-115', ubl: 'cac:LegalMonetaryTotal/cbc:PayableAmount', fieldKey: 'totalAmount' },
    { name: 'Description des biens/services (ligne)', bt: 'BT-153', ubl: 'cac:Item/cbc:Name' },
    { name: 'Montant HT ligne', bt: 'BT-131', ubl: 'cac:Price/cbc:PriceAmount' },
    { name: 'Quantité ligne', bt: 'BT-129', ubl: 'cbc:InvoicedQuantity' },
    { name: "Code unité de mesure ligne", bt: 'BT-130', ubl: 'cbc:InvoicedQuantity/@unitCode' },
    { name: 'Montant total HT ligne', bt: 'BT-131', ubl: 'cac:LineExtensionAmount' },
    { name: 'Taux de TVA ligne', bt: 'BT-151', ubl: 'cac:TaxCategory/cbc:Percent' },
    { name: 'Catégorie de TVA ligne', bt: 'BT-152', ubl: 'cac:TaxCategory/cbc:ID' },
    { name: "Date d'exigibilité de la TVA (si différente)", bt: 'BT-9', ubl: 'cbc:TaxPointDate' },
    { name: "Date d'échéance de règlement", bt: 'BT-9', ubl: 'cbc:DueDate' },
    { name: 'Moyen de paiement', bt: 'BT-81', ubl: 'cac:PaymentMeans/cbc:PaymentMeansCode', fieldKey: 'paymentMeans' },
    { name: 'Référence de paiement', bt: 'BT-83', ubl: 'cac:PaymentMeans/cbc:PaymentID', fieldKey: 'paymentMeansID' },
    { name: 'IBAN', bt: 'BT-84', ubl: 'cac:PayeeFinancialAccount/cbc:ID', fieldKey: 'payeeIBAN' },
    { name: 'BIC', bt: 'BT-86', ubl: 'cac:PayeeFinancialAccount/cac:FinancialInstitutionBranch/cbc:ID', fieldKey: 'payeeBIC' },
    { name: 'Nom de la banque', bt: 'BT-85', ubl: 'cac:FinancialInstitution/cbc:Name' },
    { name: 'Nom du Bénéficiaire', bt: 'BT-59', ubl: 'cac:PayeeParty/cac:PartyName/cbc:Name', fieldKey: 'payeeName' },
    { name: 'Conditions de règlement', bt: 'BT-20', ubl: 'cac:PaymentTerms/cbc:Note', fieldKey: 'paymentTerms' },
    { name: 'Mentions obligatoires (TVA,règlement...)', bt: 'BT-22', ubl: 'cbc:Note', fieldKey: 'note' },
    { name: 'Référence Acheteur', bt: 'BT-10', ubl: 'cbc:BuyerReference', fieldKey: 'buyerReference' },
    { name: 'Référence Contrat', bt: 'BT-12', ubl: 'cac:ContractDocumentReference/cbc:ID', fieldKey: 'contractReference' },
    { name: 'Référence Bon Livraison', bt: 'BT-16', ubl: 'cac:DespatchDocumentReference/cbc:ID', fieldKey: 'deliveryNoteReference' },
  ];

  return (
    <div className="h-full flex flex-col">

      {/* Use Case Selector */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
          <Settings2 size={14} className="mr-1" />
          Cas d'usage
        </label>
        <select
          value={data.useCase}
          onChange={(e) => onChange('useCase', e.target.value as InvoiceUseCase)}
          className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 font-medium shadow-sm truncate"
        >
          {Object.entries(USE_CASE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <p className="text-xs text-slate-400 italic">
          Sélectionnez le cas d'usage précis pour voir les champs requis spécifiques.
        </p>
      </div>

      {/* Header Status */}
      <div className={`m-4 p-4 rounded-lg border ${isValid ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'} shrink-0`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            {isValid ? (
              <CheckCircle2 className="text-green-600 mr-3" size={24} />
            ) : (
              <AlertCircle className="text-orange-600 mr-3" size={24} />
            )}
            <div>
              <h2 className={`text-lg font-bold ${isValid ? 'text-green-800' : 'text-orange-800'}`}>
                {isValid ? 'Facture Conforme' : 'Données Manquantes'}
              </h2>
              <p className={`text-sm ${isValid ? 'text-green-700' : 'text-orange-700'}`}>
                {isValid
                  ? "Toutes les données obligatoires pour ce cas d'usage sont présentes."
                  : `${missingCount} champ(s) obligatoire(s) à renseigner.`}
              </p>
            </div>
          </div>

          {/* Right side: invoice code badge and specific mandatory fields */}
          <div className="flex flex-col items-end space-y-2">
            <div className="text-sm text-slate-600 flex items-center">
              <span className="font-medium text-slate-700 mr-2">Code Facture:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-sm font-semibold">
                <span>{data.invoiceNumber ?? '—'}</span>
                <CopyButton invoiceNumber={data.invoiceNumber} />
              </span>
            </div>

            <div className="text-xs text-slate-500 w-full max-w-sm">
              <div className="font-semibold text-slate-600 mb-1">Champs obligatoires (cas: {USE_CASE_LABELS[data.useCase]})</div>
              <div className="flex flex-wrap gap-2">
                {currentRequiredFields.slice(0, expanded ? undefined : 8).map((f) => (
                  <span key={String(f)} className={`px-2 py-0.5 rounded text-[12px] border ${isFieldMissing(data[f]) ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
                    {FIELD_LABELS[f] ?? String(f)}
                  </span>
                ))}
                {currentRequiredFields.length > 8 && (
                  <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="px-2 py-0.5 rounded text-[12px] bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors"
                  >
                    {expanded ? 'Voir moins' : `+${currentRequiredFields.length - 8} autres`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Noeuds obligatoires (UBL) */}
      <div className="m-4 p-4 bg-white border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-slate-700">Noeuds obligatoires (UBL)</div>
          <div className="text-xs text-slate-500">Donnée obligatoire · Zone Facture · Zone UBL</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-100">
                <th className="py-2 px-3 font-semibold">Donnée obligatoire</th>
                <th className="py-2 px-3 font-semibold">Zone Facture</th>
                <th className="py-2 px-3 font-semibold">Zone UBL</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {MANDATORY_NODES.map((n, idx) => {
                const isMapped = !!n.fieldKey;
                const isRequiredNode = isMapped && currentRequiredFields.includes(n.fieldKey as keyof InvoiceData);
                const isMissingNode = isMapped && isFieldMissing(data[n.fieldKey as keyof InvoiceData]);
                const isSpecificError = isMissingNode && isMapped && !BASE_REQUIRED_FIELDS.includes(n.fieldKey as keyof InvoiceData);
                const rowClass = isRequiredNode
                  ? isMissingNode
                    ? isSpecificError
                      ? 'bg-orange-50 border-l-4 border-orange-300'
                      : 'bg-yellow-50 border-l-4 border-yellow-300'
                    : 'bg-green-50 border-l-4 border-green-200'
                  : '';
                return (
                  <tr key={idx} className={`${rowClass} border-b last:border-0`}>
                    <td className="py-2 px-3 align-top flex items-start gap-2">
                      {isRequiredNode && (
                        <span className="mt-0.5">
                          {isMissingNode ? <AlertCircle className={isSpecificError ? "text-orange-600" : "text-yellow-600"} size={14} /> : <CheckCircle2 className="text-green-600" size={14} />}
                        </span>
                      )}
                      <span>{n.name}</span>
                    </td>
                    <td className="py-2 px-3 align-top">{n.bt}</td>
                    <td className="py-2 px-3 align-top font-mono text-xs text-slate-600">{n.ubl}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-y-auto border-t border-slate-200 bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm text-slate-500">
            <tr>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 w-5/12">Champ</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">Valeur extraite</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Supplier Section */}
            {renderSectionHeader('Fournisseur')}
            {renderRow('supplierName', 'Nom / Raison Sociale', 'text')}
            {renderRow('supplierVatId', 'Numéro TVA / SIREN', 'text')}
            {renderRow('supplierAddress', 'Adresse', 'text')}

            {/* Customer Section */}
            {renderSectionHeader('Client')}
            {renderRow('customerName', 'Nom du Client', 'text')}
            {renderRow('customerVatId', 'TVA Intracom / SIREN Client', 'text')}
            {renderRow('customerAddress', 'Adresse Client', 'text')}

            {/* References & Specifics Section */}
            {renderSectionHeader('Références & Notes')}
            {renderRow('buyerReference', 'Réf. Acheteur / Mandat', 'text')}
            {renderRow('contractReference', 'Réf. Contrat', 'text')}
            {renderRow('deliveryNoteReference', 'Réf. Bon de Livraison', 'text')}
            {renderRow('note', 'Note / Mention Spéciale', 'text')}

            {/* Invoice Details Section */}
            {renderSectionHeader('Détails Facture')}
            {renderRow('invoiceNumber', 'Numéro Facture', 'text')}
            {renderRow('invoiceDate', 'Date Émission', 'date')}
            {renderRow('currency', 'Devise', 'text')}
            {renderRow('orderNumber', 'N° Bon de Commande', 'text')}
            {renderRow('deliveryDate', 'Date Livraison / Mission', 'date')}
            {renderRow('precedingInvoiceReference', 'Réf. Facture Précédente', 'text')}

            {/* Totals Section */}
            {renderSectionHeader('Totaux')}
            {renderRow('totalNet', 'Total HT', 'number')}
            {renderRow('totalTax', 'Total TVA', 'number')}
            {renderRow('totalAmount', 'Total TTC', 'number')}

            {/* Payment & Payee Section */}
            {renderSectionHeader('Informations de Paiement / Bénéficiaire')}
            {renderRow('paymentMeans', 'Moyen de paiement (30, 42, 58...)', 'text')}
            {renderRow('payeeName', 'Nom du Bénéficiaire', 'text')}
            {renderRow('payeeIBAN', 'IBAN', 'text')}
            {renderRow('payeeBIC', 'BIC', 'text')}
            {renderRow('paymentMeansID', 'Référence de virement (ex: REF123)', 'text')}
            {renderRow('paymentTerms', 'Conditions de règlement', 'text')}
            {renderRow('paymentDate', 'Date Paiement', 'date')}
          </tbody>
        </table>
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-slate-200 shrink-0 bg-slate-50">
        <button
          onClick={onConfirm}
          disabled={!isValid}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all ${isValid
            ? 'bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-200 transform hover:-translate-y-0.5'
            : 'bg-slate-300 cursor-not-allowed'
            }`}
        >
          <FileCode size={18} className="mr-2" />
          Valider et Exporter UBL
        </button>
      </div>
    </div>
  );
};

export default DataPanel;

// Small sub-component for copy button and feedback
function CopyButton({ invoiceNumber }: { invoiceNumber: string | null }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = invoiceNumber ?? '';
    if (!text) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      // ignore copy errors silently
      console.warn('Copy failed', e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copier le code facture"
      title="Copier le code facture"
      className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : (
        <Copy size={14} />
      )}
    </button>
  );
}
