# Claude Skills Workspace 🚀

Repositório centralizado de **skills de produtividade** para usar em qualquer projeto com Claude Code.

## O que é uma Skill?

Uma skill é uma ferramenta/prompt reutilizável que encapsula conhecimento, processos ou automações. Cada skill é independente e pode ser usada em múltiplos projetos.

## 📦 Conteúdo

Este workspace contém **79+ skills** organizadas em categorias:

| Categoria | Descrição | Exemplos |
|-----------|-----------|----------|
| **marketing/** | Copywriting, ads, SEO, funnels | Landing pages, email templates, ad copy |
| **technical/** | Dev, design systems, frontend | Shadcn UI, web design, frontend engineering |
| **automation/** | Scraping, APIs, integrações | Gmail, WhatsApp, Google Maps, Skool monitor |
| **design/** | UI/UX, design guidelines, CRO | Design systems, page optimization |
| **tools/** | Utilities diversas | Modal deploy, webhooks, 3D transitions |
| **knowledge/** | Conteúdo curado | Breakthrough Advertising, estratégias |

## 🎯 Como Usar

### Em Claude Code (CLI, Desktop, Web)

```bash
# Simplesmente invoque a skill
/skill-name
```

### Em um projeto qualquer

1. Configure Claude Code para reconhecer este workspace
2. Skills ficam automaticamente disponíveis via `/`

### Exemplo

```bash
# Criar um e-mail com template
/email-newsletter-template

# Gerar copy para landing page
/landing-page-copy

# Configurar ad campaign
/facebook-ad-campaign
```

## 📋 Estrutura do Repositório

```
Claude Skills/
├── claude.md                      # Configuração e guia
├── README.md                      # Este arquivo
├── SKILLS_INDEX.md               # Índice completo de skills
├── skills/
│   ├── marketing/
│   │   ├── landing-page-copy/
│   │   │   └── SKILL.md
│   │   ├── email-newsletter-template/
│   │   └── ...
│   ├── technical/
│   ├── automation/
│   ├── design/
│   └── ...
└── .claude/                       # Configuração do workspace
```

## 🔍 Encontrar uma Skill

1. **Procure por categoria** - veja a estrutura em `/skills`
2. **Veja o índice** - [SKILLS_INDEX.md](SKILLS_INDEX.md) lista todas
3. **Leia SKILL.md** - cada skill tem documentação própria

## ✨ Principais Skills

### Marketing
- 📧 Email templates e newsletters
- 🎬 Scripts para YouTube, TikTok, podcasts
- 💰 Estratégias de vendas e funnels
- 📊 Ad campaigns (Google, Facebook, LinkedIn)

### Technical
- 🎨 Shadcn UI components & recipes
- 🌐 Frontend engineering & design systems
- 📄 Landing page optimization
- 🖼️ Design guidelines & CRO

### Automation
- 🔍 Web scraping (Apify, Google Maps)
- 📨 Gmail automation (labels, organizing)
- 💬 WhatsApp automation
- 📱 Skool community monitoring

## 🛠️ Adicionar uma Nova Skill

1. Crie uma pasta em `/skills/[categoria]/[skill-name]`
2. Adicione `SKILL.md` com:
   - **Propósito** - o que faz
   - **Quando usar** - contextos
   - **Como usar** - instruções
   - **Exemplos** - casos de uso
3. Se tiver scripts, coloque em `/scripts`
4. Se tiver referências, coloque em `/references`
5. Atualize `SKILLS_INDEX.md`

## 📖 Documentação

- **[claude.md](claude.md)** - Configuração e princípios
- **[SKILLS_INDEX.md](SKILLS_INDEX.md)** - Índice completo
- **[skills/](skills/)** - Cada skill tem seu próprio SKILL.md

## 🔗 Próximas Steps

- [ ] Categorizar skills por tipo (em progresso)
- [ ] Criar templates padrão para novas skills
- [ ] Adicionar search/filtros
- [ ] Documentar workflows de skill combinations

---

**Workspace centralizado para produtividade** com Claude Code 🚀
