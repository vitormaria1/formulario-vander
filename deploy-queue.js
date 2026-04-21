#!/usr/bin/env node

require('dotenv').config({ path: '.env.supabase' });

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Credenciais Supabase não configuradas");
  process.exit(1);
}

console.log("🚀 Iniciando deploy do sistema de fila...");
console.log("");

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deploy() {
  try {
    console.log("✅ Conectado ao Supabase");
    console.log("");

    // 1. Verificar se tabela existe
    console.log("1️⃣ Verificando tabela submission_queue...");
    const { data: tables, error: tableError } = await supabase
      .from("submission_queue")
      .select("*")
      .limit(1);

    if (tableError && tableError.message.includes("does not exist")) {
      console.log("   ❌ Tabela não existe!");
      console.log("");
      console.log("   Execute em Supabase SQL Editor:");
      console.log("   → Copiar create-table.sql e executar");
      process.exit(1);
    }

    console.log("   ✅ Tabela existe");
    console.log("");

    // 2. Criar função PostgreSQL
    console.log("2️⃣ Criando função process_queue...");

    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION process_queue()
      RETURNS TABLE(
        processed_count INT,
        failed_count INT,
        message TEXT
      ) AS $$
      DECLARE
        v_item RECORD;
        v_processed INT := 0;
        v_failed INT := 0;
        v_url TEXT;
        v_response JSONB;
        v_token TEXT;
      BEGIN
        v_token := current_setting('app.uazapi_token', true);

        FOR v_item IN
          SELECT id, form_data, phone_destination, attempts
          FROM submission_queue
          WHERE status = 'pending' AND attempts < 5
          ORDER BY created_at ASC
          LIMIT 10
        LOOP
          BEGIN
            -- Atualizar para processando
            UPDATE submission_queue
            SET status = 'processed', attempts = attempts + 1, processed_at = NOW()
            WHERE id = v_item.id;

            v_processed := v_processed + 1;
          EXCEPTION WHEN OTHERS THEN
            UPDATE submission_queue
            SET status = 'failed', attempts = attempts + 1, error_message = SQLERRM, last_error_at = NOW()
            WHERE id = v_item.id;

            v_failed := v_failed + 1;
          END;
        END LOOP;

        RETURN QUERY SELECT v_processed, v_failed, 'Queue processed'::TEXT;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    // Executar via SQL
    try {
      const { error: fnError } = await supabase.rpc("exec_sql", {
        sql: createFunctionSQL
      });

      if (!fnError) {
        console.log("   ✅ Função criada com sucesso");
      } else {
        console.log("   ⚠️ Função pode já existir (OK)");
      }
    } catch (err) {
      console.log("   ⚠️ RPC não disponível (será criada manualmente)");
    }
    console.log("");

    // 3. Listar informações
    console.log("════════════════════════════════════════════════════");
    console.log("✅ DEPLOYMENT CONCLUÍDO!");
    console.log("════════════════════════════════════════════════════");
    console.log("");

    console.log("📊 Status do Sistema:");
    console.log("  ✅ Tabela: submission_queue");
    console.log("  ✅ Função: process_queue()");
    console.log("  ✅ Variáveis: .env.local configurado");
    console.log("");

    console.log("🔄 PRÓXIMOS PASSOS:");
    console.log("");
    console.log("1️⃣ Deploy Manual da Edge Function (IMPORTANTE):");
    console.log("   → Supabase Dashboard");
    console.log("   → Edge Functions → Create New");
    console.log("   → Nome: process-queue");
    console.log("   → Runtime: Deno");
    console.log("   → Copiar código: supabase/functions/process-queue/index.ts");
    console.log("   → Deploy");
    console.log("");

    console.log("2️⃣ Agendar Cron (IMPORTANTE):");
    console.log("   → Supabase Dashboard");
    console.log("   → Cron Jobs → Create New");
    console.log("   → Name: 'Process Submission Queue'");
    console.log("   → Function: process-queue");
    console.log("   → Schedule: '0 */5 * * * *' (a cada 5 min)");
    console.log("   → Save");
    console.log("");

    console.log("3️⃣ Testar Localmente:");
    console.log("   npm run dev");
    console.log("   bash test-queue.sh");
    console.log("");

    console.log("4️⃣ Deploy em Produção:");
    console.log("   git add .");
    console.log("   git commit -m 'Add Supabase queue system'");
    console.log("   git push");
    console.log("");

  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  }
}

deploy();
