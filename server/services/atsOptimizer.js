const natural = require('natural');
const nlp = require('compromise');

class ATSOptimizer {
  constructor() {
    this.commonKeywords = {
      'desenvolvimento': ['javascript', 'python', 'java', 'react', 'node.js', 'sql', 'git'],
      'marketing': ['seo', 'google ads', 'facebook ads', 'analytics', 'content marketing'],
      'vendas': ['crm', 'prospecção', 'negociação', 'fechamento', 'pipeline'],
      'administrativo': ['excel', 'powerpoint', 'word', 'gestão', 'organização']
    };
  }

  async analyze(content, jobDescription = '') {
    const keywords = this.extractKeywords(content);
    const jobKeywords = jobDescription ? this.extractKeywords(jobDescription) : [];
    
    const score = this.calculateATSScore(content, keywords, jobKeywords);
    const suggestions = this.generateSuggestions(content, keywords, jobKeywords);
    
    return {
      score,
      keywords: keywords.slice(0, 10),
      missingKeywords: this.findMissingKeywords(keywords, jobKeywords),
      suggestions
    };
  }

  extractKeywords(text) {
    const tokens = new natural.WordTokenizer().tokenize(text.toLowerCase());
    const stopwords = natural.stopwords;
    
    return tokens
      .filter(token => 
        token.length > 2 && 
        !stopwords.includes(token) &&
        !/^\d+$/.test(token)
      )
      .map(token => natural.PorterStemmer.stem(token));
  }

  calculateATSScore(content, keywords, jobKeywords) {
    let score = 0;
    
    // Pontuação base
    score += Math.min(keywords.length * 2, 40);
    
    // Palavras-chave específicas da vaga
    if (jobKeywords.length > 0) {
      const matches = keywords.filter(k => jobKeywords.includes(k));
      score += (matches.length / jobKeywords.length) * 40;
    }
    
    // Formatação
    if (content.includes('•') || content.includes('-')) score += 10;
    if (content.match(/\d+/g)) score += 10;
    
    return Math.min(Math.round(score), 100);
  }

  generateSuggestions(content, keywords, jobKeywords) {
    const suggestions = [];
    
    if (keywords.length < 15) {
      suggestions.push('Adicione mais palavras-chave específicas da sua área');
    }
    
    if (jobKeywords.length > 0) {
      const missing = this.findMissingKeywords(keywords, jobKeywords);
      if (missing.length > 0) {
        suggestions.push(`Inclua estas palavras-chave: ${missing.slice(0, 5).join(', ')}`);
      }
    }
    
    if (!content.match(/\d+/g)) {
      suggestions.push('Quantifique suas realizações com números');
    }
    
    if (!content.includes('•') && !content.includes('-')) {
      suggestions.push('Use marcadores para melhorar a legibilidade');
    }
    
    return suggestions;
  }

  findMissingKeywords(resumeKeywords, jobKeywords) {
    return jobKeywords.filter(keyword => !resumeKeywords.includes(keyword));
  }
}

module.exports = new ATSOptimizer(); 