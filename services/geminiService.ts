import { GoogleGenAI, Type } from "@google/genai";
import type { AIAnalysis } from '../types';

// IMPORTANTE: Não exponha esta chave em uma aplicação frontend do mundo real.
// Isto é apenas para fins de demonstração. Em um ambiente de produção,
// as chamadas de API devem ser feitas a partir de um servidor backend seguro.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // Uma verificação simples para alertar o desenvolvedor.
  // Em um aplicativo real, você pode ter um gerenciamento de configuração mais sofisticado.
  console.error("A API_KEY não está definida. Forneça-a em suas variáveis de ambiente.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Um resumo de 2 a 3 frases do perfil do candidato e seus principais pontos fortes relacionados à descrição da vaga."
    },
    pros: {
      type: Type.ARRAY,
      description: "Uma lista de 3 a 5 pontos fortes ou experiências relevantes que o candidato possui e que correspondem à descrição da vaga.",
      items: { type: Type.STRING }
    },
    cons: {
      type: Type.ARRAY,
      description: "Uma lista de 2 a 3 potenciais fraquezas, lacunas de experiência ou áreas de preocupação com base na descrição da vaga.",
      items: { type: Type.STRING }
    },
    fitScore: {
      type: Type.INTEGER,
      description: "Uma pontuação geral de 1 a 10 indicando o quão bem o candidato se encaixa na descrição da vaga. 1 é um ajuste muito ruim, 10 é um ajuste perfeito."
    },
  }
};


export const analyzeCandidateResume = async (resume: string, jobDescription: string): Promise<AIAnalysis> => {
  if (!API_KEY) {
    throw new Error("A chave da API não está configurada.");
  }
  
  if (!jobDescription.trim()) {
    throw new Error("A descrição da vaga não pode estar vazia.");
  }

  const prompt = `
    Como um recrutador técnico sênior, sua tarefa é analisar o currículo do candidato a seguir em comparação com a descrição da vaga fornecida.
    Forneça uma avaliação detalhada, imparcial e profissional.

    **Descrição da Vaga:**
    ---
    ${jobDescription}
    ---

    **Currículo do Candidato:**
    ---
    ${resume}
    ---

    Com base na comparação, forneça sua análise no formato JSON especificado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    // A API Gemini pode, às vezes, retornar a string JSON envolta em acentos graves de markdown
    // ou incluir texto que não seja JSON antes ou depois do objeto.
    // Esta lógica extrai o objeto JSON principal para tornar a análise mais robusta.
    const rawText = response.text;
    const jsonStart = rawText.indexOf('{');
    const jsonEnd = rawText.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
        throw new Error("A análise da IA retornou um formato inválido. Não foi possível encontrar um objeto JSON.");
    }

    const jsonText = rawText.substring(jsonStart, jsonEnd + 1);
    
    const analysisResult: AIAnalysis = JSON.parse(jsonText);
    
    // Validação básica
    if (!analysisResult.summary || !analysisResult.pros || !analysisResult.cons || typeof analysisResult.fitScore !== 'number') {
        throw new Error("Análise malformada recebida da API.");
    }
      
    return analysisResult;

  } catch (error) {
    console.error("Erro ao analisar o currículo do candidato:", error);
    if (error instanceof Error) {
        throw new Error(`Falha ao obter análise da IA: ${error.message}`);
    }
    throw new Error("Ocorreu um erro desconhecido ao analisar o currículo.");
  }
};
