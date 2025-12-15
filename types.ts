export enum InvoiceFieldStatus {
  VALID = 'VALID',
  MISSING = 'MISSING',
  EDITED = 'EDITED',
}

// Liste basée sur le CSV fourni
export enum InvoiceUseCase {
  STANDARD = 'STANDARD', // Cas par défaut
  CASE_1_MULTI_ORDER = 'CASE_1_MULTI_ORDER',
  CASE_2_PAID_BY_THIRD_PARTY_PRE = 'CASE_2_PAID_BY_THIRD_PARTY_PRE',
  CASE_3_PAID_BY_THIRD_PARTY = 'CASE_3_PAID_BY_THIRD_PARTY',
  CASE_4_PARTIAL_PAYMENT_UNKNOWN = 'CASE_4_PARTIAL_PAYMENT_UNKNOWN',
  CASE_5_EXPENSES_WITH_INVOICE = 'CASE_5_EXPENSES_WITH_INVOICE',
  CASE_6_EXPENSES_WITHOUT_INVOICE = 'CASE_6_EXPENSES_WITHOUT_INVOICE',
  CASE_7_LODGED_CARD = 'CASE_7_LODGED_CARD',
  CASE_8_FACTORING_KNOWN = 'CASE_8_FACTORING_KNOWN',
  CASE_9_DISTRIBUTOR = 'CASE_9_DISTRIBUTOR',
  CASE_10_FACTORING_UNKNOWN = 'CASE_10_FACTORING_UNKNOWN',
  CASE_11_CENTRAL_ORDERING = 'CASE_11_CENTRAL_ORDERING',
  CASE_12_TRANSPARENT_INTERMEDIARY = 'CASE_12_TRANSPARENT_INTERMEDIARY',
  CASE_13A_SUBCONTRACTING_DELEGATION = 'CASE_13A_SUBCONTRACTING_DELEGATION',
  CASE_13B_SUBCONTRACTING_DIRECT = 'CASE_13B_SUBCONTRACTING_DIRECT',
  CASE_14A_CO_CONTRACTING_B2B = 'CASE_14A_CO_CONTRACTING_B2B',
  CASE_14B_CO_CONTRACTING_B2G = 'CASE_14B_CO_CONTRACTING_B2G',
  CASE_15_PURCHASE_ON_BEHALF = 'CASE_15_PURCHASE_ON_BEHALF',
  CASE_16_DISBURSEMENTS = 'CASE_16_DISBURSEMENTS',
  CASE_17A_PAYMENT_INTERMEDIARY = 'CASE_17A_PAYMENT_INTERMEDIARY',
  CASE_17B_MANDATE_INTERMEDIARY = 'CASE_17B_MANDATE_INTERMEDIARY',
  CASE_18_DEBIT_NOTE = 'CASE_18_DEBIT_NOTE',
  CASE_19A1_MANDATE_INVOICING = 'CASE_19A1_MANDATE_INVOICING',
  CASE_19A2_MANDATE_PLATFORM = 'CASE_19A2_MANDATE_PLATFORM',
  CASE_19B_SELF_BILLING = 'CASE_19B_SELF_BILLING',
  CASE_20_DEPOSIT_INVOICE = 'CASE_20_DEPOSIT_INVOICE',
  CASE_21_FINAL_INVOICE = 'CASE_21_FINAL_INVOICE',
  CASE_22A_DISCOUNT_CASH_VAT = 'CASE_22A_DISCOUNT_CASH_VAT',
  CASE_22B_DISCOUNT_DEBIT_VAT = 'CASE_22B_DISCOUNT_DEBIT_VAT',
  CASE_23_SELF_BILLING_INDIVIDUAL = 'CASE_23_SELF_BILLING_INDIVIDUAL',
  CASE_24_ARRHES = 'CASE_24_ARRHES',
  CASE_25A_GIFT_CARD_SINGLE = 'CASE_25A_GIFT_CARD_SINGLE',
  CASE_25B_GIFT_CARD_MULTI = 'CASE_25B_GIFT_CARD_MULTI',
  CASE_26_RETENTION_OF_TITLE = 'CASE_26_RETENTION_OF_TITLE',
  CASE_27_TOLL = 'CASE_27_TOLL',
  CASE_28_RESTAURANT_NOTE = 'CASE_28_RESTAURANT_NOTE',
  CASE_29_SINGLE_TAXABLE_ENTITY = 'CASE_29_SINGLE_TAXABLE_ENTITY',
  CASE_30_DUPLICATE_CORRECTION = 'CASE_30_DUPLICATE_CORRECTION',
  CASE_31_MIXED_INVOICE = 'CASE_31_MIXED_INVOICE',
  CASE_32_MONTHLY_PAYMENT = 'CASE_32_MONTHLY_PAYMENT',
  CASE_33_MARGIN_VAT = 'CASE_33_MARGIN_VAT',
  CASE_34_PARTIAL_COLLECTION = 'CASE_34_PARTIAL_COLLECTION',
  CASE_35_AUTHOR_NOTE = 'CASE_35_AUTHOR_NOTE',
  CASE_36_PROFESSIONAL_SECRECY = 'CASE_36_PROFESSIONAL_SECRECY',
  CASE_37_JOINT_VENTURE = 'CASE_37_JOINT_VENTURE',
  CASE_38_SUB_LINES = 'CASE_38_SUB_LINES',
  CASE_39_MULTI_SELLER = 'CASE_39_MULTI_SELLER',
  CASE_40_NETTING = 'CASE_40_NETTING',
  CASE_41_BARTER = 'CASE_41_BARTER',
  CASE_42_TAX_REFUND = 'CASE_42_TAX_REFUND',
  UNKNOWN = 'UNKNOWN',
}

export const USE_CASE_LABELS: Record<InvoiceUseCase, string> = {
  [InvoiceUseCase.STANDARD]: 'Standard / B2B Classique',
  [InvoiceUseCase.CASE_1_MULTI_ORDER]: '1. Multi-commande / Multi-livraison',
  [InvoiceUseCase.CASE_2_PAID_BY_THIRD_PARTY_PRE]: '2. Facture déjà payée par un Tiers ou l’acheteur',
  [InvoiceUseCase.CASE_3_PAID_BY_THIRD_PARTY]: '3. Facture payée par un Tiers',
  [InvoiceUseCase.CASE_4_PARTIAL_PAYMENT_UNKNOWN]: '4. Paiement tiers partiellement connu',
  [InvoiceUseCase.CASE_5_EXPENSES_WITH_INVOICE]: '5. Facture de Frais (collaborateurs) avec facture',
  [InvoiceUseCase.CASE_6_EXPENSES_WITHOUT_INVOICE]: '6. Facture de Frais (collaborateurs) sans facture',
  [InvoiceUseCase.CASE_7_LODGED_CARD]: '7. Carte logée (carte d’achat)',
  [InvoiceUseCase.CASE_8_FACTORING_KNOWN]: '8. Affacturage / Centralisation Trésorerie (Tiers connu)',
  [InvoiceUseCase.CASE_9_DISTRIBUTOR]: '9. Distributeur / Dépositaire',
  [InvoiceUseCase.CASE_10_FACTORING_UNKNOWN]: '10. Affacturage à la demande (Tiers inconnu)',
  [InvoiceUseCase.CASE_11_CENTRAL_ORDERING]: '11. Commande siège / Livraison magasin',
  [InvoiceUseCase.CASE_12_TRANSPARENT_INTERMEDIARY]: '12. Intermédiaire transparent',
  [InvoiceUseCase.CASE_13A_SUBCONTRACTING_DELEGATION]: '13a. Sous-traitance paiement direct (délégation)',
  [InvoiceUseCase.CASE_13B_SUBCONTRACTING_DIRECT]: '13b. Sous-traitance paiement direct (action directe)',
  [InvoiceUseCase.CASE_14A_CO_CONTRACTING_B2B]: '14a. Co-traitance B2B',
  [InvoiceUseCase.CASE_14B_CO_CONTRACTING_B2G]: '14b. Co-traitance B2G',
  [InvoiceUseCase.CASE_15_PURCHASE_ON_BEHALF]: '15. Achat pour compte (Médias, Conseil)',
  [InvoiceUseCase.CASE_16_DISBURSEMENTS]: '16. Débours',
  [InvoiceUseCase.CASE_17A_PAYMENT_INTERMEDIARY]: '17a. Intermédiaire de paiement (ex: Marketplace)',
  [InvoiceUseCase.CASE_17B_MANDATE_INTERMEDIARY]: '17b. Intermédiaire paiement + Mandat facturation',
  [InvoiceUseCase.CASE_18_DEBIT_NOTE]: '18. Notes de débit',
  [InvoiceUseCase.CASE_19A1_MANDATE_INVOICING]: '19a1. Mandat de facturation',
  [InvoiceUseCase.CASE_19A2_MANDATE_PLATFORM]: '19a2. Mandat facturation (Plateforme)',
  [InvoiceUseCase.CASE_19B_SELF_BILLING]: '19b. Auto-facturation',
  [InvoiceUseCase.CASE_20_DEPOSIT_INVOICE]: '20. Facture d’acompte',
  [InvoiceUseCase.CASE_21_FINAL_INVOICE]: '21. Facture Finale après acompte',
  [InvoiceUseCase.CASE_22A_DISCOUNT_CASH_VAT]: '22a. Escompte (TVA encaissement)',
  [InvoiceUseCase.CASE_22B_DISCOUNT_DEBIT_VAT]: '22b. Escompte (TVA débits)',
  [InvoiceUseCase.CASE_23_SELF_BILLING_INDIVIDUAL]: '23. Auto-facturation Particulier',
  [InvoiceUseCase.CASE_24_ARRHES]: '24. Gestion des arrhes',
  [InvoiceUseCase.CASE_25A_GIFT_CARD_SINGLE]: '25a. Bons/Cartes cadeaux (Usage unique)',
  [InvoiceUseCase.CASE_25B_GIFT_CARD_MULTI]: '25b. Bons/Cartes cadeaux (Usage multiple)',
  [InvoiceUseCase.CASE_26_RETENTION_OF_TITLE]: '26. Clause de réserve contractuelle',
  [InvoiceUseCase.CASE_27_TOLL]: '27. Tickets de péage',
  [InvoiceUseCase.CASE_28_RESTAURANT_NOTE]: '28. Notes de restaurant',
  [InvoiceUseCase.CASE_29_SINGLE_TAXABLE_ENTITY]: '29. Assujetti unique',
  [InvoiceUseCase.CASE_30_DUPLICATE_CORRECTION]: '30. Doublon de facture (Correction B2C->B2B)',
  [InvoiceUseCase.CASE_31_MIXED_INVOICE]: '31. Factures mixtes',
  [InvoiceUseCase.CASE_32_MONTHLY_PAYMENT]: '32. Paiements mensuels B2C',
  [InvoiceUseCase.CASE_33_MARGIN_VAT]: '33. Régime TVA sur la marge',
  [InvoiceUseCase.CASE_34_PARTIAL_COLLECTION]: '34. Encaissement partiel',
  [InvoiceUseCase.CASE_35_AUTHOR_NOTE]: '35. Notes d\'auteur',
  [InvoiceUseCase.CASE_36_PROFESSIONAL_SECRECY]: '36. Secret professionnel',
  [InvoiceUseCase.CASE_37_JOINT_VENTURE]: '37. Sociétés en participation',
  [InvoiceUseCase.CASE_38_SUB_LINES]: '38. Sous-lignes de factures',
  [InvoiceUseCase.CASE_39_MULTI_SELLER]: '39. Multi-Vendeurs',
  [InvoiceUseCase.CASE_40_NETTING]: '40. Compensation (Netting)',
  [InvoiceUseCase.CASE_41_BARTER]: '41. Barter (Troc)',
  [InvoiceUseCase.CASE_42_TAX_REFUND]: '42. Détaxe',
  [InvoiceUseCase.UNKNOWN]: 'Non déterminé',
};

export interface InvoiceData {
  // Metadata
  useCase: InvoiceUseCase;

  // Supplier Info
  supplierName: string | null;
  supplierAddress: string | null;
  supplierVatId: string | null; // Numéro TVA / SIREN

  // Customer Info
  customerName: string | null;
  customerAddress: string | null;
  customerVatId: string | null;

  // Invoice Details
  invoiceNumber: string | null;
  invoiceDate: string | null; // YYYY-MM-DD format preferred
  invoiceType: 'INVOICE' | 'CREDIT_NOTE' | 'UNKNOWN';

  // New Fields from CSV requirements
  orderNumber: string | null; // N° de bon de commande (Req: Case 1)
  deliveryDate: string | null; // Date de livraison (Req: Case 1)
  precedingInvoiceReference: string | null; // N° facture antérieure (Req: Case 21, 30)

  // Financials
  currency: string;
  totalNet: number | null; // Montant HT
  totalTax: number | null; // Montant TVA
  totalAmount: number | null; // Montant TTC

  // Payment & Payee Info (Req: Case 2, etc.)
  paymentMeans?: string | null;     // BT-81
  paymentMeansID?: string | null;   // BT-83
  payeeIBAN?: string | null;        // BT-84
  payeeBIC?: string | null;         // BT-86
  payeeName?: string | null;        // PayeeParty Name
  paymentTerms?: string | null;     // BT-20

  // Additional Fields for Extended Use Cases
  buyerReference?: string | null;         // BT-10
  contractReference?: string | null;      // BT-12
  deliveryNoteReference?: string | null;  // BT-16
  paymentDate?: string | null;            // BT-9
  note?: string | null;                   // BT-22
}

export const isFieldMissing = (value: string | number | null | undefined): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
};

// Champs de base toujours requis (ou presque)
export const BASE_REQUIRED_FIELDS: (keyof InvoiceData)[] = [
  'supplierName',
  'invoiceNumber',
  'invoiceDate',
  'totalAmount',
  'currency',
  'supplierVatId'
];

// Logique de champs obligatoires basée sur le Cas d'Usage
export const getRequiredFields = (useCase: InvoiceUseCase): (keyof InvoiceData)[] => {
  const baseFields = BASE_REQUIRED_FIELDS;

  switch (useCase) {
    case InvoiceUseCase.CASE_1_MULTI_ORDER:
      return [...baseFields, 'orderNumber', 'deliveryDate', 'deliveryNoteReference'];

    case InvoiceUseCase.CASE_2_PAID_BY_THIRD_PARTY_PRE:
      return [...baseFields, 'paymentDate', 'paymentMeans', 'payeeName', 'payeeIBAN', 'payeeBIC'];

    case InvoiceUseCase.CASE_3_PAID_BY_THIRD_PARTY:
      return [...baseFields, 'payeeName', 'paymentTerms', 'paymentMeans'];

    case InvoiceUseCase.CASE_4_PARTIAL_PAYMENT_UNKNOWN:
      // AllowanceCharge/ReasonCode not yet mapped, strictly speaking
      return [...baseFields];

    case InvoiceUseCase.CASE_5_EXPENSES_WITH_INVOICE:
      return [...baseFields, 'buyerReference', 'supplierVatId'];

    case InvoiceUseCase.CASE_6_EXPENSES_WITHOUT_INVOICE:
      return [...baseFields, 'note'];

    case InvoiceUseCase.CASE_7_LODGED_CARD:
      return [...baseFields, 'paymentMeans', 'paymentMeansID'];

    case InvoiceUseCase.CASE_8_FACTORING_KNOWN:
      return [...baseFields, 'payeeName', 'paymentTerms'];

    case InvoiceUseCase.CASE_9_DISTRIBUTOR:
      return [...baseFields, 'supplierName', 'customerName'];

    case InvoiceUseCase.CASE_10_FACTORING_UNKNOWN:
      return [...baseFields, 'note', 'invoiceDate']; // invoiceDate acts as DueDate proxy if needed, or we add DueDate later

    case InvoiceUseCase.CASE_11_CENTRAL_ORDERING:
      return [...baseFields, 'buyerReference', 'deliveryNoteReference']; // deliveryLocation not mapped

    case InvoiceUseCase.CASE_12_TRANSPARENT_INTERMEDIARY:
      return [...baseFields, 'buyerReference'];

    case InvoiceUseCase.CASE_13A_SUBCONTRACTING_DELEGATION:
    case InvoiceUseCase.CASE_13B_SUBCONTRACTING_DIRECT:
      return [...baseFields, 'contractReference', 'supplierVatId'];

    case InvoiceUseCase.CASE_14A_CO_CONTRACTING_B2B:
    case InvoiceUseCase.CASE_14B_CO_CONTRACTING_B2G:
      return [...baseFields]; // Requires detailed line items, handled implicitly

    case InvoiceUseCase.CASE_15_PURCHASE_ON_BEHALF:
      return [...baseFields, 'buyerReference'];

    case InvoiceUseCase.CASE_16_DISBURSEMENTS:
      return [...baseFields, 'precedingInvoiceReference', 'note'];

    case InvoiceUseCase.CASE_17B_MANDATE_INTERMEDIARY:
    case InvoiceUseCase.CASE_19A1_MANDATE_INVOICING:
      return [...baseFields, 'buyerReference'];

    case InvoiceUseCase.CASE_18_DEBIT_NOTE:
    case InvoiceUseCase.CASE_30_DUPLICATE_CORRECTION:
    case InvoiceUseCase.CASE_35_AUTHOR_NOTE:
      return [...baseFields, 'precedingInvoiceReference'];

    case InvoiceUseCase.CASE_19B_SELF_BILLING:
      return [...baseFields, 'customerName', 'customerVatId', 'totalNet'];

    case InvoiceUseCase.CASE_20_DEPOSIT_INVOICE:
      return [...baseFields, 'totalAmount']; // PrepaidAmount

    case InvoiceUseCase.CASE_21_FINAL_INVOICE:
      return [...baseFields, 'precedingInvoiceReference'];

    case InvoiceUseCase.CASE_22A_DISCOUNT_CASH_VAT:
    case InvoiceUseCase.CASE_22B_DISCOUNT_DEBIT_VAT:
      return [...baseFields, 'paymentTerms'];

    case InvoiceUseCase.CASE_23_SELF_BILLING_INDIVIDUAL:
      return [...baseFields, 'customerVatId'];

    case InvoiceUseCase.CASE_24_ARRHES:
    case InvoiceUseCase.CASE_26_RETENTION_OF_TITLE:
      return [...baseFields, 'note'];

    case InvoiceUseCase.CASE_25A_GIFT_CARD_SINGLE:
    case InvoiceUseCase.CASE_25B_GIFT_CARD_MULTI:
      return [...baseFields, 'paymentMeans'];

    case InvoiceUseCase.CASE_27_TOLL:
      return [...baseFields, 'buyerReference'];

    case InvoiceUseCase.CASE_29_SINGLE_TAXABLE_ENTITY:
      return [...baseFields, 'buyerReference', 'note'];

    case InvoiceUseCase.CASE_33_MARGIN_VAT:
      return [...baseFields, 'paymentMeans', 'paymentTerms', 'note'];

    case InvoiceUseCase.CASE_36_PROFESSIONAL_SECRECY:
      return [...baseFields, 'note'];

    case InvoiceUseCase.CASE_40_NETTING:
      return [...baseFields, 'precedingInvoiceReference', 'note'];

    case InvoiceUseCase.CASE_42_TAX_REFUND:
      return [...baseFields, 'precedingInvoiceReference']; // Or DocumentReference

    default:
      return [...baseFields, 'customerName', 'customerVatId', 'totalNet', 'totalTax'];
  }
};
