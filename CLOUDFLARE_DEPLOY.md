# 🚀 Deploy no Cloudflare Pages

## ⭐ Opção Única (e Definitiva)

Cloudflare Pages via GitHub é simples - **não precisa de nenhuma configuração especial**.

### Passo 1: Ir no Cloudflare Dashboard
```
https://dash.cloudflare.com/
```

### Passo 2: Criar Projeto Pages
```
Pages → Create a project → Connect to Git
```

### Passo 3: Selecionar Repositório
```
Conectar GitHub account (se não estiver)
Selecionar repositório: vitormaria1/formulario-vander
```

### Passo 4: Configurar Build
Cloudflare detecta automaticamente, mas confirme:
- **Build command:** `npm run build`
- **Build output directory:** `dist`

Se não aparecer, preench manualmente com esses valores.

### Passo 5: Adicionar Environment Variables
```
Settings → Environment variables → Production

Adicionar 3 variáveis:

Name: VITE_UAZAPI_BASE_URL
Value: https://varia.uazapi.com

Name: VITE_UAZAPI_TOKEN  
Value: dfe5c844-a39e-4ab6-9223-dcf40b442e1d

Name: VITE_WHATSAPP_DESTINATION
Value: 554899298643
```

### Passo 6: Deploy
```
Clique em "Save and Deploy"
```

Pronto! Cloudflare vai:
1. Clonar repo do GitHub
2. Instalar dependências (`npm install`)
3. Fazer build (`npm run build`)
4. Fazer deploy de `dist/`
5. Gerar URL: `https://formulario-vander.pages.dev`

---

## ✅ Verificação

Após deploy:
- [ ] Acessar URL gerada
- [ ] App carrega completo
- [ ] Foto de Vander exibe
- [ ] Navegar 18 telas
- [ ] Enviar resposta e verificar WhatsApp

---

## 🔄 Atualizações Futuras

Qualquer commit em `main` no GitHub:
```bash
git push origin main
# Cloudflare automaticamente redeploy
```

Sem fazer nada manualmente! Auto-deploy em 1-2 minutos.

---

## 🌍 URLs

```
Deploy: https://formulario-vander.pages.dev
GitHub: https://github.com/vitormaria1/formulario-vander
Local:  http://localhost:5173
```

---

## ❓ Troubleshooting

### Build falha no Cloudflare
- Verificar logs no dashboard
- Deve aparecer algo como `✓ built in 244ms`

### Variáveis não funcionam
- Settings → Environment variables → Production
- Verificar que estão salvas
- Clique em "Redeploy"

### Página em branco
- F12 → Console
- Verificar erros
- Rollback em Deployments se necessário

---

**Tudo pronto! Deploy deve funcionar agora!** 🎉
