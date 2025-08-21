// api/gemini.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const upstream = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        body: JSON.stringify(body),
      }
    );

    const text = await upstream.text();
    res.status(upstream.ok ? 200 : upstream.status).setHeader('Content-Type', 'application/json');
    return res.send(text);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error', details: String(err?.message || err) });
  }
}
