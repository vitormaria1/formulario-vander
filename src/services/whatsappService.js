function normalizePhoneNumber(phone) {
  if (!phone) return '';

  const digits = phone.replace(/\D/g, '');

  if (digits.startsWith('55') && digits.length >= 12) {
    return digits;
  }

  if (digits.length >= 10 && digits.length <= 11) {
    return '55' + digits;
  }

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

export async function sendFormDataToWhatsApp(formData, phoneDestination) {
  const baseUrl = import.meta.env.VITE_UAZAPI_BASE_URL || 'https://varia.uazapi.com';
  const token = import.meta.env.VITE_UAZAPI_TOKEN;

  if (!token) {
    throw new Error('Token da uazAPI não configurado. Verifique .env');
  }

  const phoneNormalized = normalizePhoneNumber(phoneDestination);
  if (!phoneNormalized) {
    throw new Error('Número de telefone inválido');
  }

  const message = formatFormMessage(formData);

  const response = await fetch(`${baseUrl}/send/text`, {
    method: 'POST',
    headers: {
      'token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      number: phoneNormalized,
      text: message,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Erro ao enviar: ${response.status} - ${errorData}`);
  }

  return response.json();
}

export async function checkWhatsAppNumber(phone) {
  const token = '5c81a955-e8c3-4d56-9577-557776fa3dd4';
  const baseUrl = 'https://varia.uazapi.com';

  const phoneNormalized = normalizePhoneNumber(phone);
  if (!phoneNormalized) {
    return { valid: false, error: 'Número inválido' };
  }

  try {
    const response = await fetch(`${baseUrl}/chat/check`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': token,
      },
      body: JSON.stringify({
        numbers: [phoneNormalized],
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao verificar: ${response.status}`);
    }

    const data = await response.json();

    if (data.invalid && data.invalid.length > 0) {
      return { valid: false, error: 'WhatsApp não encontrado' };
    }

    if (data.valid && data.valid.length > 0) {
      return { valid: true, message: 'WhatsApp verificado' };
    }

    return { valid: false, error: 'Não foi possível verificar' };
  } catch (err) {
    console.error('Erro ao verificar WhatsApp:', err);
    return { valid: false, error: err.message };
  }
}

export async function sendClientWelcomeMessage(phone, name) {
  const token = '5c81a955-e8c3-4d56-9577-557776fa3dd4';
  const baseUrl = 'https://varia.uazapi.com';

  const phoneNormalized = normalizePhoneNumber(phone);
  if (!phoneNormalized) {
    throw new Error('Número de telefone inválido');
  }

  const firstName = name.split(' ')[0];

  const message = `Bom dia, ${firstName}! Tudo bem com você?

Aqui é o *Vander Maria. Terapeuta de casais.*

Vi que você preencheu o formulário da pré-sessão. Obrigado por confiar no meu trabalho e dar esse passo.

Para alinharmos com clareza, qual é a sua disponibilidade para fazermos a pré-consulta? Você consegue essa semana? Se sim, em quais horários você fica livre?

*Fico no aguardo de sua resposta!*`;

  try {
    const response = await fetch(`${baseUrl}/send/text`, {
      method: 'POST',
      headers: {
        'token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        number: phoneNormalized,
        text: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Erro ao enviar: ${response.status} - ${errorData}`);
    }

    return response.json();
  } catch (err) {
    console.error('Erro ao enviar mensagem ao cliente:', err);
    throw err;
  }
}

export async function sendFormDataWithFallback(formData, phoneDestination, emailDestination) {
  const { saveFormToQueue } = await import('./queueService.js');

  try {
    // Tenta WhatsApp para Vander primeiro
    const whatsappResult = await sendFormDataToWhatsApp(formData, phoneDestination);
    console.log('WhatsApp enviado para Vander:', whatsappResult);

    // Após sucesso para Vander, envia mensagem de boas-vindas para o cliente
    try {
      await sendClientWelcomeMessage(formData.phone, formData.name);
      console.log('Mensagem de boas-vindas enviada ao cliente');
    } catch (clientErr) {
      console.warn('Falha ao enviar mensagem ao cliente, mas formulário foi recebido:', clientErr);
    }

    return {
      success: true,
      method: 'whatsapp',
      data: whatsappResult,
    };
  } catch (whatsappError) {
    console.error('WhatsApp falhou, salvando na fila de processamento:', whatsappError);

    try {
      // Fallback: salva na fila do Supabase para processamento posterior
      const queueResult = await saveFormToQueue(formData, phoneDestination);
      console.log('Formulário salvo na fila (fallback):', queueResult);
      return {
        success: true,
        method: 'queue',
        data: queueResult,
        queued: true,
      };
    } catch (queueError) {
      console.error('Erro ao salvar na fila:', queueError);
      throw new Error('Todos os métodos de envio falharam');
    }
  }
}

export { formatFormMessage, normalizePhoneNumber };
