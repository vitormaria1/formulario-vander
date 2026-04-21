# ✅ Setup Final - Sistema de Fila 100% Pronto

## 📊 Status Atual

✅ **Feito Automaticamente:**
- MCP Supabase configurado
- Services criados (queue, whatsapp)
- Edge Function pronta
- .env.local configurado
- Deploy scripts prontos

⏳ **Falta 3 passos NO SUPABASE DASHBOARD:**

---

## 🎯 PASSO 1: Criar Tabela (2 min)

### Abrir SQL Editor

```
Supabase Dashboard:
https://app.supabase.com/project/jfltbluknvirjoizhavf

Menu Esquerda → SQL Editor
→ New Query
```

### Copiar e Executar SQL

```bash
cat create-table.sql
```

Copie TODO o conteúdo e cole no editor branco do Supabase.

Clique: **▶ Execute** (botão azul)

Deve aparecer: `Query executed successfully`

**✅ Tabela criada!**

---

## 🔄 PASSO 2: Deploy Edge Function (3 min)

### Criar Function

```
Menu Esquerda → Edge Functions
→ Create a new function
```

Preencha:
```
Name: process-queue
Runtime: Deno (padrão)
Authentication: User (padrão)
→ Create function
```

### Copiar Código

```bash
cat supabase/functions/process-queue/index.ts
```

Copie TODO o conteúdo.

### Colar no Editor

Na página que abriu:
- Delete o código de exemplo
- Cole o código `supabase/functions/process-queue/index.ts`
- Clique: **Deploy** (botão verde)

Deve aparecer: `✅ Function deployed successfully`

### Adicionar Variáveis

```
Edge Functions → Settings → Environment Variables

Adicionar:

VITE_UAZAPI_TOKEN = dfe5c844-a39e-4ab6-9223-dcf40b442e1d
VITE_UAZAPI_BASE_URL = https://varia.uazapi.com
```

**✅ Function deployada!**

---

## ⏰ PASSO 3: Agendar Cron (2 min)

### Criar Cron

```
Menu Esquerda → Cron Jobs
→ Create a new cron
```

Preencha:
```
Name: Process Submission Queue
Function: process-queue (dropdown)
Schedule: 0 */5 * * * *
```

Clique: **Save**

**✅ Cron agendado! Vai rodar a cada 5 minutos**

---

## 🧪 PASSO 4: Testar Localmente (3 min)

### Terminal 1 - Iniciar Dev Server

```bash
npm run dev
```

Vai abrir em http://localhost:5173

### Browser - Testar Formulário

```
1. Preencha o formulário
2. Na pergunta de WhatsApp, coloque qualquer número
3. Clique "ENVIAR RESPOSTAS"
4. Deve aparecer: "Respostas recebidas ✓"
5. Volte para a pergunta anterior e clique "AVANÇAR"
   (ou aguarde 2 segundos)
6. Deve ir para tela de confirmação "VM"
```

### Verificar na Fila

```bash
# Terminal 2:
bash test-queue.sh
```

Deve aparecer:
```
✅ Total de items: 1
   📍 Pending: 1
   ✅ Processed: 0
   ❌ Failed: 0
```

**✅ Fila funcionando!**

---

## 🚀 PASSO 5: Deploy em Produção (1 min)

### Git

```bash
git add .
git commit -m "Add Supabase queue system"
git push
```

Vercel fará deploy automaticamente.

### Adicionar Variáveis em Produção

**Vercel Dashboard:**
```
Projeto → Settings → Environment Variables

Adicionar:

VITE_SUPABASE_URL = https://jfltbluknvirjoizhavf.supabase.co
VITE_SUPABASE_ANON_KEY = [copiar de .env.local]
```

**✅ Produção pronta!**

---

## 📋 Checklist Final

- [ ] Passo 1: Tabela criada (execute SQL no Dashboard)
- [ ] Passo 2: Function deployada (Edge Functions)
- [ ] Passo 3: Cron agendado (a cada 5 min)
- [ ] Passo 4: Testado localmente (npm run dev + test-queue.sh)
- [ ] Passo 5: Deployado em produção (git push + env vars)

---

## 🎉 Resultado Final

### Cliente Preenche Formulário

```
✅ Cenário 1: WhatsApp OK
  → Cliente vê: "Respostas recebidas ✓"
  → Vander recebe no WhatsApp IMEDIATAMENTE

❌ Cenário 2: WhatsApp Falha
  → Cliente vê: "Respostas recebidas ✓" (sem saber!)
  → Dados salvos em fila Supabase
  → Cron job processa a cada 5 minutos
  → Tenta WhatsApp novamente (até 5 vezes)
  → Vander recebe no WhatsApp quando conseguir
  → Admin pode monitorar em Supabase Dashboard
```

---

## 🆘 Help

**Erro ao criar tabela?**
→ Copie `create-table.sql` inteiro, sem deixar nada para trás

**Function não deploy?**
→ Copie `supabase/functions/process-queue/index.ts` INTEIRO

**Teste não funciona?**
→ Verifique se `npm run dev` está rodando
→ Abra DevTools → Console para ver erros

**Cron não roda?**
→ Aguarde 5 minutos
→ Ou clique "Run now" no Dashboard

---

**⏱️ Tempo Total: ~10 minutos**

**Após completar: Sistema 100% automático! 🚀**
