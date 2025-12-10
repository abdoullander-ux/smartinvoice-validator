import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { extractInvoiceData } from './geminiService.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Optional shared secret to protect the /api/extract endpoint from public abuse.
// If EXTRACT_API_KEY is set in the environment, requests must provide it via
// the `x-api-key` header or `api_key` query parameter.
const SHARED_KEY = process.env.EXTRACT_API_KEY;
if (!SHARED_KEY) {
  console.warn('Warning: EXTRACT_API_KEY not set. /api/extract will be unprotected.');
}

function requireSharedKey(req: any, res: any, next: any) {
  if (!SHARED_KEY) return next();
  const header = req.headers['x-api-key'];
  const query = req.query?.api_key;
  if (header && header === SHARED_KEY) return next();
  if (query && query === SHARED_KEY) return next();
  res.status(401).json({ error: 'Unauthorized: invalid or missing API key' });
}

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/api/extract', requireSharedKey, async (req, res) => {
  try {
    const { fileBase64, mimeType } = req.body;
    if (!fileBase64 || !mimeType) return res.status(400).json({ error: 'fileBase64 and mimeType required' });

    const result = await extractInvoiceData(fileBase64, mimeType);
    res.json(result);
  } catch (err: any) {
    console.error('API error:', err);
    res.status(500).json({ error: String(err) });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
