# 🔑 Como Pegar Credenciais do Supabase

## 1️⃣ Criar Conta (5 min)

Acesse: **https://supabase.com**

```
→ Sign Up with GitHub (ou Email)
→ Confirmar email
→ Pronto!
```

## 2️⃣ Criar Projeto (2 min)

No dashboard:
```
→ New Project
→ Nome: "formulario-vander"
→ Região: "South America (São Paulo)"
→ Password: (gerar ou criar um)
→ Create
```

Aguarde ~2 min para criar (vai ficar verde quando pronto)

## 3️⃣ Pegar as Credenciais

Quando o projeto ficar pronto, clique nele e vá em:

```
Settings → API
```

Copie EXATAMENTE:

### 🔗 **Project URL**
Procure por: `Project URL` ou `API URL`
```
https://xxxxxxxxxxxxx.supabase.co
```
Cole em `.env.supabase` → `SUPABASE_URL`

### 🔑 **Anon Public Key** 
Procure por: `anon` ou `public key`
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Cole em `.env.supabase` → `SUPABASE_ANON_KEY`

### 🔐 **Service Role Key** (⚠️ PRIVADA)
Procure por: `service_role` ou `secret key`
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Cole em `.env.supabase` → `SUPABASE_SERVICE_KEY`

⚠️ **NUNCA compartilhe a SERVICE KEY!**

## 4️⃣ Gerar Access Token (opcional, só se usar CLI)

Se quiser usar Supabase CLI:

```
https://app.supabase.com → Account → Tokens
→ Generate Token
→ Cole em .env.supabase → SUPABASE_ACCESS_TOKEN
```

## 5️⃣ Executar Setup

Após preencher `.env.supabase`:

```bash
bash setup-queue.sh
```

Pronto! Vai:
- ✅ Criar tabela no Supabase
- ✅ Criar Edge Function
- ✅ Atualizar .env.local
- ✅ Configurar produção

## 📸 Referência Rápida

1. **supabase.com** → New Project
2. **Settings → API** → Copiar 3 chaves
3. **Preencher `.env.supabase`**
4. **bash setup-queue.sh**
5. **Deploy function**
6. **Done!**

---

**Tempo total: ~10 min**
