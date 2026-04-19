# 🔧 Fix para Cloudflare Pages

## Problema
Cloudflare criou `wrangler.jsonc` automaticamente, mas Pages não precisa disso (é só static).

## Solução Imediata (Dashboard)

### Passo 1: Acessar Settings
```
Dashboard → formulario-vander → Settings
```

### Passo 2: Build & Deployments
```
Build & Deployments → Builds
```

### Passo 3: Desabilitar Deploy Command
```
Build command: npm run build  ✓ (manter)
Output directory: dist        ✓ (manter)

Deploy Command: (DEIXAR VAZIO!) ← REMOVER SE TIVER ALGO
```

Se houver algo em "Deploy Command", remova completamente.

### Passo 4: Salvar e Rebuild
```
Clique em "Save and Deploy"
Ou Deployments → "Trigger new deployment"
```

---

## Por Que?
- **Build command:** npm run build (gera dist/) ✓ Necessário
- **Deploy command:** vazio ✓ Pages não precisa
- **Deploy:** Pages automaticamente usa dist/ ✓

---

## Se Ainda Não Funcionar

No Cloudflare Dashboard em "Settings":

```
Build & Deployments → Build settings

Environment variables:
VITE_UAZAPI_BASE_URL = https://varia.uazapi.com
VITE_UAZAPI_TOKEN = dfe5c844-a39e-4ab6-9223-dcf40b442e1d
VITE_WHATSAPP_DESTINATION = 554899298643

Build command: npm run build
Build output directory: dist
Deploy command: (vazio!)
```

Salve e dispare rebuild.

---

**Após fazer isso, deploy deve funcionar!** 🚀
