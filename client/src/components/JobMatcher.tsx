import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { GraduationCap, Star, MapPin, Building, Calendar } from 'lucide-react';
import axios from 'axios';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  type?: string;
}

interface JobMatch {
  job: JobListing;
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}

const JobMatcher: React.FC = () => {
  const [resumeContent, setResumeContent] = useState('');
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Vagas de exemplo
  const sampleJobs: JobListing[] = [
    {
      id: '1',
      title: 'Desenvolvedor Full Stack',
      company: 'TechCorp',
      location: 'São Paulo, SP',
      description: 'Buscamos desenvolvedor com experiência em React, Node.js, TypeScript. Conhecimento em AWS, Docker, CI/CD. Experiência com metodologias ágeis.',
      salary: 'R$ 8.000 - 12.000',
      type: 'CLT'
    },
    {
      id: '2',
      title: 'Analista de Marketing Digital',
      company: 'MarketingPro',
      location: 'Rio de Janeiro, RJ',
      description: 'Profissional com experiência em Google Ads, Facebook Ads, SEO, Analytics. Gestão de campanhas e análise de resultados.',
      salary: 'R$ 5.000 - 8.000',
      type: 'CLT'
    },
    {
      id: '3',
      title: 'Gerente de Vendas',
      company: 'SalesForce',
      location: 'Belo Horizonte, MG',
      description: 'Liderança de equipe comercial, prospecção de clientes, negociação, fechamento de vendas. Experiência com CRM.',
      salary: 'R$ 6.000 - 10.000',
      type: 'CLT'
    }
  ];

  const addSampleJobs = () => {
    setJobListings(sampleJobs);
    toast.success('Vagas de exemplo adicionadas!');
  };

  const addCustomJob = () => {
    const newJob: JobListing = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      description: ''
    };
    setJobListings([...jobListings, newJob]);
  };

  const updateJob = (id: string, field: keyof JobListing, value: string) => {
    setJobListings(jobs => 
      jobs.map(job => 
        job.id === id ? { ...job, [field]: value } : job
      )
    );
  };

  const removeJob = (id: string) => {
    setJobListings(jobs => jobs.filter(job => job.id !== id));
  };

  const analyzeMatches = async () => {
    if (!resumeContent.trim()) {
      toast.error('Por favor, insira o conteúdo do currículo');
      return;
    }

    if (jobListings.length === 0) {
      toast.error('Adicione pelo menos uma vaga para análise');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await axios.post('/api/job-match', {
        resume: resumeContent,
        jobListings: jobListings
      });

      setMatches(response.data.matches);
      toast.success('Análise de compatibilidade concluída!');
    } catch (error) {
      toast.error('Erro ao analisar compatibilidade');
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

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-success-100 text-success-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Análise de Compatibilidade com Vagas
        </h1>
        <p className="text-gray-600">
          Compare seu currículo com vagas disponíveis e descubra sua compatibilidade
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Resume Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Seu Currículo
            </h2>
            <textarea
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Cole aqui o conteúdo do seu currículo..."
            />
          </div>

          {/* Job Listings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Vagas para Análise
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={addSampleJobs}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Exemplos
                </button>
                <button
                  onClick={addCustomJob}
                  className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  + Adicionar
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {jobListings.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-start justify-between mb-3">
                    <input
                      type="text"
                      value={job.title}
                      onChange={(e) => updateJob(job.id, 'title', e.target.value)}
                      placeholder="Título da vaga"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={() => removeJob(job.id)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    <input
                      type="text"
                      value={job.company}
                      onChange={(e) => updateJob(job.id, 'company', e.target.value)}
                      placeholder="Empresa"
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      value={job.location}
                      onChange={(e) => updateJob(job.id, 'location', e.target.value)}
                      placeholder="Localização"
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <textarea
                    value={job.description}
                    onChange={(e) => updateJob(job.id, 'description', e.target.value)}
                    placeholder="Descrição da vaga..."
                    rows={3}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={analyzeMatches}
              disabled={isAnalyzing}
              className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <div className="spinner" />
              ) : (
                <GraduationCap className="w-5 h-5" />
              )}
              <span>{isAnalyzing ? 'Analisando...' : 'Analisar Compatibilidade'}</span>
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Resultados da Compatibilidade
          </h2>

          {matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.job.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{match.job.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {match.job.company}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {match.job.location}
                        </span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreBadge(match.score)}`}>
                      {match.score}%
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    {match.job.description.length > 150 
                      ? `${match.job.description.substring(0, 150)}...`
                      : match.job.description
                    }
                  </div>

                  <div className="space-y-2">
                    {match.matchedKeywords.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-success-700">Palavras-chave encontradas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {match.matchedKeywords.slice(0, 5).map((keyword, index) => (
                            <span key={index} className="px-1 py-0.5 bg-success-100 text-success-800 text-xs rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {match.missingKeywords.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-red-700">Palavras-chave faltantes:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {match.missingKeywords.slice(0, 3).map((keyword, index) => (
                            <span key={index} className="px-1 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Adicione vagas e analise a compatibilidade para ver os resultados
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {matches.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recomendações
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Melhor Compatibilidade</h3>
              {matches[0] && (
                <div className="p-3 bg-success-50 border border-success-200 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{matches[0].job.title}</span>
                    <span className="text-success-700 font-bold">{matches[0].score}%</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Esta vaga tem a melhor compatibilidade com seu perfil
                  </p>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Dicas de Melhoria</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Adicione palavras-chave específicas das vagas</li>
                <li>• Quantifique suas realizações</li>
                <li>• Mantenha o currículo atualizado</li>
                <li>• Personalize para cada vaga</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobMatcher; 