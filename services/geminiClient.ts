// services/geminiClient.ts
export async function askGemini(prompt: string) {
  const resp = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }]}] })
  });
  if (!resp.ok) {
    let details = '';
    try { details = await resp.text(); } catch {}
    throw new Error(`Falha na API (${resp.status}): ${details}`);
  }
  return await resp.json();
}
