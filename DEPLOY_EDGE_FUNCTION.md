# 🚀 Deploy da Edge Function (process-queue)

## 📋 Pré-requisito
✅ Setup automático já foi executado
✅ Arquivo `supabase/functions/process-queue/index.ts` existe
✅ Credenciais Supabase estão em `.env.supabase`

---

## 🎯 Passo a Passo (5 min)

### 1️⃣ Abrir Supabase Dashboard

Acesse: https://app.supabase.com

```
→ Escolha seu projeto "formulario-vander"
→ Esquerda: procure "Edge Functions"
```

### 2️⃣ Criar Nova Function

```
Edge Functions → Create a new function
Name: process-queue
Runtime: Deno (padrão)
Authentication: User
→ Create function
```

### 3️⃣ Copiar Código

```bash
# No seu terminal, copie:
cat supabase/functions/process-queue/index.ts
```

Copie TUDO o conteúdo do arquivo.

### 4️⃣ Colar no Editor

Na página de Edge Function do Supabase:
- Delete o código de exemplo
- Cole o código que você copiou
- Clique em **Deploy**

Vai aparecer uma mensagem:
```
✅ Function deployed successfully
```

### 5️⃣ Configurar Variáveis de Ambiente

A função precisa dessas variáveis:

```
Supabase Dashboard → Project Settings → Edge Functions Settings
Adicionar as variáveis:

VITE_UAZAPI_TOKEN=dfe5c844-a39e-4ab6-9223-dcf40b442e1d
VITE_UAZAPI_BASE_URL=https://varia.uazapi.com
```

### 6️⃣ Agendar Cron Job

```
Supabase Dashboard → Cron Jobs → Create a new cron
Name: Process Submission Queue
Function: process-queue
Schedule: 0 */5 * * * *
(significa: a cada 5 minutos)
→ Save
```

### 7️⃣ Testar

```
Cron Jobs → Manualmente clique em "Run now"
```

Verifique os logs:
```
Cron → process-queue → View function logs
```

Deve aparecer:
```
[Queue Processor] Iniciando processamento...
[Queue] 0 itens pendentes
[Queue] ✅ Processamento concluído
```

---

## 🧪 Teste Completo

### Local

```bash
npm run dev
```

### Simular Falha de WhatsApp

1. Abra `.env.local`
2. Mude `VITE_UAZAPI_TOKEN` para um valor inválido
3. Preencha o formulário e envie
4. Vá para Supabase → Tables → submission_queue
5. Deve aparecer um novo item com `status = 'pending'`

### Processar a Fila

```
Supabase Dashboard → Cron Jobs → process-queue → Run now
```

Ou aguarde 5 minutos para o cron rodar automaticamente.

### Verificar Resultado

```
Supabase → Tables → submission_queue
→ O item deve estar com status = 'processed'
→ Campo attempts deve ser 1
```

---

## ❌ Solução de Problemas

### A função não aparece

- Aguarde ~30 segundos e refresh a página
- Verifique se está no projeto correto

### Logs mostram erro de permissão

- Verifique se `SUPABASE_URL` está correto em `.env.supabase`
- Redeploy a função

### Cron não executou

- Cron precisa da função já deployada
- Verifique se a função está verde (active)
- Tente "Run now" manualmente

### WhatsApp ainda falha mas não foi para fila

- Verifique se `VITE_SUPABASE_URL` está correto em `.env.local`
- Verifique se `VITE_SUPABASE_ANON_KEY` está correto
- Abra DevTools → Console para ver erro exato

---

## 📊 Monitorar em Produção

### Daily Check

```
Supabase → Tables → submission_queue
→ Filtrar por status = 'failed'
→ Se houver items, investigar error_message
```

### Limpar Fila Antiga

```sql
DELETE FROM submission_queue
WHERE created_at < NOW() - INTERVAL '30 days'
AND status = 'processed';
```

### Reprocessar Item Falho

```sql
UPDATE submission_queue
SET status = 'pending', attempts = 0
WHERE id = <id-do-item>;
```

---

## ✅ Checklist Final

- [ ] Arquivo `supabase/functions/process-queue/index.ts` existe
- [ ] Function "process-queue" deployada no Supabase (verde/active)
- [ ] Variáveis de ambiente configuradas
- [ ] Cron job criado (Schedule: `0 */5 * * * *`)
- [ ] Teste local funciona (item fica pending)
- [ ] Cron "Run now" processa o item (fica processed)
- [ ] `.env.local` tem `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

---

## 🎉 Pronto!

A fila está configurada e pronta para usar. Cliente nunca mais verá erro de WhatsApp! 🚀
