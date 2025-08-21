import React, { useState, useEffect } from 'react';
import { analyzeCandidateResume } from '../services/geminiService';
import type { AIAnalysis } from '../types';
import { SparklesIcon, CheckCircleIcon, XCircleIcon, DocumentTextIcon, LoadingSpinnerIcon, InformationCircleIcon } from './icons';

interface AIAssistantProps {
  resume: string;
  jobDescription: string;
}

const AnalysisResult: React.FC<{ analysis: AIAnalysis }> = ({ analysis }) => {
  const scoreColor = analysis.fitScore >= 8 ? 'text-green-600' : analysis.fitScore >= 5 ? 'text-yellow-600' : 'text-red-600';
  const scoreBgColor = analysis.fitScore >= 8 ? 'bg-green-100' : analysis.fitScore >= 5 ? 'bg-yellow-100' : 'bg-red-100';

  return (
    <div className="space-y-6 mt-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-2">
          <DocumentTextIcon className="w-5 h-5 mr-2 text-blue-500" />
          Resumo
        </h3>
        <p className="text-slate-600">{analysis.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-2">
            <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
            Prós
          </h3>
          <ul className="space-y-2 list-inside">
            {analysis.pros.map((pro, index) => (
              <li key={index} className="flex items-start">
                <CheckCircleIcon className="w-4 h-4 mr-2 mt-1 text-green-500 flex-shrink-0" />
                <span className="text-slate-600">{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-2">
            <XCircleIcon className="w-5 h-5 mr-2 text-red-500" />
            Contras
          </h3>
          <ul className="space-y-2 list-inside">
            {analysis.cons.map((con, index) => (
              <li key={index} className="flex items-start">
                 <XCircleIcon className="w-4 h-4 mr-2 mt-1 text-red-500 flex-shrink-0" />
                <span className="text-slate-600">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Pontuação de Adequação</h3>
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${scoreBgColor}`}>
          <span className={`text-3xl font-bold ${scoreColor}`}>{analysis.fitScore}</span>
          <span className={`text-sm font-semibold ${scoreColor}`}>/10</span>
        </div>
      </div>
    </div>
  );
};


export const AIAssistant: React.FC<AIAssistantProps> = ({ resume, jobDescription }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeCandidateResume(resume, jobDescription);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Executa a análise automaticamente quando o componente é montado
  useEffect(() => {
    handleAnalysis();
  }, [resume, jobDescription]);

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                  <SparklesIcon className="w-6 h-6 mr-2 text-blue-500" />
                  Análise IA do Candidato
                </h2>
                <p className="mt-2 text-slate-500">
                  Análise via IA da adequação deste candidato para a vaga.
                </p>
            </div>
            <button
                onClick={handleAnalysis}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinnerIcon className="w-5 h-5 mr-2" />
                    Analisando...
                  </>
                ) : (
                  'Reanalisar'
                )}
              </button>
        </div>


        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
            <p><span className="font-semibold">Erro:</span> {error}</p>
          </div>
        )}
        
        {isLoading && !analysis && (
            <div className="text-center py-10">
                <LoadingSpinnerIcon className="w-8 h-8 mx-auto text-blue-500" />
                <p className="mt-4 text-slate-500">Gerando análise de IA...</p>
            </div>
        )}

        {analysis && <AnalysisResult analysis={analysis} />}
        
        {!isLoading && !analysis && !error && (
             <div className="mt-6 p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg flex items-center">
                <InformationCircleIcon className="w-6 h-6 mr-3"/>
                <p>Clique em "Reanalisar" para gerar a análise de IA para este candidato em comparação com a descrição da vaga.</p>
            </div>
        )}
      </div>
    </div>
  );
};