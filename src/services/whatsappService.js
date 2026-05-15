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

function getFormTitle(formType) {
  if (formType === 'orientacao-familiar') return '📋 RESPOSTAS ORIENTAÇÃO FAMILIAR';
  return '📋 RESPOSTAS PRÉ-SESSÃO';
}

function formatFormMessage(formData, formType) {
  const formatValue = (value) => {
    if (!value) return '[Não respondido]';
    return String(value).trim();
  };

  const lines = [
    getFormTitle(formType),
    '',
    `E-mail: ${formatValue(formData.email)}`,
    `Telefone: ${formatValue(formData.phone)}`,
  ];

  if (formType === 'orientacao-familiar') {
    lines.splice(2, 0, `Pai: ${formatValue(formData.fatherName)}`);
    lines.splice(3, 0, `Mãe: ${formatValue(formData.motherName)}`);

    lines.push('');
    lines.push('👤 IDENTIFICAÇÃO');
    lines.push(`Idade do pai: ${formatValue(formData.fatherAge)}`);
    lines.push(`Idade da mãe: ${formatValue(formData.motherAge)}`);
    lines.push(`Tempo de casamento (anos): ${formatValue(formData.marriageYears)}`);
    lines.push(`Cidade/estado: ${formatValue(formData.cityState)}`);

    lines.push('');
    lines.push('👧👦 SOBRE OS FILHOS');
    lines.push(`Filhos (qtd/idades): ${formatValue(formData.childrenCountAges)}`);
    lines.push(`Diagnóstico/necessidade/tratamento: ${formatValue(formData.childrenSpecialNeeds)}`);

    lines.push('');
    lines.push('🏠 REALIDADE DA FAMÍLIA');
    lines.push(`Renda familiar (exata): ${formatValue(formData.familyIncome)}`);
    lines.push(`Trabalho/rotina com crianças: ${formatValue(formData.workOutsideChildcare)}`);
    lines.push(`Rede de apoio: ${formatValue(formData.supportNetwork)}`);

    lines.push('');
    lines.push('🎯 O QUE MOTIVOU A BUSCA');
    lines.push(`Desafios atuais: ${formatValue(formData.currentChallenges)}`);
    lines.push(`Há quanto tempo: ${formatValue(formData.challengeDuration)}`);
    lines.push(`Alinhamento do casal: ${formatValue(formData.coupleAlignment)}`);
    lines.push(`Ajuda anterior: ${formatValue(formData.previousHelp)}`);

    lines.push('');
    lines.push('⛪ FÉ E COMUNIDADE');
    lines.push(`Igreja/comunidade cristã: ${formatValue(formData.churchCommunity)}`);

    lines.push('');
    lines.push('✅ EXPECTATIVA');
    lines.push(`O que esperam alcançar: ${formatValue(formData.expectedOutcome)}`);
  } else {
    lines.splice(2, 0, `Nome: ${formatValue(formData.name)}`);
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
  }

  lines.push('');
  lines.push('---');
  lines.push(`Enviado em: ${new Date().toLocaleString('pt-BR')}`);

  return lines.join('\n');
}

export async function sendFormDataToWhatsApp(formData, phoneDestination, formType) {
  const baseUrl = import.meta.env.VITE_UAZAPI_BASE_URL || 'https://varia.uazapi.com';
  const token = import.meta.env.VITE_UAZAPI_TOKEN;

  if (!token) {
    throw new Error('Token da uazAPI não configurado. Verifique .env');
  }

  const phoneNormalized = normalizePhoneNumber(phoneDestination);
  if (!phoneNormalized) {
    throw new Error('Número de telefone inválido');
  }

  const message = formatFormMessage(formData, formType);

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
  const baseUrl = import.meta.env.VITE_UAZAPI_BASE_URL || 'https://varia.uazapi.com';
  const token = import.meta.env.VITE_UAZAPI_TOKEN;

  if (!token) {
    throw new Error('Token da uazAPI não configurado. Verifique .env');
  }

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
  const baseUrl = import.meta.env.VITE_UAZAPI_BASE_URL || 'https://varia.uazapi.com';
  const token = import.meta.env.VITE_UAZAPI_TOKEN;

  if (!token) {
    throw new Error('Token da uazAPI não configurado. Verifique .env');
  }

  const phoneNormalized = normalizePhoneNumber(phone);
  if (!phoneNormalized) {
    throw new Error('Número de telefone inválido');
  }

  const safeName = (name || '').trim();
  const firstName = safeName ? safeName.split(' ')[0] : 'Olá';

  const message = `Olá, ${firstName}! Tudo bem com você?

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

export async function sendFamilyOrientationWelcomeMessage(phone, name) {
  const baseUrl = import.meta.env.VITE_UAZAPI_BASE_URL || 'https://varia.uazapi.com';
  const token = import.meta.env.VITE_UAZAPI_TOKEN;

  if (!token) {
    throw new Error('Token da uazAPI não configurado. Verifique .env');
  }

  const phoneNormalized = normalizePhoneNumber(phone);
  if (!phoneNormalized) {
    throw new Error('Número de telefone inválido');
  }

  const safeName = (name || '').trim();
  const firstName = safeName ? safeName.split(' ')[0] : 'Olá';

  const message = `Olá, ${firstName}! Tudo bem?

Recebi suas respostas do formulário de *Orientação Familiar*.

Em breve eu retorno com os próximos passos.`;

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

export async function sendFormDataWithFallback(formData, phoneDestination, emailDestination, formType) {
  const { saveFormToQueue } = await import('./queueService.js');

  try {
    // Tenta WhatsApp para Vander primeiro
    const whatsappResult = await sendFormDataToWhatsApp(formData, phoneDestination, formType);
    console.log('WhatsApp enviado para Vander:', whatsappResult);

    // Após sucesso para Vander, envia mensagem para o cliente
    if (formType === 'orientacao-familiar') {
      try {
        const nameForClient =
          formData.name ||
          formData.fatherName ||
          formData.motherName ||
          'Olá';
        await sendFamilyOrientationWelcomeMessage(formData.phone, nameForClient);
        console.log('Mensagem (orientação familiar) enviada ao cliente');
      } catch (clientErr) {
        console.warn('Falha ao enviar mensagem ao cliente, mas formulário foi recebido:', clientErr);
      }
    } else {
      try {
        await sendClientWelcomeMessage(formData.phone, formData.name);
        console.log('Mensagem de boas-vindas enviada ao cliente');
      } catch (clientErr) {
        console.warn('Falha ao enviar mensagem ao cliente, mas formulário foi recebido:', clientErr);
      }
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
      const queueResult = await saveFormToQueue(formData, phoneDestination, formType);
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
