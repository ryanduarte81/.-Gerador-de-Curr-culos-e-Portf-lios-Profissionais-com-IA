const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  async optimizeResume(content, jobDescription = '', targetRole = '') {
    try {
      const prompt = this.buildOptimizationPrompt(content, jobDescription, targetRole);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em recrutamento e otimização de currículos. Sua tarefa é melhorar currículos para maximizar as chances de aprovação em sistemas ATS e entrevistas."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Erro na otimização com IA:', error);
      throw new Error('Falha na otimização do currículo');
    }
  }

  buildOptimizationPrompt(content, jobDescription, targetRole) {
    let prompt = `Otimize o seguinte currículo para melhorar sua eficácia:\n\n${content}\n\n`;

    if (jobDescription) {
      prompt += `Descrição da vaga alvo:\n${jobDescription}\n\n`;
    }

    if (targetRole) {
      prompt += `Cargo alvo: ${targetRole}\n\n`;
    }

    prompt += `Instruções de otimização:
    1. Mantenha todas as informações importantes
    2. Use palavras-chave relevantes para ATS
    3. Melhore a clareza e impacto das descrições
    4. Quantifique realizações quando possível
    5. Use verbos de ação no passado
    6. Mantenha o formato profissional
    7. Adapte o conteúdo para a vaga específica (se fornecida)
    
    Retorne apenas o currículo otimizado, sem explicações adicionais.`;

    return prompt;
  }

  async getImprovementSuggestions(original, optimized) {
    try {
      const prompt = `Compare o currículo original com o otimizado e forneça 3-5 sugestões específicas de melhoria:

      Original: ${original}
      
      Otimizado: ${optimized}
      
      Forneça sugestões práticas e específicas para melhorar ainda mais o currículo.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um consultor de carreira especializado em currículos."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      return 'Não foi possível gerar sugestões no momento.';
    }
  }

  async analyzeResumeStrength(content) {
    try {
      const prompt = `Analise a força do seguinte currículo e forneça uma pontuação de 1-10 e feedback detalhado:

      ${content}

      Considere:
      - Clareza e organização
      - Relevância das experiências
      - Quantificação de realizações
      - Palavras-chave apropriadas
      - Formato profissional`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em análise de currículos."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Erro na análise de força:', error);
      throw new Error('Falha na análise do currículo');
    }
  }

  async generateCoverLetter(resume, jobDescription) {
    try {
      const prompt = `Com base no currículo e na descrição da vaga, gere uma carta de apresentação persuasiva:

      Currículo: ${resume}
      
      Descrição da vaga: ${jobDescription}
      
      A carta deve:
      1. Ser personalizada para a vaga específica
      2. Destacar experiências relevantes
      3. Mostrar entusiasmo pela oportunidade
      4. Ter tom profissional mas acessível
      5. Ser concisa (máximo 300 palavras)`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em escrita de cartas de apresentação."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 600
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Erro na geração da carta:', error);
      throw new Error('Falha na geração da carta de apresentação');
    }
  }
}

module.exports = new AIService(); 