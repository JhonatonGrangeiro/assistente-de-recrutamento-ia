# Deploy na Vercel com API key oculta
- Variável: `GEMINI_API_KEY` nas Environment Variables.
- Função serverless: `/api/gemini` (Node 20).
- Build detectado automaticamente (Vite).

Teste:
curl "https://SEU-SITE.vercel.app/api/gemini" -H 'Content-Type: application/json' -X POST -d '{"contents":[{"parts":[{"text":"Explain how AI works in a few words"}]}]}'
