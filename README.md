# 🎓 Gerador de Currículos e Portfólios Profissionais com IA

Um sistema completo para criação de currículos otimizados por IA, portfólios personalizados e análise de compatibilidade com vagas.

## ✨ Funcionalidades

- 🤖 **IA Integrada**: Otimização automática de currículos
- 📱 **Design Responsivo**: Versão mobile otimizada
- 🎯 **Otimização ATS**: Compatível com sistemas de recrutamento
- 📊 **Análise de Compatibilidade**: Match com vagas disponíveis
- 🎨 **Templates Personalizáveis**: Múltiplos estilos profissionais
- 📄 **Exportação Multi-formato**: PDF, DOCX, HTML
- 🔒 **Privacidade**: Dados locais, sem armazenamento externo

## 🚀 Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]
cd gerador-curriculos-ia

# Instale todas as dependências
npm run install-all

# Inicie o desenvolvimento
npm run dev
```

## 📁 Estrutura do Projeto

```
gerador-curriculos-ia/
├── client/                 # Frontend React
├── server/                 # Backend Node.js
├── templates/              # Templates de currículo
└── docs/                   # Documentação
```

## 🛠️ Tecnologias

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, OpenAI API
- **IA**: GPT-4 para otimização de conteúdo
- **Banco**: SQLite (local)
- **Exportação**: Puppeteer, jsPDF

## 📱 Uso

1. Acesse `http://localhost:3000`
2. Preencha suas informações profissionais
3. Escolha um template
4. Use a IA para otimizar o conteúdo
5. Analise a compatibilidade com vagas
6. Exporte em PDF ou DOCX

## 🔧 Configuração

Crie um arquivo `.env` na pasta `server/`:

```env
OPENAI_API_KEY=sua_chave_api_aqui
PORT=5000
```

## 📄 Licença

MIT License 