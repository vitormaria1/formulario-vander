# Quick Links - Formulário Pré-Sessão

## 🔗 URLs Importantes

### Local Development
- **App:** http://localhost:5173
- **DevTools:** F12 (Chrome/Firefox) ou Cmd+Option+I (Safari)

### Produção (Após Deploy)
- **Vercel:** https://seu-projeto.vercel.app
- **Netlify:** https://seu-projeto.netlify.app
- **GitHub Pages:** https://seu-usuario.github.io/seu-repo

### Recursos Externos

#### Foto (Supabase CDN)
```
https://jfltbluknvirjoizhavf.supabase.co/storage/v1/object/public/vander/WhatsApp%20Image%202026-04-17%20at%2022.28.38.jpeg
```

#### API WhatsApp (uazAPI)
```
https://varia.uazapi.com
Endpoint: POST /send/text
```

#### Fontes (Google Fonts)
```
https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700
```

---

## 📁 Arquivos Críticos

### Código Principal
- `src/App.jsx` — Lógica principal, orquestração
- `src/components/FormScreen.jsx` — Tela de perguntas
- `src/hooks/useFormState.js` — State management
- `src/services/whatsappService.js` — Integração WhatsApp

### Configuração
- `.env.local` — Credenciais (NUNCA commitar)
- `vite.config.js` — Config Vite
- `index.html` — HTML principal
- `package.json` — Dependencies

### Documentação
- `README.md` — Visão geral
- `SETUP.md` — Setup e deploy
- `TESTING.md` — Checklist de testes
- `CHANGELOG.md` — Histórico de mudanças
- `PROJECT_SUMMARY.md` — Resumo completo

---

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Preview build local
npm run preview

# Instalar dependências
npm install

# Ver versão Node/npm
node --version && npm --version

# Limpar cache (se necessário)
rm -rf node_modules package-lock.json
npm install
```

---

## 🔑 Credenciais

⚠️ **NUNCA compartilhar publicamente!**

### Configuração em `.env.local`
```env
VITE_UAZAPI_BASE_URL=https://varia.uazapi.com
VITE_UAZAPI_TOKEN=dfe5c844-a39e-4ab6-9223-dcf40b442e1d
VITE_WHATSAPP_DESTINATION=554899298643
```

### Se precisar resetar credenciais:
1. Gerar novo token em: https://www.uazapi.com
2. Atualizar `.env.local`
3. Reiniciar servidor: `npm run dev`

---

## 📞 WhatsApp Destino

```
País: Brasil
DDD: 48 (Santa Catarina)
Número: 99298-6643
Formato WhatsApp: 554899298643
```

---

## 🧪 Teste Rápido

### Via curl (verificar API)
```bash
curl -X POST https://varia.uazapi.com/send/text \
  -H "token: dfe5c844-a39e-4ab6-9223-dcf40b442e1d" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "554899298643",
    "text": "Teste de mensagem"
  }'
```

### Via navegador (verificar app)
1. Abrir http://localhost:5173
2. Clicar "COMEÇAR →"
3. Preencher campo E-mail com `teste@email.com`
4. Botão "AVANÇAR →" deve ficar ativo
5. Continuar até final e clicar "ENVIAR RESPOSTAS →"
6. Verificar WhatsApp em 48 99298-6643

---

## 🎯 Stack Overview

```
┌─────────────────────────────────────┐
│    Landing Page Pré-Sessão          │
│    (React + Vite)                   │
└────────────┬────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
   Frontend     Backend
   (React)      (uazAPI)
      │             │
      ├─────────────┴─────────────┐
      │                           │
   Validação               WhatsApp
   (client-side)          (554899298643)
      │
  Rendering
  (DOM)
```

---

## 📊 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Chrome/Safari
- ⚠️ IE 11 (não suportado)

---

## 🔍 Debug Checklist

- [ ] `.env.local` existe e está preenchido?
- [ ] `npm install` foi executado?
- [ ] `npm run dev` está rodando?
- [ ] Servidor em http://localhost:5173?
- [ ] DevTools abertos (F12)?
- [ ] Network tab mostra request à uazAPI?
- [ ] Console sem erros JavaScript?
- [ ] Foto de Vander está carregando?
- [ ] Máscara de telefone está formatando?

---

## 📈 Performance Monitoring

### Via Chrome DevTools
1. F12 → Performance tab
2. Clicar "Record"
3. Navegar pelo form
4. Parar gravação
5. Analisar: FCP, LCP, CLS

### Via Lighthouse (DevTools)
1. F12 → Lighthouse tab
2. "Generate report"
3. Verificar scores: Performance, Accessibility, Best Practices

---

## 🚨 SOS — Problemas Comuns

| Problema | Solução |
|----------|---------|
| Servidor não inicia | `npm install` + `npm run dev` |
| Porta 5173 em uso | `lsof -i :5173` depois `kill -9 PID` |
| Módulos not found | `rm -rf node_modules` + `npm install` |
| Foto não carrega | Verificar URL Supabase correta |
| WhatsApp não recebe | Verificar token + destino em `.env.local` |
| Página em branco | Check DevTools Console por erros |

---

## 📞 Contato & Suporte

**Desenvolvedor:** Claude Code (Anthropic)
**Projeto:** Landing Page Pré-Sessão Vander
**Data:** 2026-04-19
**Status:** ✅ Completo

Para reportar bugs ou sugestões:
1. Verificar TESTING.md
2. Checar DevTools Console
3. Testar em navegador diferente
4. Revisar CHANGELOG.md para mudanças recentes

---

## ✨ Resumo

```
Projeto:      Formulário Pré-Sessão Vander
Stack:        React 19 + Vite 8
Status:       ✅ Produção
Dev URL:      http://localhost:5173
Build:        npm run build
Deploy:       Vercel / Netlify / GitHub Pages
WhatsApp:     554899298643 (uazAPI)
Foto:         Supabase CDN
Docs:         4 arquivos README/SETUP/TESTING/CHANGELOG
```

---

**Tudo pronto para lançar! 🚀**
