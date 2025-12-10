import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://backend:3001'

    // Forward the request body to the backend proxy endpoint
    const forwardRes = await fetch(`${backendUrl.replace(/\/$/, '')}/api/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Pass along the shared extract key from environment if present
        ...(process.env.EXTRACT_API_KEY ? { 'x-api-key': process.env.EXTRACT_API_KEY } : {})
      },
      body: JSON.stringify(req.body),
    })

    const text = await forwardRes.text()
    // Try to parse JSON, otherwise return text
    try {
      const json = JSON.parse(text)
      res.status(forwardRes.status).json(json)
    } catch (_) {
      res.status(forwardRes.status).send(text)
    }
  } catch (err: any) {
    console.error('Frontend proxy error:', err)
    res.status(500).json({ error: String(err) })
  }
}
