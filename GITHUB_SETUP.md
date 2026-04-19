# 🐙 GitHub Repository Setup

## Repository Info

- **URL:** https://github.com/vitormaria1/formulario-vander
- **Owner:** vitormaria1
- **Visibility:** Public
- **License:** MIT (opcional)

## Cloning

```bash
git clone https://github.com/vitormaria1/formulario-vander.git
cd formulario-vander
npm install
npm run dev
```

## Git Configuration

```bash
git config user.name "Vitor Maria"
git config user.email "vitormaria@vander.dev"
```

## Commits

### Initial Commit
- Landing page pré-sessão estrutura completa
- React + Vite setup
- 3 componentes principais
- Integração WhatsApp
- Validações e estilos

### Second Commit
- Correção: reduzir gap entre pergunta e campo
- Normalize spacing across all question types
- `.github/README_GITHUB.md` adicionado

## Branch Structure

- `main` — Production-ready code
- `development` (opcional) — Feature branches

## GitHub Features

### Issues
Se encontrar bugs, criar issue com:
- Título descritivo
- Passos para reproduzir
- Resultado esperado vs atual
- Screenshots se aplicável

### Discussions
Para sugestões e perguntas sobre features

### Wiki
Documentação adicional em GitHub Wiki (se necessário)

## Secrets (se usar Actions)

Para CI/CD, adicionar em Settings → Secrets:
```
VITE_UAZAPI_TOKEN=seu_token
VITE_WHATSAPP_DESTINATION=numero
```

## Deploy via GitHub

### Vercel
1. Ir em https://vercel.com
2. Importar repo do GitHub
3. Configurar env vars
4. Deploy automático em commits

### GitHub Pages (estático)
```bash
npm run build
# Copiar dist/ → gh-pages branch
git push origin gh-pages
```

## Checklist Pré-Push

- [ ] Código compilado sem erros
- [ ] `npm run build` sucesso
- [ ] Testes passando
- [ ] Commit message descritivo
- [ ] `.env.local` não está commitado
- [ ] `node_modules/` não está commitado

## Useful Commands

```bash
# Ver status
git status

# Ver commits
git log --oneline

# Ver diferenças
git diff

# Desfazer último commit (não pushado)
git reset --soft HEAD~1

# Fazer stash de mudanças
git stash

# Pull última versão
git pull origin main

# Ver remotes
git remote -v
```

## Colaboração

Se outros forem contribuir:

1. Fork o repo
2. Clone seu fork
3. Criar branch: `git checkout -b feature/sua-feature`
4. Commit: `git commit -m "Add: descrição"`
5. Push: `git push origin feature/sua-feature`
6. Abrir Pull Request no repo original

## GitHub Actions (CI/CD Opcional)

Criar `.github/workflows/build.yml`:

```yaml
name: Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test (se houver)
```

## README no GitHub

Veja `.github/README_GITHUB.md` para versão do GitHub com badges e formatação

## Proteções de Branch (Opcional)

Em Settings → Branches:
- Require pull request reviews
- Require status checks to pass
- Dismiss stale pull request approvals
- Require branches to be up to date

## Releases

Para criar releases:

```bash
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

Depois criar Release no GitHub com notas de mudanças

## Problemas Comuns

### "authentication failed"
```bash
# Se usar token inválido
git remote set-url origin https://ghp_seu_novo_token@github.com/vitormaria1/formulario-vander.git
```

### "permission denied"
Verificar se SSH key está configurada ou usar HTTPS com token

### "branch conflicts"
```bash
git pull origin main
# Resolver conflicts em arquivos
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

## Integrations

Conectar com:
- Vercel (auto-deploy)
- Netlify (auto-deploy)
- CodeCov (code coverage)
- Dependabot (dependency updates)

## Archive (se descontinuar)

Para arquivar repo:
Settings → Danger Zone → Archive this repository

## Contact

- Issues: GitHub Issues
- Email: (adicionar se necessário)
- Discussions: GitHub Discussions

---

**Repository pronto para colaboração! 🚀**
