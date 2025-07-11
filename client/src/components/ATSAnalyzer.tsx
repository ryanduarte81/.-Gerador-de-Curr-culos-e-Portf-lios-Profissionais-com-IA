import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface ATSAnalysis {
  score: number;
  suggestions: string[];
  keywords: string[];
  missingKeywords: string[];
}

const ATSAnalyzer: React.FC = () => {
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeATS = async () => {
    if (!resumeContent.trim()) {
      toast.error('Por favor, insira o conteúdo do currículo');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await axios.post('/api/ats-analysis', {
        content: resumeContent,
        jobDescription: jobDescription
      });

      setAnalysis(response.data);
      toast.success('Análise ATS concluída!');
    } catch (error) {
      toast.error('Erro ao analisar currículo');
      console.error('Erro:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-6 h-6 text-success-600" />;
    if (score >= 60) return <AlertCircle className="w-6 h-6 text-yellow-600" />;
    return <AlertCircle className="w-6 h-6 text-red-600" />;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Análise ATS
        </h1>
        <p className="text-gray-600">
          Analise a compatibilidade do seu currículo com sistemas de recrutamento automatizado
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Conteúdo do Currículo
            </h2>
            <textarea
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Cole aqui o conteúdo do seu currículo..."
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Descrição da Vaga (Opcional)
            </h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Cole aqui a descrição da vaga para análise específica..."
            />
          </div>

          <button
            onClick={analyzeATS}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <div className="spinner" />
            ) : (
              <Target className="w-5 h-5" />
            )}
            <span>{isAnalyzing ? 'Analisando...' : 'Analisar ATS'}</span>
          </button>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Resultados da Análise
          </h2>

          {analysis ? (
            <div className="space-y-6">
              {/* Score */}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  {getScoreIcon(analysis.score)}
                  <h3 className="text-2xl font-bold text-gray-900">
                    Pontuação ATS
                  </h3>
                </div>
                <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}/100
                </div>
                <p className="text-gray-600 mt-2">
                  {analysis.score >= 80 ? 'Excelente compatibilidade' :
                   analysis.score >= 60 ? 'Boa compatibilidade' :
                   'Compatibilidade baixa - precisa de melhorias'}
                </p>
              </div>

              {/* Keywords */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Palavras-chave Encontradas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.slice(0, 15).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-success-100 text-success-800 text-sm rounded-md"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              {analysis.missingKeywords.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Palavras-chave Faltantes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.slice(0, 10).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-md"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Sugestões de Melhoria
                </h3>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <TrendingUp className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Insira o conteúdo do currículo e clique em "Analisar ATS" para ver os resultados
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Dicas para Otimização ATS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Palavras-chave</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use termos específicos da vaga</li>
              <li>• Inclua habilidades técnicas</li>
              <li>• Mencione certificações</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Formatação</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Evite tabelas complexas</li>
              <li>• Use títulos claros</li>
              <li>• Mantenha formatação simples</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Conteúdo</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Quantifique realizações</li>
              <li>• Use verbos de ação</li>
              <li>• Seja específico</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSAnalyzer; 