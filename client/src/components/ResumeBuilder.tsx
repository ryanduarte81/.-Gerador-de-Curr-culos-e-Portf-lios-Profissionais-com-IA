import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Download, Sparkles, Eye, Save } from 'lucide-react';
import axios from 'axios';

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
  languages: Array<{
    language: string;
    level: string;
  }>;
}

const ResumeBuilder: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [previewMode, setPreviewMode] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ResumeData>({
    defaultValues: {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: ''
      },
      summary: '',
      experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
      education: [{ institution: '', degree: '', field: '', startDate: '', endDate: '' }],
      skills: [],
      languages: [{ language: '', level: '' }]
    }
  });

  const watchedValues = watch();

  const optimizeWithAI = async () => {
    setIsOptimizing(true);
    try {
      const content = formatResumeContent(watchedValues);
      const response = await axios.post('/api/optimize', {
        content,
        jobDescription: '',
        targetRole: ''
      });

      setOptimizedContent(response.data.optimized);
      toast.success('Currículo otimizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao otimizar currículo');
      console.error('Erro:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const formatResumeContent = (data: ResumeData): string => {
    let content = '';
    
    // Informações pessoais
    content += `${data.personalInfo.name}\n`;
    content += `${data.personalInfo.email} | ${data.personalInfo.phone}\n`;
    content += `${data.personalInfo.location}\n`;
    if (data.personalInfo.linkedin) {
      content += `LinkedIn: ${data.personalInfo.linkedin}\n`;
    }
    content += '\n';

    // Resumo
    if (data.summary) {
      content += `RESUMO PROFISSIONAL\n${data.summary}\n\n`;
    }

    // Experiência
    if (data.experience.length > 0) {
      content += 'EXPERIÊNCIA PROFISSIONAL\n';
      data.experience.forEach(exp => {
        if (exp.company && exp.position) {
          content += `${exp.position} - ${exp.company}\n`;
          content += `${exp.startDate} - ${exp.endDate}\n`;
          content += `${exp.description}\n\n`;
        }
      });
    }

    // Educação
    if (data.education.length > 0) {
      content += 'EDUCAÇÃO\n';
      data.education.forEach(edu => {
        if (edu.institution && edu.degree) {
          content += `${edu.degree} em ${edu.field}\n`;
          content += `${edu.institution}\n`;
          content += `${edu.startDate} - ${edu.endDate}\n\n`;
        }
      });
    }

    // Habilidades
    if (data.skills.length > 0) {
      content += `HABILIDADES\n${data.skills.join(', ')}\n\n`;
    }

    // Idiomas
    if (data.languages.length > 0) {
      content += 'IDIOMAS\n';
      data.languages.forEach(lang => {
        if (lang.language && lang.level) {
          content += `${lang.language}: ${lang.level}\n`;
        }
      });
    }

    return content;
  };

  const generatePDF = async () => {
    try {
      const content = optimizedContent || formatResumeContent(watchedValues);
      const response = await axios.post('/api/generate-pdf', {
        content,
        template: selectedTemplate,
        options: { title: 'Currículo' }
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'curriculo.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar PDF');
      console.error('Erro:', error);
    }
  };

  const addExperience = () => {
    const currentExperience = watch('experience');
    setValue('experience', [...currentExperience, { company: '', position: '', startDate: '', endDate: '', description: '' }]);
  };

  const addEducation = () => {
    const currentEducation = watch('education');
    setValue('education', [...currentEducation, { institution: '', degree: '', field: '', startDate: '', endDate: '' }]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Construtor de Currículos com IA
        </h1>
        <p className="text-gray-600">
          Crie currículos profissionais otimizados para ATS com ajuda da inteligência artificial
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Informações do Currículo</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={optimizeWithAI}
                disabled={isOptimizing}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {isOptimizing ? (
                  <div className="spinner" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isOptimizing ? 'Otimizando...' : 'Otimizar com IA'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(() => {})} className="space-y-6">
            {/* Informações Pessoais */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    {...register('personalInfo.name', { required: 'Nome é obrigatório' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.personalInfo?.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.personalInfo.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('personalInfo.email', { required: 'Email é obrigatório' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    {...register('personalInfo.phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    {...register('personalInfo.location')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Resumo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resumo Profissional
              </label>
              <textarea
                {...register('summary')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Descreva brevemente sua experiência e objetivos profissionais..."
              />
            </div>

            {/* Experiência */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Experiência Profissional</h3>
                <button
                  type="button"
                  onClick={addExperience}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Adicionar Experiência
                </button>
              </div>
              {watch('experience').map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Empresa
                      </label>
                      <input
                        type="text"
                        {...register(`experience.${index}.company`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cargo
                      </label>
                      <input
                        type="text"
                        {...register(`experience.${index}.position`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Início
                      </label>
                      <input
                        type="month"
                        {...register(`experience.${index}.startDate`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Fim
                      </label>
                      <input
                        type="month"
                        {...register(`experience.${index}.endDate`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      {...register(`experience.${index}.description`)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Descreva suas responsabilidades e realizações..."
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Botões de ação */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={generatePDF}
                className="flex items-center space-x-2 px-4 py-2 bg-success-600 text-white rounded-md hover:bg-success-700"
              >
                <Download className="w-4 h-4" />
                <span>Gerar PDF</span>
              </button>
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="modern">Moderno</option>
              <option value="classic">Clássico</option>
              <option value="creative">Criativo</option>
              <option value="minimal">Minimalista</option>
            </select>
          </div>

          <div className="border border-gray-200 rounded-md p-6 min-h-[600px] bg-white">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
              {optimizedContent || formatResumeContent(watchedValues)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder; 