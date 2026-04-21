// Script para processar fila de formulários
// Roda via cron job ou Supabase Edge Function

import fetch from 'node-fetch';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const UAZAPI_BASE_URL = process.env.VITE_UAZAPI_BASE_URL || 'https://varia.uazapi.com';
const UAZAPI_TOKEN = process.env.VITE_UAZAPI_TOKEN;
const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 5000;

function normalizePhoneNumber(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55') && digits.length >= 12) return digits;
  if (digits.length >= 10 && digits.length <= 11) return '55' + digits;
  return digits;
}

function formatFormMessage(formData) {
  const formatValue = (value) => {
    if (!value) return '[Não respondido]';
    return String(value).trim();
  };

  const lines = [
    '📋 RESPOSTAS PRÉ-SESSÃO',
    '',
    `E-mail: ${formatValue(formData.email)}`,
    `Nome: ${formatValue(formData.name)}`,
    `Telefone: ${formatValue(formData.phone)}`,
  ];

  if (formData.age) lines.push(`Idade: ${formatValue(formData.age)}`);
  if (formData.birthDate) lines.push(`Data de nascimento: ${formatValue(formData.birthDate)}`);
  if (formData.address) lines.push(`Endereço: ${formatValue(formData.address)}`);
  if (formData.religion) lines.push(`Religião: ${formatValue(formData.religion)}`);
  if (formData.maritalStatus) lines.push(`Estado civil: ${formatValue(formData.maritalStatus)}`);
  if (formData.profession) lines.push(`Profissão: ${formatValue(formData.profession)}`);
  if (formData.income) lines.push(`Renda: ${formatValue(formData.income)}`);

  lines.push('');

  if (formData.therapyHistory) {
    lines.push(`Histórico de terapia: ${formatValue(formData.therapyHistory)}`);
  }

  if (formData.diagnosis) {
    lines.push(`Diagnósticos: ${formatValue(formData.diagnosis)}`);
  }

  if (formData.medication) {
    lines.push(`Medicações: ${formatValue(formData.medication)}`);
  }

  if (formData.routine) {
    lines.push(`Rotina: ${formatValue(formData.routine)}`);
  }

  lines.push('');
  lines.push(`Motivo da terapia: ${formatValue(formData.reason)}`);
  lines.push('');
  lines.push(`Objetivos (3 meses): ${formatValue(formData.goals)}`);

  if (formData.additional) {
    lines.push('');
    lines.push(`Observações: ${formatValue(formData.additional)}`);
  }

  lines.push('');
  lines.push('---');
  lines.push(`Enviado em: ${new Date().toLocaleString('pt-BR')}`);

  return lines.join('\n');
}

async function sendViaWhatsApp(formData, phoneDestination) {
  const phoneNormalized = normalizePhoneNumber(phoneDestination);
  const message = formatFormMessage(formData);

  const response = await fetch(`${UAZAPI_BASE_URL}/send/text`, {
    method: 'POST',
    headers: {
      'token': UAZAPI_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      number: phoneNormalized,
      text: message,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`uazAPI error: ${response.status} - ${errorData}`);
  }

  return response.json();
}

async function fetchPendingItems() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/submission_queue?status=eq.pending&order=created_at.asc&limit=10`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Supabase error: ${response.status}`);
  }

  return response.json();
}

async function updateQueueItem(id, status, attempts, errorMessage = null) {
  const updateData = {
    status,
    attempts,
  };

  if (errorMessage) {
    updateData.error_message = errorMessage;
    updateData.last_error_at = new Date().toISOString();
  }

  if (status === 'processed') {
    updateData.processed_at = new Date().toISOString();
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/submission_queue?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(updateData),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update queue item: ${response.status}`);
  }
}

async function processQueue() {
  console.log('[Queue Processor] Iniciando processamento...');

  try {
    const items = await fetchPendingItems();
    console.log(`[Queue Processor] ${items.length} itens pendentes encontrados`);

    for (const item of items) {
      try {
        console.log(`[Queue Processor] Processando item ${item.id}...`);

        await sendViaWhatsApp(item.form_data, item.phone_destination);

        await updateQueueItem(item.id, 'processed', item.attempts + 1);
        console.log(`[Queue Processor] ✅ Item ${item.id} processado com sucesso`);
      } catch (error) {
        const newAttempts = item.attempts + 1;
        const status = newAttempts >= MAX_ATTEMPTS ? 'failed' : 'pending';

        await updateQueueItem(item.id, status, newAttempts, error.message);

        if (status === 'failed') {
          console.error(`[Queue Processor] ❌ Item ${item.id} falhou após ${MAX_ATTEMPTS} tentativas`);
        } else {
          console.log(`[Queue Processor] ⏳ Item ${item.id} marcado para retry (tentativa ${newAttempts}/${MAX_ATTEMPTS})`);
        }
      }

      // Pequeno delay entre itens
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    }

    console.log('[Queue Processor] Processamento concluído');
  } catch (error) {
    console.error('[Queue Processor] Erro durante processamento:', error);
    process.exit(1);
  }
}

processQueue();
