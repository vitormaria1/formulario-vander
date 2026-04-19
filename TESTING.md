# Guia de Testes - Formulário Pré-Sessão

## ✅ Teste Manual (MVP)

### 1. Carregamento Inicial
- [ ] Abrir http://localhost:5173
- [ ] Deve exibir tela de capa com título "ANTES DA / PRIMEIRA / SESSÃO, / ALGUMAS PERGUNTAS."
- [ ] Foto/placeholder deve estar à direita
- [ ] Botão "COMEÇAR →" deve estar visível

### 2. Navegação de Telas
- [ ] Clicar "COMEÇAR →" → deve ir para tela 01 (01 de 17)
- [ ] Deve exibir pergunta "E-mail"
- [ ] Clicar "AVANÇAR →" sem preencher → botão deve estar desabilitado ou mostrar erro
- [ ] Preencher email válido (teste@email.com) → botão ativa
- [ ] Clicar "AVANÇAR →" → vai para tela 02 (Nome completo)
- [ ] Clicar "← VOLTAR" → volta para tela 01
- [ ] Valor anterior (email) permanece preenchido

### 3. Validação de Campos

**E-mail (Tela 01)**
- [ ] Email inválido (teste@) → botão desabilitado, sem mostrar erro visual ainda
- [ ] Email válido (teste@email.com) → botão habilita

**Nome (Tela 02)**
- [ ] Nome vazio → botão desabilitado
- [ ] Nome com 1-2 caracteres → botão desabilitado (mín. 3)
- [ ] Nome com 3+ caracteres → botão habilita

**Telefone (Tela 03)**
- [ ] Vazio → botão desabilitado
- [ ] Menos de 10 dígitos → botão desabilitado
- [ ] 10-11 dígitos → botão habilita
- [ ] Aceita formatação (48 99298-6643) e limpa para envio

### 4. Tipos de Campos
- [ ] **Text**: Email, Nome, Telefone funcionam como esperado
- [ ] **Number**: Idade aceita apenas números
- [ ] **Date**: Data de nascimento tem input date
- [ ] **Select**: Estado civil, Renda têm dropdown com opções
- [ ] **Textarea**: Rotina, Diagnóstico, Medicação têm áreas de texto
- [ ] **Enter**: Em text/tel avança para próxima; em textarea não avança

### 5. Percurso Completo (17 Perguntas)

Preencher todas as 17 perguntas:
1. ✓ E-mail (obrigatório)
2. ✓ Nome completo (obrigatório)
3. ✓ Número para contato (obrigatório)
4. Idade
5. Data de nascimento
6. Endereço (CEP)
7. Religião
8. Estado civil
9. Profissão
10. Renda média
11. Histórico de terapia
12. Diagnósticos
13. Medicações
14. Rotina
15. ✓ Motivo da terapia (obrigatório)
16. ✓ Objetivos (3 meses) (obrigatório)
17. Observações adicionais

### 6. Envio via WhatsApp

**Tela 17 (Última Pergunta)**
- [ ] Botão deve mostrar "ENVIAR RESPOSTAS →" (não "AVANÇAR →")
- [ ] Todos os campos obrigatórios devem estar preenchidos antes
- [ ] Se falta algum obrigatório → mostrar erro/toast

**Ao Clicar "ENVIAR RESPOSTAS →"**
- [ ] Deve mostrar spinner/loading "ENVIANDO..."
- [ ] Botão fica desabilitado
- [ ] Fazer request à uazAPI (verificar Network tab do DevTools)
- [ ] ✓ WhatsApp receber mensagem formatada com:
  - Cabeçalho: "📋 RESPOSTAS PRÉ-SESSÃO"
  - Dados pessoais (email, nome, telefone)
  - Histórico médico (diagnóstico, medicação, etc)
  - Motivo + objetivos
  - Timestamp de envio

### 7. Tela de Confirmação
- [ ] Após envio sucesso → vai para tela de confirmação
- [ ] Exibe "RESPOSTAS / RECEBIDAS. / NOS FALAMOS / EM BREVE."
- [ ] Monograma "VM" em bordô no rodapé
- [ ] Foto/placeholder à direita

### 8. Tratamento de Erros

**Sem conexão/Erro na API**
- [ ] Deve mostrar toast vermelho com mensagem
- [ ] Botão "ENVIAR RESPOSTAS →" volta a funcionar (retry)
- [ ] Máximo 3 tentativas automáticas ou permanecer na tela

**Variáveis de Ambiente Faltando**
- [ ] Se VITE_UAZAPI_TOKEN não está em .env.local → erro no console
- [ ] Mostrar mensagem: "Token da uazAPI não configurado"

### 9. Responsividade
- [ ] Desktop (1200px+): Layout 2 colunas (texto + foto)
- [ ] Tablet (768-1199px): Ajustes de tamanho
- [ ] Mobile (<768px): Layout 1 coluna, foto menor

### 10. Design & Visual
- [ ] Cores corretas:
  - Fundo: `#F4F0E8` (off-white)
  - Texto: `#1A1A1A` (charcoal)
  - Botões/destaque: `#7A1C1C` (bordô)
- [ ] Fontes carregando:
  - Bebas Neue (títulos)
  - Inter (corpo)
- [ ] Inputs com underline (só linha inferior)
- [ ] Botões com cantos retos, UPPERCASE
- [ ] Espaçamento consistente

## 🧪 Teste de Integração

```bash
# Com .env.local preenchido:
npm run dev

# Testar envio real:
# 1. Preencher form completo
# 2. Clicar ENVIAR
# 3. Verificar WhatsApp em 554899298643
```

## 🐛 Debugging

**DevTools (F12)**
- Network tab: Verificar request/response da uazAPI
- Console: Verificar erros JavaScript
- Elements: Verificar styles aplicados

**Mensagem não chegando?**
- Verificar .env.local tem token correto
- Verificar número destino é `554899298643`
- Verificar conectividade/firewall

**Validação não funciona?**
- Verificar FormScreen recebe props corretas
- Verificar `canAdvance()` está sendo chamada
