// Serviço de fila de processamento usando Supabase
// Fallback quando o WhatsApp falha

export async function saveFormToQueue(formData, phoneDestination, formType) {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Credenciais Supabase não configuradas');
      throw new Error('Supabase não configurado');
    }

    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    };

    const basePayload = {
      form_data: formData,
      phone_destination: phoneDestination,
      status: 'pending',
      attempts: 0,
      created_at: new Date().toISOString(),
    };

    // Compatibilidade: se a coluna `form_type` ainda não existir, tentamos salvar sem ela.
    const tryInsert = async (payload) => {
      return await fetch(`${supabaseUrl}/rest/v1/submission_queue`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
    };

    let response = await tryInsert({ ...basePayload, form_type: formType || null });

    if (!response.ok) {
      const errorText = await response.text();
      const columnMissing = /form_type/i.test(errorText) && /does not exist|unknown column|column/i.test(errorText);

      if (columnMissing) {
        response = await tryInsert(basePayload);
        if (!response.ok) {
          const retryText = await response.text();
          throw new Error(`Erro ao salvar na fila: ${response.status} - ${retryText}`);
        }
      } else {
        throw new Error(`Erro ao salvar na fila: ${response.status} - ${errorText}`);
      }
    }

    console.log('Formulário salvo na fila de processamento');
    return {
      success: true,
      method: 'queue',
      queued: true,
    };
  } catch (error) {
    console.error('Erro ao salvar na fila:', error);
    throw error;
  }
}

export async function getQueueStats() {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/submission_queue?select=status,count()&status=neq.processed`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar fila: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar stats da fila:', error);
    return null;
  }
}
