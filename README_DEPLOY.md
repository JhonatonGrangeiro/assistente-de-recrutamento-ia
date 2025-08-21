# Deploy na Vercel (com chave oculta)

Este projeto React + Vite foi preparado para usar o Gemini **sem expor a API key**.
A rota **/api/gemini** (função serverless) faz proxy da requisição para a API do Google.

## Passo a passo

1. **Requisitos**: Projeto em um repositório (GitHub/GitLab/Bitbucket).
2. **Variável de ambiente (Vercel)**: em *Settings → Environment Variables* adicione:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: sua chave (NÃO commitar arquivos .env com chave real)
   - **Environment**: Production (e Preview se desejar)
3. **Deploy**: "Add New Project" → importe o repositório → deploy.
4. **Testar**:
   ```bash
   curl "https://SEU-SITE.vercel.app/api/gemini"        -H 'Content-Type: application/json'        -X POST        -d '{
       "contents": [
         { "parts": [ { "text": "Explain how AI works in a few words" } ] }
       ]
     }'
   ```

## Uso no frontend

Utilize o helper `askGemini`:

```ts
import { askGemini } from './services/geminiClient';

async function run() {
  const data = await askGemini('Explain how AI works in a few words');
  console.log(data);
}
```

## Observações
- **Nunca** exponha `X-goog-api-key` no cliente (navegador).
- `.env.local` existe apenas para desenvolvimento local. Não commite chaves reais.
- Arquivo `vercel.json` indica build estático (Vite) e runtime `nodejs20.x` para funções.
