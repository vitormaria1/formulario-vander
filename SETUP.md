# Setup & Deploy - Formulário Pré-Sessão

## 🚀 Quick Start

### Instalação Local
```bash
cd /Users/vitormaria/Desktop/formulario-vander
npm install
npm run dev
```

Abre em: http://localhost:5173

### Variáveis de Ambiente

Criar `.env.local` (não commitado no git):

```env
VITE_UAZAPI_BASE_URL=https://varia.uazapi.com
VITE_UAZAPI_TOKEN=dfe5c844-a39e-4ab6-9223-dcf40b442e1d
VITE_WHATSAPP_DESTINATION=554899298643
```

## 📋 Fluxo Funcionário

### Tela 01 — Capa
- Foto: Vander (Supabase CDN)
- Título editorial: "ANTES DA PRIMEIRA SESSÃO, ALGUMAS PERGUNTAS"
- Botão: "COMEÇAR →"

### Telas 02–18 — Perguntas (1 por tela)

#### Obrigatórias
- **02.** E-mail
- **03.** Nome completo (min 3 chars)
- **04.** Número para contato (DDD + XXXXXXXXX)
- **16.** O que te faz buscar terapia?
- **17.** Objetivos (3 meses)

#### Opcionais
- **05.** Idade
- **06.** Data de nascimento
- **07.** Endereço (CEP)
- **08.** Religião
- **09.** Estado civil (dropdown)
- **10.** Profissão
- **11.** Renda média (dropdown)
- **12.** Histórico de terapia
- **13.** Diagnósticos
- **14.** Medicações
- **15.** Rotina diária
- **18.** Observações adicionais

**Botões:**
- "← VOLTAR" (a partir tela 02)
- "AVANÇAR →" (telas 02–17)
- "ENVIAR RESPOSTAS →" (tela 18)

### Tela 19 — Confirmação
- Foto: Vander
- Mensagem: "RESPOSTAS RECEBIDAS. NOS FALAMOS EM BREVE"
- Monograma "VM" em bordô no rodapé

## 🔐 Segurança

- `.env.local` está em `.gitignore` (nunca commitado)
- Token da uazAPI protegido em variáveis de ambiente
- Dados enviados direto ao WhatsApp (sem banco de dados local)
- Validação client-side previne spam/dados inválidos

## 📦 Build para Produção

```bash
npm run build
```

Gera pasta `dist/` com arquivos otimizados.

### Deploy Opções

#### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
npm run build
# Copiar conteúdo de dist/ para gh-pages branch
```

## 🔧 Customização

### Mudar Foto
Editar `src/components/CoverScreen.jsx` e `ConfirmationScreen.jsx`:
```javascript
const PHOTO_URL = 'https://sua-url-aqui.jpg';
```

### Mudar Cores
Editar `src/styles/colors.css`:
```css
--color-background: #F4F0E8;      /* off-white */
--color-text-primary: #1A1A1A;    /* charcoal */
--color-accent: #7A1C1C;          /* bordô */
```

### Mudar Perguntas
Editar `src/hooks/useFormState.js` — array `QUESTIONS`:
```javascript
{ 
  id: 'fieldName', 
  label: 'Pergunta aqui?', 
  type: 'text|textarea|select|date|email|tel|number',
  required: true/false,
  options: ['opção1', 'opção2'] // apenas para select
}
```

### Mudar Destino WhatsApp
Editar `.env.local`:
```env
VITE_WHATSAPP_DESTINATION=554899298643
```

## 🐛 Troubleshooting

### "Token da uazAPI não configurado"
- Verificar `.env.local` existe
- Verificar `VITE_UAZAPI_TOKEN` preenchido
- Reiniciar servidor: `npm run dev`

### Mensagem não chega no WhatsApp
- Verificar token correto em `.env.local`
- Verificar número destino: `554899298643`
- Verificar conectividade/firewall
- Testar em DevTools → Network tab (verificar response da API)

### Validação não funciona
- Limpar cache: `Ctrl+F5` ou `Cmd+Shift+R`
- Verificar console (F12 → Console) por erros
- Testar campo em DevTools

### Foto não carrega
- Verificar URL da Supabase está correta
- Testar URL no navegador diretamente
- Verificar CORS headers

## 📊 Monitoramento

### DevTools (F12)
- **Network:** Verificar request/response da uazAPI
- **Console:** Logs de erro
- **Elements:** Inspecionar styling
- **Application:** Verificar localStorage (se usado)

### Analytics (Opcional)
Adicionar Google Analytics no `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

## 📞 Suporte

**Problemas?**
1. Verificar TESTING.md para checklist manual
2. Verificar CHANGELOG.md para alterações recentes
3. Inspecionar Network tab no DevTools
4. Verificar console para mensagens de erro

## 🎯 Performance

- ⚡ Vite dev server: hot reload em <100ms
- 📦 Build otimizado com tree-shaking
- 🖼️ Foto comprimida via Supabase CDN
- ⚙️ Zero banco de dados (stateless)

## 📝 Logs

Ao enviar respostas, console mostra:
```javascript
// Sucesso:
"Respostas enviadas com sucesso!"

// Erro:
"Erro ao enviar: 401 - Unauthorized"
"Erro ao enviar: Network timeout"
```
