const natural = require('natural');

class JobMatcher {
  async analyzeMatches(resume, jobListings) {
    try {
      const resumeKeywords = this.extractKeywords(resume);
      const matches = [];

      for (const job of jobListings) {
        const jobKeywords = this.extractKeywords(job.description);
        const matchScore = this.calculateMatchScore(resumeKeywords, jobKeywords);
        
        matches.push({
          job: job,
          score: matchScore,
          matchedKeywords: this.findMatchedKeywords(resumeKeywords, jobKeywords),
          missingKeywords: this.findMissingKeywords(resumeKeywords, jobKeywords)
        });
      }

      return matches.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Erro na análise de compatibilidade:', error);
      throw new Error('Falha na análise de compatibilidade');
    }
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

  calculateMatchScore(resumeKeywords, jobKeywords) {
    if (jobKeywords.length === 0) return 0;
    
    const matches = resumeKeywords.filter(keyword => jobKeywords.includes(keyword));
    return Math.round((matches.length / jobKeywords.length) * 100);
  }

  findMatchedKeywords(resumeKeywords, jobKeywords) {
    return resumeKeywords.filter(keyword => jobKeywords.includes(keyword));
  }

  findMissingKeywords(resumeKeywords, jobKeywords) {
    return jobKeywords.filter(keyword => !resumeKeywords.includes(keyword));
  }

  async getRecommendations(resume, matches) {
    const recommendations = [];
    
    if (matches.length === 0) {
      recommendations.push('Nenhuma vaga encontrada para análise de compatibilidade.');
      return recommendations;
    }

    const topMatch = matches[0];
    
    if (topMatch.score >= 80) {
      recommendations.push('Excelente compatibilidade! Esta vaga é uma ótima opção.');
    } else if (topMatch.score >= 60) {
      recommendations.push('Boa compatibilidade. Considere adaptar seu currículo para melhorar as chances.');
    } else {
      recommendations.push('Compatibilidade baixa. Considere buscar vagas mais alinhadas com seu perfil.');
    }

    if (topMatch.missingKeywords.length > 0) {
      recommendations.push(`Palavras-chave importantes para incluir: ${topMatch.missingKeywords.slice(0, 5).join(', ')}`);
    }

    return recommendations;
  }
}

module.exports = new JobMatcher(); 