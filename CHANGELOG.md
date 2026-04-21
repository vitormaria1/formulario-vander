# Changelog - Landing Page Pré-Sessão

## [v1.0.1] - 2026-04-19

### ✅ Correções Implementadas

#### 1. Foto Real Adicionada
- **Antes:** Placeholder cinza em capa e confirmação
- **Depois:** Foto real de Vander carregada de Supabase
- **Arquivo:** Atualizado `CoverScreen.jsx` e `ConfirmationScreen.jsx`
- **URL:** https://jfltbluknvirjoizhavf.supabase.co/storage/v1/object/public/vander/WhatsApp%20Image%202026-04-17%20at%2022.28.38.jpeg

#### 2. Máscara de Telefone Implementada
- **Antes:** Campo de telefone aceitava qualquer formato
- **Depois:** Formato DDD + XXXXXXXXX com máscara automática
- **Exemplo:** Digitar `4899298643` → exibe `48 99298-6643`
- **Validação:** Aceita 10-11 dígitos
- **Arquivo:** Atualizado `FormScreen.jsx`

#### 3. Bug nas Perguntas 11+ Corrigido
- **Problema:** Rótulo duplicado acima do campo de entrada
- **Causa:** Label estava sendo passado como `placeholder` no input
- **Solução:** Remover placeholder dos inputs; usar apenas label acima
- **Resultado:** Pergunta exibida uma única vez sem espaço desnecessário
- **Arquivo:** Reescrito completamente `FormScreen.jsx`

#### 4. Validação de Campos Melhorada
- **Email:** Regex simples `/^\S+@\S+\.\S+$/`
- **Telefone:** 10-11 dígitos validados
- **Nome:** Mínimo 3 caracteres
- **Botão AVANÇAR:** Desabilitado enquanto campo inválido
- **Arquivo:** `FormScreen.jsx` + `useFormState.js`

#### 5. UX de Telefone Aprimorada
- **Máscara visual:** `(XX) XXXXX-XXXX` em tempo real
- **Submissão:** Apenas dígitos enviados ao WhatsApp (55 + DDD + número)
- **Enter:** Avança para próxima pergunta em campos de texto

### 📝 Detalhes Técnicos

#### formatPhoneInput()
```javascript
const digits = val.replace(/\D/g, '');
if (digits.length <= 2) return digits;
if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
return `${digits.slice(0, 2)} ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
```

#### normalizePhoneNumber()
```javascript
// "48 99298-6643" → "554899298643"
const digits = phone.replace(/\D/g, '');
if (digits.length >= 10) return '55' + digits;
```

### 🧪 Testes Realizados

- ✅ Navegação entre 18 telas funciona
- ✅ Validação impede avançar sem preencher obrigatórios
- ✅ Máscara de telefone formata corretamente
- ✅ Foto real carrega em capa e confirmação
- ✅ Envio WhatsApp normaliza telefone corretamente
- ✅ Responsividade mantida (desktop, tablet, mobile)

### 🚀 Deploy Notes

Nenhuma alteração em dependencies ou configuração.
Servidor Vite recompilou automaticamente as mudanças.

### 📸 Screenshots

Pergunta 11 (antes):
```
11 DE 17
Já fez terapia? Se sim, por quanto tempo?
[placeholder text redundante]
[campo com espaço desnecessário]
```

Pergunta 11 (depois):
```
11 DE 17
Já fez terapia? Se sim, por quanto tempo?
[campo limpo, sem redundância]
```

Telefone (antes):
```
04 - Número para contato
[campo genérico]
```

Telefone (depois):
```
04 - Número para contato
(11) 99999-9999
[campo com máscara]
```
