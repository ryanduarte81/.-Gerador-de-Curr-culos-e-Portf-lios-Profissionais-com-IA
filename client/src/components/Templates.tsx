import React, { useState, useEffect } from 'react';
import { Palette, Download, Eye } from 'lucide-react';
import axios from 'axios';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/templates');
      setTemplates(response.data.templates);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const templateStyles = {
    modern: {
      name: 'Moderno',
      description: 'Design limpo e profissional com tipografia moderna',
      features: ['Layout responsivo', 'Cores profissionais', 'Tipografia moderna', 'Seções bem definidas'],
      color: 'bg-blue-500'
    },
    classic: {
      name: 'Clássico',
      description: 'Estilo tradicional e elegante para todos os setores',
      features: ['Formato tradicional', 'Cores neutras', 'Tipografia serif', 'Estrutura clara'],
      color: 'bg-gray-600'
    },
    creative: {
      name: 'Criativo',
      description: 'Design inovador para áreas criativas e startups',
      features: ['Layout criativo', 'Cores vibrantes', 'Elementos gráficos', 'Design único'],
      color: 'bg-purple-500'
    },
    minimal: {
      name: 'Minimalista',
      description: 'Simples e direto ao ponto, foco no conteúdo',
      features: ['Design minimalista', 'Espaçamento generoso', 'Tipografia limpa', 'Foco no conteúdo'],
      color: 'bg-green-500'
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Templates de Currículo
        </h1>
        <p className="text-gray-600">
          Escolha entre nossos templates profissionais otimizados para ATS
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="spinner"></div>
          <span className="ml-3 text-gray-600">Carregando templates...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(templateStyles).map(([key, template]) => (
            <div
              key={key}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                selectedTemplate === key ? 'border-primary-500' : 'border-gray-200'
              }`}
              onClick={() => setSelectedTemplate(key)}
            >
              {/* Preview */}
              <div className={`h-32 ${template.color} rounded-t-lg flex items-center justify-center`}>
                <div className="text-white text-center">
                  <Palette className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">{template.name}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-500">
                      <div className="w-1 h-1 bg-primary-500 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    <Eye className="w-4 h-4" />
                    <span>Visualizar</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    <Download className="w-4 h-4" />
                    <span>Usar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template Details */}
      {selectedTemplate && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {templateStyles[selectedTemplate as keyof typeof templateStyles]?.name}
            </h2>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">João Silva</div>
                    <div className="text-gray-600">Desenvolvedor Full Stack</div>
                    <div className="text-sm text-gray-500">joao@email.com | (11) 99999-9999</div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Resumo Profissional</h4>
                    <p className="text-sm text-gray-600">
                      Desenvolvedor com 5 anos de experiência em desenvolvimento web...
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Experiência</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="font-medium text-sm">Desenvolvedor Senior - TechCorp</div>
                        <div className="text-xs text-gray-500">2020 - Presente</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Características</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Ideal para:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Profissionais de tecnologia</li>
                    <li>• Cargos executivos</li>
                    <li>• Áreas criativas</li>
                    <li>• Startups e empresas modernas</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Vantagens:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Otimizado para ATS</li>
                    <li>• Design responsivo</li>
                    <li>• Fácil personalização</li>
                    <li>• Compatível com todos os navegadores</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Formato de saída:</h4>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">PDF</span>
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">DOCX</span>
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">HTML</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                  <Download className="w-5 h-5" />
                  <span>Usar este Template</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  <Eye className="w-5 h-5" />
                  <span>Ver Exemplo Completo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Dicas para Escolher o Template Ideal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Setor</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Tecnologia: Moderno ou Minimalista</li>
              <li>• Finanças: Clássico</li>
              <li>• Marketing: Criativo</li>
              <li>• Administrativo: Clássico ou Moderno</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Experiência</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Júnior: Moderno ou Minimalista</li>
              <li>• Pleno: Qualquer template</li>
              <li>• Senior: Clássico ou Moderno</li>
              <li>• Executivo: Clássico</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Empresa</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Startup: Criativo ou Moderno</li>
              <li>• Corporativa: Clássico</li>
              <li>• Agência: Criativo</li>
              <li>• Consultoria: Clássico ou Moderno</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates; 