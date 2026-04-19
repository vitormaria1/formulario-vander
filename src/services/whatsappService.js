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

export { formatFormMessage, normalizePhoneNumber };
