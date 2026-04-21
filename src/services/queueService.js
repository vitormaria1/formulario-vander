// Serviço de fila de processamento usando Supabase
// Fallback quando o WhatsApp falha

export async function saveFormToQueue(formData, phoneDestination) {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Credenciais Supabase não configuradas');
      throw new Error('Supabase não configurado');
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/submission_queue`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        form_data: formData,
        phone_destination: phoneDestination,
        status: 'pending',
        attempts: 0,
        created_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Erro ao salvar na fila: ${response.status} - ${errorData}`);
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
