# Formulário Pré-Sessão | Vander

Landing page interativa para coleta de dados pré-terapêuticos com integração WhatsApp.

## 🚀 Início Rápido

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

Abre automaticamente em http://localhost:5173

### Build para Produção
```bash
npm run build
```

## 📋 Fluxo

1. **Tela de Capa** — "Antes da primeira sessão, algumas perguntas"
2. **17 Perguntas** — Uma por tela, com validação
3. **Tela de Confirmação** — "Respostas recebidas. Nos falamos em breve"

## ⚙️ Configuração

Crie um `.env.local` (baseado em `.env.example`):

```env
VITE_UAZAPI_BASE_URL=https://varia.uazapi.com
VITE_UAZAPI_TOKEN=seu_token_aqui
VITE_WHATSAPP_DESTINATION=554899298643
```

## 🎨 Design

- **Paleta:** Off-white (#F4F0E8), Charcoal (#1A1A1A), Bordô (#7A1C1C)
- **Tipografia:** Bebas Neue (títulos), Inter (corpo)
- **Botões:** Bordô com cantos retos, UPPERCASE

## 📁 Estrutura

```
src/
├── components/          # React components
│   ├── CoverScreen.jsx
│   ├── FormScreen.jsx
│   └── ConfirmationScreen.jsx
├── services/            # API integration
│   └── whatsappService.js
├── hooks/               # Custom hooks
│   └── useFormState.js
├── styles/              # Global styles
│   ├── colors.css
│   └── global.css
├── App.jsx
└── main.jsx
```

## ✅ Perguntas do Formulário

1. E-mail (obrigatório)
2. Nome completo (obrigatório)
3. Número para contato (obrigatório)
4. Idade
5. Data de nascimento
6. Endereço (CEP)
7. Religião
8. Estado civil
9. Profissão
10. Renda média
11. Histórico de terapia
12. Diagnósticos
13. Medicações
14. Rotina
15. Motivo da terapia (obrigatório)
16. Objetivos (3 meses) (obrigatório)
17. Observações adicionais

## 🔗 Integração WhatsApp

As respostas são enviadas via uazAPI para o WhatsApp do terapeuta com formatação legível.

Mensagem inclui:
- Dados pessoais
- Histórico médico
- Motivos e objetivos
- Timestamp do envio

## 🛠️ Desenvolvimento

Componentes usam styled-jsx para estilos scoped. CSS global em `src/styles/`.

Estado gerenciado com React hooks no `useFormState.js`.

Validação client-side antes de avançar ou enviar.
