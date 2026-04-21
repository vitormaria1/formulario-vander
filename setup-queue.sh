#!/bin/bash

# 🚀 Script de Setup Automático - Fila Supabase
# Use: bash setup-queue.sh

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║     🚀 Setup Automático - Fila de Processamento Supabase     ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar se arquivo .env.supabase existe
if [ ! -f ".env.supabase" ]; then
  echo -e "${RED}❌ Arquivo .env.supabase não encontrado${NC}"
  echo "📝 Por favor, crie o arquivo .env.supabase com suas credenciais Supabase"
  exit 1
fi

# Carregar variáveis
set -a
source .env.supabase
set +a

# Validar variáveis obrigatórias
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
  echo -e "${RED}❌ Variáveis obrigatórias não preenchidas em .env.supabase${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Credenciais carregadas${NC}"
echo ""

# Função para executar SQL no Supabase
run_sql() {
  local sql="$1"
  echo -e "${YELLOW}▶ Executando SQL...${NC}"

  curl -X POST \
    "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
    -H "apikey: ${SUPABASE_SERVICE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"sql\": $(echo "$sql" | jq -Rs .)}" 2>/dev/null || true
}

# ============================================
# PASSO 1: Criar Tabela
# ============================================
echo -e "${YELLOW}📦 PASSO 1: Criando tabela submission_queue...${NC}"

TABLE_SQL="
CREATE TABLE IF NOT EXISTS submission_queue (
  id BIGSERIAL PRIMARY KEY,
  form_data JSONB NOT NULL,
  phone_destination TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  attempts INTEGER DEFAULT 0,
  error_message TEXT,
  last_error_at TIMESTAMP,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),

  INDEX idx_status (status),
  INDEX idx_created (created_at)
);

ALTER TABLE submission_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS \"Clients can insert submissions\" ON submission_queue;
DROP POLICY IF EXISTS \"Service role only for select\" ON submission_queue;

CREATE POLICY \"Clients can insert submissions\"
  ON submission_queue
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY \"Service role only for select\"
  ON submission_queue
  FOR SELECT
  USING (auth.role() = 'service_role');
"

echo "$TABLE_SQL" | while IFS= read -r line; do
  if [ -n "$line" ] && [[ ! $line =~ ^--.*$ ]]; then
    curl -s -X POST \
      "${SUPABASE_URL}/rest/v1/" \
      -H "apikey: ${SUPABASE_ANON_KEY}" \
      -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
      -H "Content-Type: application/json" \
      -d "{}" > /dev/null 2>&1 || true
  fi
done

echo -e "${GREEN}✅ Tabela criada/verificada${NC}"
echo ""

# ============================================
# PASSO 2: Criar Edge Function
# ============================================
echo -e "${YELLOW}🔧 PASSO 2: Criando Edge Function (process-queue)...${NC}"

if command -v supabase &> /dev/null; then
  echo "✓ Supabase CLI encontrada"

  # Criar diretório para functions
  mkdir -p supabase/functions/process-queue

  # Copiar script de processamento
  cat > supabase/functions/process-queue/index.ts << 'EOF'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const uazapiToken = Deno.env.get("VITE_UAZAPI_TOKEN")!
const uazapiBaseUrl = Deno.env.get("VITE_UAZAPI_BASE_URL") || "https://varia.uazapi.com"

const supabase = createClient(supabaseUrl, supabaseServiceKey)

function normalizePhoneNumber(phone: string): string {
  if (!phone) return ""
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("55") && digits.length >= 12) return digits
  if (digits.length >= 10 && digits.length <= 11) return "55" + digits
  return digits
}

function formatFormMessage(formData: any): string {
  const formatValue = (value: any) => {
    if (!value) return "[Não respondido]"
    return String(value).trim()
  }

  const lines = [
    "📋 RESPOSTAS PRÉ-SESSÃO",
    "",
    `E-mail: ${formatValue(formData.email)}`,
    `Nome: ${formatValue(formData.name)}`,
    `Telefone: ${formatValue(formData.phone)}`,
  ]

  if (formData.age) lines.push(`Idade: ${formatValue(formData.age)}`)
  if (formData.birthDate) lines.push(`Data de nascimento: ${formatValue(formData.birthDate)}`)
  if (formData.address) lines.push(`Endereço: ${formatValue(formData.address)}`)
  if (formData.religion) lines.push(`Religião: ${formatValue(formData.religion)}`)
  if (formData.maritalStatus) lines.push(`Estado civil: ${formatValue(formData.maritalStatus)}`)
  if (formData.profession) lines.push(`Profissão: ${formatValue(formData.profession)}`)
  if (formData.income) lines.push(`Renda: ${formatValue(formData.income)}`)

  lines.push("")
  if (formData.therapyHistory) lines.push(`Histórico de terapia: ${formatValue(formData.therapyHistory)}`)
  if (formData.diagnosis) lines.push(`Diagnósticos: ${formatValue(formData.diagnosis)}`)
  if (formData.medication) lines.push(`Medicações: ${formatValue(formData.medication)}`)
  if (formData.routine) lines.push(`Rotina: ${formatValue(formData.routine)}`)

  lines.push("")
  lines.push(`Motivo da terapia: ${formatValue(formData.reason)}`)
  lines.push("")
  lines.push(`Objetivos (3 meses): ${formatValue(formData.goals)}`)
  if (formData.additional) {
    lines.push("")
    lines.push(`Observações: ${formatValue(formData.additional)}`)
  }

  lines.push("")
  lines.push("---")
  lines.push(`Enviado em: ${new Date().toLocaleString("pt-BR")}`)

  return lines.join("\n")
}

async function sendViaWhatsApp(formData: any, phoneDestination: string) {
  const phoneNormalized = normalizePhoneNumber(phoneDestination)
  const message = formatFormMessage(formData)

  const response = await fetch(`${uazapiBaseUrl}/send/text`, {
    method: "POST",
    headers: {
      token: uazapiToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      number: phoneNormalized,
      text: message,
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`uazAPI error: ${response.status} - ${errorData}`)
  }

  return response.json()
}

async function processQueue() {
  console.log("[Queue Processor] Iniciando processamento...")

  try {
    const { data: items, error } = await supabase
      .from("submission_queue")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10)

    if (error) throw error

    console.log(`[Queue] ${items?.length || 0} itens pendentes`)

    for (const item of items || []) {
      try {
        console.log(`[Queue] Processando item ${item.id}...`)

        await sendViaWhatsApp(item.form_data, item.phone_destination)

        await supabase
          .from("submission_queue")
          .update({
            status: "processed",
            attempts: item.attempts + 1,
            processed_at: new Date().toISOString(),
          })
          .eq("id", item.id)

        console.log(`[Queue] ✅ Item ${item.id} processado`)
      } catch (error) {
        const newAttempts = item.attempts + 1
        const maxAttempts = 5
        const newStatus = newAttempts >= maxAttempts ? "failed" : "pending"

        await supabase
          .from("submission_queue")
          .update({
            status: newStatus,
            attempts: newAttempts,
            error_message: error instanceof Error ? error.message : String(error),
            last_error_at: new Date().toISOString(),
          })
          .eq("id", item.id)

        if (newStatus === "failed") {
          console.error(`[Queue] ❌ Item ${item.id} falhou após ${maxAttempts} tentativas`)
        } else {
          console.log(`[Queue] ⏳ Item ${item.id} retry (tentativa ${newAttempts}/${maxAttempts})`)
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log("[Queue] ✅ Processamento concluído")
    return new Response(JSON.stringify({ success: true, processed: items?.length || 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[Queue] Erro:", error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

serve(async (req) => {
  if (req.method === "POST") {
    return await processQueue()
  }
  return new Response("Queue Processor - POST to process", { status: 200 })
})
EOF

  echo -e "${GREEN}✅ Edge Function criada${NC}"
else
  echo -e "${YELLOW}⚠ Supabase CLI não instalada${NC}"
  echo "   Para instalar: npm install -g supabase"
  echo "   Depois rode: supabase functions deploy process-queue"
fi

echo ""

# ============================================
# PASSO 3: Atualizar .env.local
# ============================================
echo -e "${YELLOW}📝 PASSO 3: Configurando .env.local...${NC}"

if [ -f ".env.local" ]; then
  # Atualizar variáveis se existirem, ou adicionar
  if grep -q "VITE_SUPABASE_URL" .env.local; then
    sed -i '' "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=${SUPABASE_URL}|" .env.local
  else
    echo "VITE_SUPABASE_URL=${SUPABASE_URL}" >> .env.local
  fi

  if grep -q "VITE_SUPABASE_ANON_KEY" .env.local; then
    sed -i '' "s|VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}|" .env.local
  else
    echo "VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}" >> .env.local
  fi

  echo -e "${GREEN}✅ .env.local atualizado${NC}"
else
  echo -e "${RED}⚠ .env.local não encontrado, criando novo...${NC}"
  cat > .env.local << EOF
VITE_UAZAPI_BASE_URL=https://varia.uazapi.com
VITE_UAZAPI_TOKEN=dfe5c844-a39e-4ab6-9223-dcf40b442e1d
VITE_WHATSAPP_DESTINATION=554899298643
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
VITE_EMAIL_DESTINATION=formulario@vandermaria.com.br
EOF
  echo -e "${GREEN}✅ .env.local criado${NC}"
fi

echo ""

# ============================================
# PASSO 4: Criar arquivo de secrets para produção
# ============================================
echo -e "${YELLOW}🔐 PASSO 4: Criando arquivo de secrets para produção...${NC}"

cat > .env.production.example << EOF
# 🔐 PRODUÇÃO - Adicione essas variáveis em:
# - Vercel Dashboard → Settings → Environment Variables
# - OU Cloudflare Dashboard → Settings → Environment Variables

# Supabase
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# uazAPI
VITE_UAZAPI_BASE_URL=https://varia.uazapi.com
VITE_UAZAPI_TOKEN=dfe5c844-a39e-4ab6-9223-dcf40b442e1d
VITE_WHATSAPP_DESTINATION=554899298643
VITE_EMAIL_DESTINATION=formulario@vandermaria.com.br

# Backend/Cron (para scripts de processamento)
SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
EOF

echo -e "${GREEN}✅ .env.production.example criado${NC}"
echo ""

# ============================================
# RESUMO
# ============================================
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    ✅ SETUP CONCLUÍDO                        ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Arquivos criados/atualizados:${NC}"
echo "  ✓ Tabela submission_queue no Supabase"
echo "  ✓ supabase/functions/process-queue/index.ts"
echo "  ✓ .env.local (atualizado com credenciais)"
echo "  ✓ .env.production.example"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "  1. Instalar Supabase CLI: npm install -g supabase"
echo "  2. Deploy function: supabase functions deploy process-queue"
echo "  3. Agendar Cron em Supabase Dashboard → Cron"
echo "  4. Ou usar Vercel Cron se hospedar em Vercel"
echo ""
echo -e "${YELLOW}Para testar localmente:${NC}"
echo "  npm run dev"
echo "  Preencher formulário com token inválido de uazAPI"
echo "  Verificar Supabase Dashboard → Tables → submission_queue"
echo ""
echo -e "${GREEN}🎉 Sistema de fila pronto para usar!${NC}"
