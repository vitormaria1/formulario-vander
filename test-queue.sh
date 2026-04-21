#!/bin/bash

# 🧪 Script de Teste - Fila Supabase

set -a
source .env.local
set +a

echo "🧪 Teste da Fila Supabase"
echo "========================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Verificar variáveis
echo -e "${YELLOW}1️⃣ Verificando variáveis...${NC}"

if [ -z "$VITE_SUPABASE_URL" ]; then
  echo -e "${RED}❌ VITE_SUPABASE_URL não configurada${NC}"
  exit 1
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo -e "${RED}❌ VITE_SUPABASE_ANON_KEY não configurada${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Variáveis OK${NC}"
echo "   URL: $VITE_SUPABASE_URL"
echo ""

# 2. Testar conexão com Supabase
echo -e "${YELLOW}2️⃣ Testando conexão com Supabase...${NC}"

RESPONSE=$(curl -s -X GET \
  "$VITE_SUPABASE_URL/rest/v1/submission_queue?select=count()&limit=1" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Conexão OK${NC}"
  echo "   Response: $BODY"
else
  echo -e "${RED}❌ Erro na conexão (HTTP $HTTP_CODE)${NC}"
  echo "   Response: $BODY"
  exit 1
fi

echo ""

# 3. Contar itens na fila
echo -e "${YELLOW}3️⃣ Contando itens na fila...${NC}"

RESPONSE=$(curl -s -X GET \
  "$VITE_SUPABASE_URL/rest/v1/submission_queue" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY")

TOTAL=$(echo "$RESPONSE" | jq 'length' 2>/dev/null || echo "0")
PENDING=$(echo "$RESPONSE" | jq "[.[] | select(.status == \"pending\")] | length" 2>/dev/null || echo "0")
PROCESSED=$(echo "$RESPONSE" | jq "[.[] | select(.status == \"processed\")] | length" 2>/dev/null || echo "0")
FAILED=$(echo "$RESPONSE" | jq "[.[] | select(.status == \"failed\")] | length" 2>/dev/null || echo "0")

echo -e "${GREEN}✅ Total de items: $TOTAL${NC}"
echo "   📍 Pending: $PENDING"
echo "   ✅ Processed: $PROCESSED"
echo "   ❌ Failed: $FAILED"

echo ""

# 4. Mostrar últimos itens
if [ "$TOTAL" -gt 0 ]; then
  echo -e "${YELLOW}4️⃣ Últimos 3 itens:${NC}"
  echo "$RESPONSE" | jq -r '.[-3:] | .[] | "[\(.id)] Status: \(.status) | Attempts: \(.attempts) | Created: \(.created_at)"' 2>/dev/null || echo "Erro ao ler itens"
else
  echo -e "${YELLOW}4️⃣ Nenhum item na fila ainda${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Teste concluído!${NC}"
echo ""
echo -e "${YELLOW}Próximo passo:${NC}"
echo "  1. npm run dev"
echo "  2. Preencher formulário com token INVÁLIDO de uazAPI"
echo "  3. Enviar formulário"
echo "  4. Rodar este script novamente: bash test-queue.sh"
echo "  5. Deve aparecer 1 item com status = 'pending'"
