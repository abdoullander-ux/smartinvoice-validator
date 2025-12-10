import React, { useMemo } from 'react';
import { InvoiceData, InvoiceUseCase, USE_CASE_LABELS, getRequiredFields, isFieldMissing } from '../types';
import { CheckCircle2, AlertCircle, FileCode, Settings2 } from 'lucide-react';

interface DataPanelProps {
  data: InvoiceData;
  onChange: (key: keyof InvoiceData, value: any) => void;
  onConfirm: () => void;
}

const DataPanel: React.FC<DataPanelProps> = ({ data, onChange, onConfirm }) => {
  
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
    const value = data[key];
    const isMissing = isRequired && isFieldMissing(value as string | number | null);

    return (
      <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
        <td className="py-3 px-4 w-5/12 align-middle bg-white group-hover:bg-slate-50 transition-colors">
          <div className="flex flex-col">
            <span className={`text-sm font-medium ${isMissing ? 'text-red-600' : 'text-slate-600'}`}>
              {label}
              {isRequired && <span className="text-red-500 ml-1" title="Champ obligatoire pour ce cas d'usage">*</span>}
            </span>
            {isMissing && (
               <span className="text-[10px] text-red-500 font-semibold flex items-center mt-0.5">
                 <AlertCircle size={10} className="mr-1" /> Requis
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
            className={`w-full px-3 py-1.5 rounded text-sm border focus:ring-2 focus:ring-opacity-50 outline-none transition-all ${
              isMissing 
                ? 'border-red-300 bg-red-50 text-red-900 focus:ring-red-200 focus:border-red-400 placeholder-red-300' 
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
          </tbody>
        </table>
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-slate-200 shrink-0 bg-slate-50">
        <button
          onClick={onConfirm}
          disabled={!isValid}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all ${
            isValid 
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
