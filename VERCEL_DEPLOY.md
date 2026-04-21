# 🚀 Deploy no Vercel (MUITO MAIS SIMPLES)

Cloudflare Pages tem problemas com auto-config Wrangler. **Vercel é 100x mais simples para React/Vite**.

## ⭐ Deploy em 3 Passos

### Passo 1: Ir no Vercel
```
https://vercel.com
Clique em "Sign Up" (ou login se já tem conta)
```

### Passo 2: Importar Repositório
```
New Project → Import Git Repository
Conectar GitHub (autorizar)
Selecionar: vitormaria1/formulario-vander
```

### Passo 3: Configurar e Deploy
```
Build Command: npm run build (detecta automaticamente)
Output Directory: dist (detecta automaticamente)

Environment Variables:
VITE_UAZAPI_BASE_URL=https://varia.uazapi.com
VITE_UAZAPI_TOKEN=dfe5c844-a39e-4ab6-9223-dcf40b442e1d
VITE_WHATSAPP_DESTINATION=554899298643

Clique em "Deploy"
```

✅ **Pronto em ~1 minuto!**

---

## 🌍 URL do Deploy

```
https://formulario-vander.vercel.app
```

---

## 🔄 Atualizações Automáticas

Qualquer push em `main`:
```bash
git push origin main
# Vercel automaticamente redeploy em 1-2 minutos
```

---

## ✅ Por Que Vercel é Melhor?

| Feature | Vercel | Cloudflare |
|---------|--------|-----------|
| Setup | 3 passos simples | Complexo (Wrangler issues) |
| Auto-Deploy | ✅ Via GitHub | ✅ Mas com problemas |
| Performance | Excelente | Excelente |
| Free Tier | ✅ Ilimitado | ✅ Ilimitado |
| Suporte React | ✅ Perfeito | ⚠️ Configuração chata |

---

## 🎯 Domínio Customizado (Opcional)

```
Settings → Domains
Adicionar seu domínio
Seguir instruções de DNS
```

---

**Recomendação: Use Vercel, é muito mais simples!** 🎉
