import Ajv from 'ajv';
import pdf from 'pdf-parse';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { parse as csvParse } from 'csv-parse/sync';

const LLM_ENDPOINT = process.env.LLM_ENDPOINT || 'http://192.168.88.19:11434';
const LLM_MODEL = process.env.LLM_MODEL || 'qwen3-coder:480b-cloud';
const MAX_RETRIES = 2;

// Load mandatory fields from CSVs (defaults to user's provided paths)
const DEFAULT_MANDATORY_CSV = process.env.MANDATORY_CSV_PATH || '~/Desktop/IA/donneesFE/donneeObligatoire.csv';
const DEFAULT_SPECIFIC_CSV = process.env.SPECIFIC_CSV_PATH || '~/Desktop/IA/donneesFE/ZoneObliSpecifCasUsage.csv';

function resolveHome(p?: string) {
  if (!p) return p;
  if (p.startsWith('~')) return path.join(os.homedir(), p.slice(1));
  return p;
}

function loadMandatoryList(csvPath?: string) {
  try {
    const p = resolveHome(csvPath || '');
    if (!p || !fs.existsSync(p)) {
      console.warn('Mandatory CSV not found:', p);
      return [];
    }
    const raw = fs.readFileSync(p, 'utf8');
    const records = csvParse(raw, { columns: true, skip_empty_lines: true });
    if (records.length === 0) return [];
    const cols = Object.keys(records[0]);
    const col = cols[0];
    return records.map(r => String(r[col]).trim()).filter(Boolean);
  } catch (e) {
    console.warn('Failed loading mandatory CSV', csvPath, e?.message || e);
    return [];
  }
}

function loadSpecificMap(csvPath?: string) {
  try {
    const p = resolveHome(csvPath || '');
    if (!p || !fs.existsSync(p)) {
      console.warn('Specific CSV not found:', p);
      return {} as Record<string, string[]>;
    }
    const raw = fs.readFileSync(p, 'utf8');
    const records = csvParse(raw, { columns: true, skip_empty_lines: true });
    const map: Record<string, string[]> = {};
    if (records.length === 0) return map;
    const cols = Object.keys(records[0]);
    const useCaseCol = cols.find(c => /usecase|use_case|case/i.test(c)) || cols[0];
    const fieldCol = cols.find(c => /field|fieldname|zone|obli/i.test(c)) || cols[1] || cols[0];
    for (const r of records) {
      const uc = String(r[useCaseCol]).trim();
      const f = String(r[fieldCol]).trim();
      if (!uc || !f) continue;
      map[uc] = map[uc] || [];
      map[uc].push(f);
    }
    return map;
  } catch (e) {
    console.warn('Failed loading specific CSV', csvPath, e?.message || e);
    return {} as Record<string, string[]>;
  }
}

const baseMandatoryFields = loadMandatoryList(DEFAULT_MANDATORY_CSV);
const specificMandatoryMap = loadSpecificMap(DEFAULT_SPECIFIC_CSV);

const invoiceSchema: any = {
  type: 'object',
  properties: {
    useCase: { type: 'string' },
    supplierName: { type: 'string' },
    supplierAddress: { type: 'string' },
    supplierVatId: { type: 'string' },
    customerName: { type: 'string' },
    customerAddress: { type: 'string' },
    customerVatId: { type: 'string' },
    invoiceNumber: { type: 'string' },
    invoiceDate: { type: 'string' },
    invoiceType: { type: 'string' },
    orderNumber: { type: 'string' },
    deliveryDate: { type: 'string' },
    precedingInvoiceReference: { type: 'string' },
    currency: { type: 'string' },
    totalNet: { type: 'number' },
    totalTax: { type: 'number' },
    totalAmount: { type: 'number' }
  },
  required: ['supplierName', 'invoiceNumber', 'totalAmount']
};

const ajv = new Ajv();
const validate = ajv.compile(invoiceSchema);

async function extractTextFromPdf(buffer: Buffer) {
  const data = await pdf(buffer as any);
  return data.text || '';
}

async function extractTextFromInput(fileBase64: string, mimeType?: string) {
  const buf = Buffer.from(fileBase64, 'base64');
  if (!mimeType) return buf.toString('utf8');
  if (mimeType === 'application/pdf') {
    return extractTextFromPdf(buf);
  }
  if (mimeType.startsWith('text/')) {
    return buf.toString('utf8');
  }
  if (mimeType.startsWith('image/')) {
    throw new Error('Image OCR not enabled on server. Please provide text or enable OCR.');
  }
  return buf.toString('utf8');
}

async function callLocalLLM(prompt: string) {
  const url = `${LLM_ENDPOINT.replace(/\/$/, '')}/api/generate`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: LLM_MODEL, prompt, max_tokens: 1500 })
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`LLM endpoint error ${res.status}: ${body}`);
  }

  const ct = (res.headers.get('content-type') || '').toLowerCase();
  if (ct.includes('ndjson') || ct.includes('application/x-ndjson')) {
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    let result = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split(/\r?\n/);
      buf = lines.pop() || '';
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const obj = JSON.parse(line);
          if (obj.response) result += String(obj.response);
          else if (obj.thinking) result += String(obj.thinking);
          if (obj.done) {
            reader.cancel?.();
            return result;
          }
        } catch (e) {
          // ignore
        }
      }
    }
    if (buf.trim()) {
      try {
        const obj = JSON.parse(buf);
        if (obj.response) result += String(obj.response);
      } catch (e) {}
    }
    return result;
  }

  const json = await res.json().catch(() => null);
  const text = (json as any)?.response || (json as any)?.completion || ((json as any).choices && (json as any).choices[0]?.text) || JSON.stringify(json);
  return String(text);
}

export async function extractInvoiceData(fileBase64: string, mimeType: string): Promise<any> {
  const invoiceText = await extractTextFromInput(fileBase64, mimeType);

  const requiredFieldsPrompt = baseMandatoryFields.length ? `Mandatory fields: ${baseMandatoryFields.join(', ')}` : '';
  const specificMapPrompt = Object.keys(specificMandatoryMap).length ? `Specific mandatory fields per useCase: ${JSON.stringify(specificMandatoryMap)}` : '';

  let basePrompt = `You are an assistant that extracts invoicing data from raw invoice text. ${requiredFieldsPrompt} ${specificMapPrompt} Return ONLY valid JSON that matches this JSON Schema:\n${JSON.stringify(invoiceSchema)}\n\nHere is the invoice text:\n${invoiceText}\n\nReturn only JSON.`;

  let attemptPrompt = basePrompt;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const output = await callLocalLLM(attemptPrompt);
      let parsed: any;
      try {
        parsed = JSON.parse(output);
      } catch (e) {
        // Log truncated output to help debugging
        console.warn('LLM returned non-JSON output (truncated):', (output || '').slice(0, 200));
        // Try to extract JSON substring between the first '{' and last '}'
        const start = output.indexOf('{');
        const end = output.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          const candidate = output.slice(start, end + 1);
          try {
            parsed = JSON.parse(candidate);
          } catch (e2) {
            console.warn('JSON substring parse failed');
          }
        }
        if (!parsed) {
          attemptPrompt = `The previous output could not be parsed as JSON. Please return ONLY valid JSON that matches this schema:\n${JSON.stringify(invoiceSchema)}\n\nPrevious output:\n${output}\n\nInvoice text:\n${invoiceText}`;
          continue;
        }
      }
      if (!parsed.useCase) parsed.useCase = 'STANDARD';
      const effectiveRequired = Array.from(new Set([...(baseMandatoryFields || []), ...(specificMandatoryMap[parsed.useCase] || [])]));
      const valid = validate(parsed);
      const missing = effectiveRequired.filter(f => parsed[f] === undefined || parsed[f] === null || parsed[f] === '');
      if (valid && missing.length === 0) return parsed;
      if (missing.length > 0) {
        attemptPrompt = `The JSON you returned is missing these required fields: ${missing.join(', ')}. Please return ONLY valid JSON that includes them and matches this schema: ${JSON.stringify(invoiceSchema)}\n\nInvoice text:\n${invoiceText}`;
        continue;
      }
      const errText = ajv.errorsText(validate.errors);
      attemptPrompt = `The JSON you returned does not match the required schema. Errors: ${errText}. Please return ONLY valid JSON matching this schema: ${JSON.stringify(invoiceSchema)}\n\nInvoice text:\n${invoiceText}`;
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }
      console.error('Local LLM error:', err);
      throw err;
    }
  }
  throw new Error('Failed to extract valid invoice JSON after retries');
}
