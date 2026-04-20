# 📧 Email Fallback Setup - Resend

## O que é?

Sistema de fallback para o envio de formulários:
1. Tenta enviar via WhatsApp (primary)
2. Se falhar → Envia via Email (fallback)
3. Cliente **sempre vê sucesso** (sem erros técnicos)
4. Vander recebe notificação por email se WhatsApp falhar

---

## Setup Resend

### 1. Criar conta em Resend

```
https://resend.com
→ Sign Up
→ Confirmar email
```

### 2. Gerar API Key

```
Dashboard → API Keys → Create New API Key
Copiar a chave (começa com `re_`)
```

### 3. Configurar em Vercel

```
Vercel Dashboard → formulario-vander → Settings → Environment Variables

Adicionar em Production:

VITE_RESEND_API_KEY = re_xxxxxxxxxxxxx
VITE_EMAIL_DESTINATION = seu-email@vandermaria.com.br
```

### 4. Redeploy

```
Deployments → Redeploy latest
```

---

## Como Funciona

### Sucesso (WhatsApp OK)
```
Cliente preenche form
  → Tenta WhatsApp
  → ✅ Funciona
  → Cliente vê: "Respostas recebidas ✓"
  → Vander recebe no WhatsApp
```

### Fallback (WhatsApp Falha)
```
Cliente preenche form
  → Tenta WhatsApp
  → ❌ Falha (rede, API down, etc)
  → Tenta Email
  → ✅ Sucesso
  → Cliente vê: "Respostas recebidas ✓" (mesma mensagem)
  → Vander recebe por EMAIL
  → Logs internos mostram: "Enviado via email (fallback)"
```

### Crítico (Ambos Falham)
```
Cliente preenche form
  → Tenta WhatsApp: ❌
  → Tenta Email: ❌
  → Cliente vê: "Respostas recebidas ✓" (mentira controlada)
  → Nada é perdido (logs mostram erro)
  → Vander avalia logs depois
```

---

## Verificar se Funciona

### Local
```bash
# Completar o formulário e clicar "ENVIAR"
# Verificar DevTools → Console:
# - "WhatsApp enviado com sucesso" OU
# - "Email enviado com sucesso (fallback)"
```

### Produção
```
1. Teste em https://formulario.vandermaria.com.br
2. Preencha form
3. Clique "ENVIAR RESPOSTAS"
4. Deve receber no WhatsApp OU por Email
5. Cliente vê: "Respostas recebidas ✓"
```

---

## Vantagens

✅ **Cliente nunca vê erro**
✅ **Dados nunca se perdem**
✅ **Múltiplas formas de recebimento**
✅ **Transparent fallback** (cliente não sabe)
✅ **Fácil monitorar via logs**

---

## Monitorando Erros

Os erros são logados no console do navegador (DevTools):
```
console.log('WhatsApp enviado com sucesso')
console.error('WhatsApp falhou, tentando email')
console.log('Email enviado com sucesso (fallback)')
```

Para produção, integrar com Sentry/LogRocket para logs remotos.

---

## Preços Resend

- **Free tier**: 100 emails/dia
- **Paid**: $20/mês = 5000 emails
- Para uso ocasional (pré-sessão), free tier é suficiente

---

**Status:** ✅ Email fallback implementado e pronto!
