# 🔄 Supabase Queue Setup - Fila de Processamento

## O que é?

Sistema de fila para garantir entrega de formulários mesmo quando WhatsApp falha:
1. Tenta enviar via WhatsApp (primary)
2. Se falhar → Salva na fila Supabase (fallback)
3. Cliente **sempre vê sucesso** (sem erros técnicos)
4. Background job processa fila periodicamente
5. Retry automático com até 5 tentativas

---

## Setup Supabase

### 1. Criar conta e projeto

```
https://supabase.com
→ Sign Up / Log In
→ New Project → Escolher região Brasil
```

### 2. Configurar variáveis de ambiente

```
.env.local:

VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Encontrar em: Supabase Dashboard → Project Settings → API

### 3. Criar tabela `submission_queue`

Via SQL Editor no Supabase:

```sql
CREATE TABLE submission_queue (
  id BIGSERIAL PRIMARY KEY,
  form_data JSONB NOT NULL,
  phone_destination TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  attempts INTEGER DEFAULT 0,
  error_message TEXT,
  last_error_at TIMESTAMP,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_status (status),
  INDEX idx_created (created_at)
);

-- Ativar RLS (Row Level Security)
ALTER TABLE submission_queue ENABLE ROW LEVEL SECURITY;

-- Política para INSERT (cliente pode salvar)
CREATE POLICY "Clients can insert submissions"
  ON submission_queue
  FOR INSERT
  WITH CHECK (true);

-- Política para SELECT (apenas serviço backend)
CREATE POLICY "Service role only for select"
  ON submission_queue
  FOR SELECT
  USING (
    auth.role() = 'service_role'
  );
```

### 4. Configurar processador de fila

#### Opção A: Supabase Edge Function (Recomendado)

```
Supabase Dashboard → Edge Functions → Create New
→ Nome: process-queue
```

Copiar conteúdo de `scripts/processQueue.js` para a Edge Function

Agendar via cron:

```
Supabase Dashboard → Cron Jobs → New
→ Name: Process Submission Queue
→ Function: process-queue
→ Schedule: "*/5 * * * *" (a cada 5 minutos)
```

#### Opção B: Vercel Cron (Se hospedar em Vercel)

```
vercel.json:

{
  "crons": [{
    "path": "/api/process-queue",
    "schedule": "*/5 * * * *"
  }]
}
```

Criar `api/process-queue.js`:

```javascript
import { processQueue } from '../src/services/queueProcessor.js';

export default async function handler(req, res) {
  try {
    await processQueue();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

#### Opção C: GitHub Actions (Simples)

```
.github/workflows/process-queue.yml:

name: Process Queue
on:
  schedule:
    - cron: '*/5 * * * *'

jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: node scripts/processQueue.js
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          VITE_UAZAPI_TOKEN: ${{ secrets.VITE_UAZAPI_TOKEN }}
          VITE_UAZAPI_BASE_URL: ${{ secrets.VITE_UAZAPI_BASE_URL }}
```

---

## Setup MCP Supabase

### 1. Configuração de MCP

Arquivo: `.claude/settings.json` (já configurado)

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp"
    }
  }
}
```

### 2. Usar MCP em Claude Code

Comandos disponíveis:
- `@supabase` para sugerir queries
- `@mcp:supabase` para queries diretas

---

## Como Funciona

### Fluxo Sucesso (WhatsApp OK)
```
Cliente preenche form
  → Tenta WhatsApp
  → ✅ Funciona
  → Cliente vê: "Respostas recebidas ✓"
  → Vander recebe no WhatsApp
```

### Fluxo Fallback (WhatsApp Falha)
```
Cliente preenche form
  → Tenta WhatsApp
  → ❌ Falha
  → Salva na fila Supabase
  → Cliente vê: "Respostas recebidas ✓" (mesma mensagem)
  → Background job processa fila
  → Tenta WhatsApp novamente (até 5 vezes)
  → Após sucesso: Vander recebe no WhatsApp
  → Logs mostram: "Enviado via fila (tentativa X/5)"
```

### Fluxo Crítico (Ambos Falham)
```
Cliente preenche form
  → Tenta WhatsApp: ❌
  → Salva na fila: ✅
  → Cliente vê: "Respostas recebidas ✓"
  → Background job tenta 5 vezes
  → Falha permanentemente: marcado como 'failed'
  → Vander avalia manualmente em Supabase Dashboard
  → Admin pode reprocessar manualmente
```

---

## Monitorar Fila

### Dashboard Supabase

```
Supabase → Table Editor → submission_queue
```

Ver:
- Pending items (processando)
- Failed items (erro permanente)
- Processed items (sucesso)
- Tentativas e últimos erros

### Logs

Verificar em:
- **Local:** `console.log` em `processQueue.js`
- **Supabase Edge Function:** Logs tab
- **Vercel:** Logs → Functions
- **GitHub Actions:** Actions tab

---

## Variáveis de Ambiente

### Frontend (.env.local)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_UAZAPI_BASE_URL=https://varia.uazapi.com
VITE_UAZAPI_TOKEN=
VITE_WHATSAPP_DESTINATION=
```

### Backend/Cron (.env ou secrets)
```
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
VITE_UAZAPI_BASE_URL=https://varia.uazapi.com
VITE_UAZAPI_TOKEN=
```

---

## Testes

### Local
```bash
# 1. Simular falha de WhatsApp
# Editar .env.local: VITE_UAZAPI_TOKEN=invalid

# 2. Preencher formulário
# DevTools → Console deve mostrar:
# "WhatsApp falhou, salvando na fila de processamento"

# 3. Verificar Supabase
# Table Editor → submission_queue
# Deve aparecer novo item com status='pending'

# 4. Restaurar token válido e rodar processor
node scripts/processQueue.js

# 5. Verificar Supabase novamente
# Item deve estar com status='processed'
```

### Produção
```
1. Monitorar Supabase Dashboard
2. Verificar Edge Function logs
3. Testar com WhatsApp offline
4. Verificar retry automático em 5 minutos
5. Validar mensagens chegando após fila processar
```

---

## Vantagens

✅ **Cliente nunca vê erro**
✅ **Dados nunca se perdem** (salvos no Supabase)
✅ **Retry automático** (até 5 tentativas)
✅ **Processamento transparente** (cliente não sabe)
✅ **Fácil monitorar** (Supabase Dashboard)
✅ **Escalável** (fila distribuída)
✅ **Auditável** (logs completos de cada tentativa)

---

## Preços

**Supabase Free Tier:**
- 500 MB storage
- API calls: ilimitadas
- Edge Functions: até 1.2M calls/mês
- Suficiente para uso pré-sessão

**Pro:** $25/mês para maior volume

---

**Status:** ✅ Fila Supabase implementada e pronta!
