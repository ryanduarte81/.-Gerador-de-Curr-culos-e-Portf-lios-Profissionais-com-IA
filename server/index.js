const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const aiService = require('./services/aiService');
const atsOptimizer = require('./services/atsOptimizer');
const pdfGenerator = require('./services/pdfGenerator');
const docxGenerator = require('./services/docxGenerator');
const jobMatcher = require('./services/jobMatcher');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de segurança
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requests por IP
});
app.use(limiter);

// Rotas principais
app.get('/', (req, res) => {
  res.json({ 
    message: 'Gerador de Currículos IA API',
    version: '1.0.0',
    status: 'online'
  });
});

// Rota para otimização com IA
app.post('/api/optimize', async (req, res) => {
  try {
    const { content, jobDescription, targetRole } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Conteúdo do currículo é obrigatório' });
    }

    const optimizedContent = await aiService.optimizeResume(content, jobDescription, targetRole);
    
    res.json({
      success: true,
      original: content,
      optimized: optimizedContent,
      improvements: await aiService.getImprovementSuggestions(content, optimizedContent)
    });
  } catch (error) {
    console.error('Erro na otimização:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para análise ATS
app.post('/api/ats-analysis', async (req, res) => {
  try {
    const { content, jobDescription } = req.body;
    
    const analysis = await atsOptimizer.analyze(content, jobDescription);
    
    res.json({
      success: true,
      score: analysis.score,
      suggestions: analysis.suggestions,
      keywords: analysis.keywords,
      missingKeywords: analysis.missingKeywords
    });
  } catch (error) {
    console.error('Erro na análise ATS:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para geração de PDF
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { content, template, options } = req.body;
    
    const pdfBuffer = await pdfGenerator.generate(content, template, options);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=curriculo.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erro na geração do PDF:', error);
    res.status(500).json({ error: 'Erro na geração do PDF' });
  }
});

// Rota para geração de DOCX
app.post('/api/generate-docx', async (req, res) => {
  try {
    const { content, template, options } = req.body;
    
    const docxBuffer = await docxGenerator.generate(content, template, options);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=curriculo.docx');
    res.send(docxBuffer);
  } catch (error) {
    console.error('Erro na geração do DOCX:', error);
    res.status(500).json({ error: 'Erro na geração do DOCX' });
  }
});

// Rota para análise de compatibilidade com vagas
app.post('/api/job-match', async (req, res) => {
  try {
    const { resume, jobListings } = req.body;
    
    const matches = await jobMatcher.analyzeMatches(resume, jobListings);
    
    res.json({
      success: true,
      matches: matches,
      recommendations: await jobMatcher.getRecommendations(resume, matches)
    });
  } catch (error) {
    console.error('Erro na análise de compatibilidade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter templates disponíveis
app.get('/api/templates', (req, res) => {
  const templates = [
    {
      id: 'modern',
      name: 'Moderno',
      description: 'Design limpo e profissional',
      preview: '/templates/modern-preview.png'
    },
    {
      id: 'classic',
      name: 'Clássico',
      description: 'Estilo tradicional e elegante',
      preview: '/templates/classic-preview.png'
    },
    {
      id: 'creative',
      name: 'Criativo',
      description: 'Design inovador para áreas criativas',
      preview: '/templates/creative-preview.png'
    },
    {
      id: 'minimal',
      name: 'Minimalista',
      description: 'Simples e direto ao ponto',
      preview: '/templates/minimal-preview.png'
    }
  ];
  
  res.json({ templates });
});

// Rota para obter dicas de otimização
app.get('/api/optimization-tips', (req, res) => {
  const tips = [
    {
      category: 'ATS',
      tips: [
        'Use palavras-chave específicas da vaga',
        'Evite formatações complexas',
        'Use títulos claros e descritivos',
        'Inclua números e métricas quantificáveis'
      ]
    },
    {
      category: 'Conteúdo',
      tips: [
        'Seja específico sobre suas realizações',
        'Use verbos de ação no passado',
        'Mantenha o foco em resultados',
        'Adapte o conteúdo para cada vaga'
      ]
    },
    {
      category: 'Estrutura',
      tips: [
        'Mantenha o currículo em 1-2 páginas',
        'Organize as informações por relevância',
        'Use seções claras e bem definidas',
        'Inclua informações de contato atualizadas'
      ]
    }
  ];
  
  res.json({ tips });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

// Rota para verificar saúde da API
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 API disponível em http://localhost:${PORT}`);
  console.log(`🔧 Modo: ${process.env.NODE_ENV || 'development'}`);
}); 