# 📦 Implementação: Fila de Processamento Supabase

## ✅ O que foi implementado

### 1. **MCP Supabase Configurado**
- Arquivo: `.claude/settings.json`
- Pronto para usar com Claude Code
- Comandos: `/supabase` ou `@mcp:supabase`

### 2. **Serviço de Fila** 
- Arquivo: `src/services/queueService.js`
- Funções:
  - `saveFormToQueue()` — Salva formulário na fila Supabase
  - `getQueueStats()` — Consulta status da fila

### 3. **Serviço WhatsApp Atualizado**
- Arquivo: `src/services/whatsappService.js`
- Agora usa fila como fallback:
  1. Tenta WhatsApp
  2. Se falhar → Salva na fila Supabase
  3. Cliente vê sucesso em ambos os casos

### 4. **Processador de Fila (Backend)**
- Arquivo: `scripts/processQueue.js`
- Lê itens pendentes do Supabase
- Tenta WhatsApp para cada item (até 5 tentativas)
- Atualiza status na fila
- Pronto para rodar como Cron Job, Edge Function ou GitHub Actions

### 5. **Documentação Completa**
- `SUPABASE_QUEUE_SETUP.md` — Setup passo a passo
- `QUEUE_IMPLEMENTATION.md` — Este arquivo

---

## 🔧 Próximos Passos

### 1. Criar Supabase Project
```
1. Ir para https://supabase.com
2. Criar novo projeto (região Brasil)
3. Copiar URL e chaves de API
4. Adicionar em .env.local
```

### 2. Criar Tabela no Supabase
```sql
CREATE TABLE submission_queue (
  id BIGSERIAL PRIMARY KEY,
  form_data JSONB NOT NULL,
  phone_destination TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  error_message TEXT,
  last_error_at TIMESTAMP,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE submission_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can insert"
  ON submission_queue FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role only"
  ON submission_queue FOR SELECT USING (auth.role() = 'service_role');
```

### 3. Configurar Processador
- **Opção A (Recomendada):** Supabase Edge Function + Cron
- **Opção B:** Vercel Cron Jobs
- **Opção C:** GitHub Actions

Ver `SUPABASE_QUEUE_SETUP.md` para detalhes completos.

### 4. Atualizar Variáveis de Ambiente
```
.env.local:
VITE_SUPABASE_URL=<sua-url>
VITE_SUPABASE_ANON_KEY=<sua-chave>

Production (.env.production ou Vercel/Cloudflare):
VITE_SUPABASE_URL=<sua-url>
VITE_SUPABASE_ANON_KEY=<sua-chave>
```

### 5. Testar Fluxo
```
1. Simular falha: Usar token inválido de uazAPI
2. Preencher e enviar formulário
3. Verificar em Supabase: deve aparecer na fila
4. Restaurar token válido
5. Rodar: node scripts/processQueue.js
6. Verificar: Status deve virar 'processed' no Supabase
```

---

## 📊 Arquitetura da Fila

```
┌─────────────────────────────────────────┐
│        Cliente no Navegador             │
│  (src/components/FormScreen.jsx)        │
└──────────────────┬──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  sendFormDataWithFallback()
        │ (whatsappService.js) │
        └──────┬───────┬───────┘
               │       │
      ┌────────▼─┐   ┌─┴────────────┐
      │ WhatsApp  │   │ If fails:    │
      │ (uazAPI)  │   │ saveFormTo   │
      │           │   │ Queue()      │
      └────┬──────┘   └─┬────────────┘
           │            │
           │         ┌──▼─────────────────┐
           │         │ Supabase Database  │
           │         │ submission_queue   │
           │         └──┬────────────────┘
           │            │
           │    ┌────────▼─────────┐
           │    │ Cron Job / Edge  │
           │    │ Function (5min)  │
           │    │ processQueue.js  │
           │    └────────┬─────────┘
           │             │
           │      ┌──────▼──────┐
           │      │ Retry  up   │
           │      │ to 5 times  │
           │      └──────┬──────┘
           │             │
           └─────┬───────┘
                 │
                 ▼
        ┌──────────────────┐
        │ Vander recebe    │
        │ no WhatsApp      │
        └──────────────────┘
```

---

## 🔒 Segurança

### RLS (Row Level Security)
- Clientes podem apenas **INSERT** (salvar seus formulários)
- Apenas **service_role** pode **SELECT** (processador pode ler)
- Sem risco de clientes verem dados alheios

### Credenciais
- `VITE_SUPABASE_ANON_KEY` - Chave pública (segura no browser)
- `SUPABASE_SERVICE_KEY` - Chave privada (apenas backend/cron)
- Nunca expor `SERVICE_KEY` no frontend

---

## 📈 Monitoramento

### Verificar Fila em Produção
```
Supabase Dashboard → Table Editor → submission_queue
│
├─ Status = 'pending' → Processando
├─ Status = 'processed' → Sucesso ✅
└─ Status = 'failed' → Falha permanente ❌
```

### Reprocessar Item Falho
```sql
UPDATE submission_queue
SET status = 'pending', attempts = 0
WHERE id = <item-id>;
```

### Limpar Fila Antiga
```sql
DELETE FROM submission_queue
WHERE created_at < NOW() - INTERVAL '30 days'
AND status = 'processed';
```

---

## 🚀 Deploy

### Vercel + Supabase Edge Function (Recomendado)
1. Deploy app para Vercel (já feito)
2. Criar Supabase projeto
3. Configurar Edge Function com `processQueue.js`
4. Agendar Cron a cada 5 minutos
5. Adicionar envs em Vercel

### Supabase Standalone
1. Edge Function: Supabase Dashboard → Functions
2. Cron: Supabase Dashboard → Cron
3. Pronto! Sem depender de Vercel

### GitHub Actions
1. Copiar `.github/workflows/process-queue.yml`
2. Adicionar secrets: SUPABASE_URL, SUPABASE_SERVICE_KEY, etc
3. Cron automático a cada 5 minutos
4. Logs em Actions tab

---

## ❓ FAQ

**P: E se WhatsApp e fila falharem?**
A: Cliente vê sucesso + logs mostram erro. Admin verifica Supabase manualmente.

**P: Quanto tempo leva para processar?**
A: Cron roda a cada 5 minutos. Máximo de espera: ~5 minutos.

**P: Quantas vezes tenta?**
A: Até 5 vezes com delay de 5 segundos entre tentativas.

**P: Preciso pagar pelo Supabase?**
A: Não. Free tier: 500 MB + ilimitadas API calls. Suficiente para pré-sessão.

**P: Como saber se funcionou?**
A: Verificar Supabase Dashboard → submission_queue → status = 'processed'

---

## ✨ Status

✅ MCP Supabase configurado
✅ Serviço de fila implementado
✅ Processador backend pronto
✅ WhatsApp + Fallback integrado
⏳ Falta: Criar Supabase project + configurar Cron/Edge Function

**Próximo:** Criar projeto no Supabase seguindo `SUPABASE_QUEUE_SETUP.md`
