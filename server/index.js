import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { extractInvoiceData } from './geminiService.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/api/extract', async (req, res) => {
  try {
    const { fileBase64, mimeType } = req.body;
    if (!fileBase64 || !mimeType) return res.status(400).json({ error: 'fileBase64 and mimeType required' });

    const result = await extractInvoiceData(fileBase64, mimeType);
    res.json(result);
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: String(err) });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
