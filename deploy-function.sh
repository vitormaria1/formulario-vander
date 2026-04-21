#!/bin/bash

# Deploy manual da Edge Function via API do Supabase

set -e

# Carregar variáveis
set -a
source .env.supabase
set +a

FUNCTION_NAME="process-queue"
PROJECT_ID="jfltbluknvirjoizhavf"

echo "🚀 Deploy da Edge Function: $FUNCTION_NAME"
echo "📍 Projeto: $PROJECT_ID"
echo ""

# Criar diretório se não existir
mkdir -p supabase/functions/$FUNCTION_NAME

# Ler o arquivo TypeScript
FUNCTION_CODE=$(cat supabase/functions/$FUNCTION_NAME/index.ts)

echo "📤 Enviando função para Supabase..."

# Deploy via REST API
curl -X POST \
  "https://jfltbluknvirjoizhavf.supabase.co/rest/v1/rpc/deploy_function" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$FUNCTION_NAME\",
    \"source_code\": $(echo "$FUNCTION_CODE" | jq -Rs .)
  }" 2>/dev/null || echo "ℹ️ Função será criada via Dashboard"

echo ""
echo "✅ Para completar o deploy:"
echo ""
echo "1️⃣ Abra: https://app.supabase.com/project/jfltbluknvirjoizhavf"
echo "2️⃣ Vá em: Edge Functions → Create New"
echo "3️⃣ Nome: process-queue"
echo "4️⃣ Copie o conteúdo de: supabase/functions/process-queue/index.ts"
echo "5️⃣ Cole no editor e Deploy"
echo ""
echo "6️⃣ Após Deploy, agende o Cron:"
echo "   Cron → Create → Schedule: 0 */5 * * * *"
echo ""
