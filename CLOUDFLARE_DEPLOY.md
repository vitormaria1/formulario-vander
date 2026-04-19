# 🚀 Deploy no Cloudflare Pages

## ⭐ Opção 1: Deploy Direto do GitHub (RECOMENDADO - Auto-Deploy)

### 1. Conectar Repositório
```
https://dash.cloudflare.com/
→ Pages → Create a project → Connect to Git
→ Selecionar: vitormaria1/formulario-vander
```

### 2. Configurar Build Settings
- **Project name:** formulario-vander
- **Production branch:** main
- **Build command:** npm run build
- **Build output directory:** dist

### 3. Adicionar Environment Variables
```
Settings → Environment variables → Production

Adicionar 3 variáveis:
VITE_UAZAPI_BASE_URL=https://varia.uazapi.com
VITE_UAZAPI_TOKEN=dfe5c844-a39e-4ab6-9223-dcf40b442e1d
VITE_WHATSAPP_DESTINATION=554899298643
```

### 4. Deploy Automático
- Clique em "Save and Deploy"
- Cloudflare automaticamente:
  1. Clona repo do GitHub
  2. Instala dependências
  3. Roda `npm run build`
  4. Faz deploy de `dist/`

✅ **Vantagem:** A cada push em main, redeploy automático!

---

## 📦 Opção 2: Upload Manual via CLI

### 1. Build Local
```bash
npm run build
```

### 2. Instalar Wrangler CLI
```bash
npm install -g wrangler
```

### 3. Login no Cloudflare
```bash
wrangler login
# Abre navegador para autenticar
```

### 4. Deploy
```bash
wrangler pages deploy dist
# Pronto! Vai gerar URL do deploy
```

---

## 🖱️ Opção 3: Upload Manual via Dashboard (Mais Simples)

### 1. Build Localmente
```bash
npm run build
```

### 2. Acessar Cloudflare Dashboard
```
https://dash.cloudflare.com/
→ Pages → Create project → Upload static site
```

### 3. Fazer Upload
- Arrastar pasta `dist/` para upload
- OU clicar para selecionar

### 4. Nomear Projeto
- **Project name:** formulario-vander
- Save

### 5. Configurar Variáveis de Ambiente
```
Settings → Environment variables → Production

VITE_UAZAPI_BASE_URL=https://varia.uazapi.com
VITE_UAZAPI_TOKEN=dfe5c844-a39e-4ab6-9223-dcf40b442e1d
VITE_WHATSAPP_DESTINATION=554899298643
```

### 6. Redeploy
- Clique em "Redeploy"
- Pronto!

---

## Domínio Customizado

### 1. Adicionar Domínio
- Settings → Custom domains
- Clique em "Add custom domain"
- Digitar: `seu-dominio.com`

### 2. Configurar DNS
Se usar domínio próprio:
- Apontar nameservers para Cloudflare (ou configurar CNAME)
- Cloudflare vai gerar records

### 3. SSL/TLS
- Automático via Cloudflare (Full Strict)

---

## Pós-Deploy

### 1. Verificar
- Acessar URL de deploy
- Testar navegação completa (18 telas)
- Testar envio WhatsApp

### 2. Monitorar
- Analytics → Requests, Errors
- Performance → Core Web Vitals

### 3. Cache
Em Settings → Cache:
- Cache Level: Cache Everything
- Browser TTL: 30 minutes
- Server-side Caching: 1 month

---

## Troubleshooting

### Build falha
```bash
# Verificar localmente
npm run build

# Se funcionou local mas não no CF:
# - Verificar Node version (mínimo 18)
# - Verificar .env vars estão configuradas
# - Limpar cache: Purge Cache → Purge Everything
```

### Variáveis de env não funcionam
- Verificar que estão em Settings → Environment variables
- Para ter em build-time, prefixar com `VITE_`
- Redeploy após adicionar vars

### CORS errors do WhatsApp
- uazAPI precisa de CORS headers
- Cloudflare > Security > CORS > Allow All Origins

### Página em branco
- F12 → Console → verificar erros
- Verificar que `dist/` foi uploadado completo
- Redeploy

---

## Checklist Pré-Deploy

- [ ] `npm run build` sem erros
- [ ] `dist/` gerado com 3 arquivos (index.html, assets/)
- [ ] `.env.local` NÃO está commitado no Git
- [ ] Credenciais uazAPI estão em `.env.local` (local)
- [ ] Vars de env configuradas no Cloudflare Dashboard
- [ ] GitHub repo está atualizado e pushed
- [ ] Teste navegação completa (18 telas)
- [ ] Teste envio WhatsApp
- [ ] Foto carrega corretamente
- [ ] Validações funcionam
- [ ] Responsividade OK (mobile tested)

---

## Performance no Cloudflare

- **CDN Global:** Seu site será servido de múltiplos data centers ao redor do mundo
- **Caching Automático:** Assets (JS, CSS) cacheados por 30 dias
- **Gzip/Brotli:** Compressão automática
- **DDoS Protection:** Proteção automática
- **WAF:** Firewall de aplicação web

Tamanho esperado:
- `dist/index.html`: ~700B
- `dist/assets/index-*.js`: ~65KB (gzip)
- `dist/assets/index-*.css`: ~2.2KB (gzip)
- **Total:** ~68KB gzip

---

## URLs Após Deploy

Se usar `formulario-vander.pages.dev`:
```
https://formulario-vander.pages.dev
```

Se usar domínio customizado:
```
https://seu-dominio.com
```

---

## Atualizações Futuras

### Código
```bash
# Fazer mudanças locais
git add .
git commit -m "..."
git push origin main

# Cloudflare automaticamente fará rebuild se conectado ao GitHub
```

### Variáveis de Env
```bash
# Dashboard → Settings → Environment variables
# Adicionar/modificar/deletar
# Clique em "Redeploy"
```

---

## Rollback

Se algo der errado:
- Dashboard → Deployments
- Selecionar deployment anterior
- Clique em "Rollback to this deployment"

---

## Monitoramento em Produção

### Analytics
- Requests/min
- Bandwidth
- Cache hit rate

### Alertas
- Criar alertas para:
  - High error rate (>5%)
  - Downtime
  - Performance degradation

---

**Status:** ✅ Pronto para deploy no Cloudflare!

Use a **Opção 1 (GitHub)** para auto-deploy em cada push.
