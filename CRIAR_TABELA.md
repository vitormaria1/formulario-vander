# 📊 Criar Tabela submission_queue

## 🚀 Passo a Passo (2 min)

### 1️⃣ Abrir SQL Editor

```
https://app.supabase.com
→ Projeto: formulario-vander
→ Esquerda: SQL Editor
→ New Query
```

### 2️⃣ Copiar SQL

```bash
cat create-table.sql
```

Copie TUDO.

### 3️⃣ Colar no Supabase

Na página "New Query" do SQL Editor:
- Copie o conteúdo de `create-table.sql`
- Cole na caixa branca
- Clique em **▶ Execute** (botão azul)

Deve aparecer:
```
Query executed successfully
```

### 4️⃣ Verificar

```
Supabase → Table Editor → Esquerda
Deve aparecer "submission_queue" na lista
```

---

## ✅ SQL Criado

O script cria:
- ✅ Tabela `submission_queue` com 9 colunas
- ✅ Índices para performance (status, created_at)
- ✅ Row Level Security (RLS) ativado
- ✅ Política 1: Clientes podem INSERT
- ✅ Política 2: Service role pode SELECT

---

## 🧪 Testar

Após criar a tabela:

```bash
bash test-queue.sh
```

Deve aparecer:
```
✅ Total de items: 0
   📍 Pending: 0
   ✅ Processed: 0
   ❌ Failed: 0
```

---

**Pronto! Tabela criada.**
