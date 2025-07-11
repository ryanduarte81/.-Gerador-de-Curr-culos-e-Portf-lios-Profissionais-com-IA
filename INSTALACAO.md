# 🚀 Guia de Instalação - Gerador de Currículos IA

## Pré-requisitos

- Node.js 16+ 
- npm ou yarn
- Chave da API OpenAI

## 📋 Passo a Passo

### 1. Clone o Repositório
```bash
git clone [url-do-repositorio]
cd gerador-curriculos-ia
```

### 2. Instale as Dependências
```bash
# Instala todas as dependências (root, server e client)
npm run install-all
```

### 3. Configure as Variáveis de Ambiente

#### Backend
```bash
cd server
cp env.example .env
```

Edite o arquivo `.env` e adicione sua chave da OpenAI:
```env
OPENAI_API_KEY=sua_chave_api_openai_aqui
PORT=5000
NODE_ENV=development
```

### 4. Inicie o Desenvolvimento
```bash
# Volte para a pasta raiz
cd ..

# Inicie ambos os servidores (backend e frontend)
npm run dev
```

O sistema estará disponível em:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🔧 Configurações Adicionais

### Obter Chave da OpenAI
1. Acesse https://platform.openai.com/
2. Crie uma conta ou faça login
3. Vá para "API Keys"
4. Crie uma nova chave
5. Copie a chave para o arquivo `.env`

### Configurações de Desenvolvimento

#### Backend (Porta 5000)
- API REST com Express
- Integração com OpenAI
- Geração de PDF/DOCX
- Análise ATS
- Rate limiting

#### Frontend (Porta 3000)
- React com TypeScript
- Tailwind CSS
- Design responsivo
- Componentes modulares

## 📱 Funcionalidades

### ✅ Implementadas
- [x] Construtor de currículos
- [x] Otimização com IA
- [x] Análise ATS
- [x] Match de vagas
- [x] Templates profissionais
- [x] Geração de PDF/DOCX
- [x] Design responsivo
- [x] Interface moderna

### 🔄 Em Desenvolvimento
- [ ] Sistema de usuários
- [ ] Salvamento de currículos
- [ ] Mais templates
- [ ] Integração com LinkedIn
- [ ] Análise de portfólios

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia backend + frontend
npm run server       # Apenas backend
npm run client       # Apenas frontend

# Build
npm run build        # Build do frontend

# Instalação
npm run install-all  # Instala todas as dependências
```

## 🐛 Solução de Problemas

### Erro de CORS
Se houver problemas de CORS, verifique se o backend está rodando na porta 5000.

### Erro da OpenAI
- Verifique se a chave da API está correta
- Confirme se tem créditos na conta OpenAI
- Verifique se a chave tem permissões adequadas

### Problemas de Dependências
```bash
# Limpe o cache do npm
npm cache clean --force

# Delete node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

## 📊 Estrutura do Projeto

```
gerador-curriculos-ia/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── App.tsx        # App principal
│   │   └── index.tsx      # Entry point
│   └── package.json
├── server/                 # Backend Node.js
│   ├── services/          # Serviços (IA, ATS, etc.)
│   ├── index.js           # Servidor principal
│   └── package.json
├── templates/             # Templates HTML
├── package.json           # Root package.json
└── README.md
```

## 🚀 Deploy

### Vercel (Frontend)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Heroku (Backend)
1. Crie um app no Heroku
2. Conecte o repositório
3. Configure as variáveis de ambiente
4. Deploy

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação da API
- Verifique os logs do servidor

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes. 