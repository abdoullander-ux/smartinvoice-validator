import { InvoiceData } from "../types";

export async function extractInvoiceData(fileBase64: string, mimeType: string): Promise<InvoiceData> {
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  const url = base ? `${base.replace(/\/$/, '')}/api/extract` : '/api/extract';
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileBase64, mimeType })
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Server error: ${resp.status} ${errText}`);
  }

  const data = await resp.json();
  return data as InvoiceData;
}
