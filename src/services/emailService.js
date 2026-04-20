function formatFormDataForEmail(formData) {
  const formatValue = (value) => {
    if (!value) return '[Não respondido]';
    return String(value).trim();
  };

  const lines = [
    '📋 RESPOSTAS PRÉ-SESSÃO - FORMULÁRIO VANDER',
    '',
    '--- DADOS PESSOAIS ---',
    `E-mail: ${formatValue(formData.email)}`,
    `Nome: ${formatValue(formData.name)}`,
    `Telefone: ${formatValue(formData.phone)}`,
    `Idade: ${formatValue(formData.age)}`,
    `Data de nascimento: ${formatValue(formData.birthDate)}`,
    `Endereço: ${formatValue(formData.address)}`,
    `Religião: ${formatValue(formData.religion)}`,
    `Estado civil: ${formatValue(formData.maritalStatus)}`,
    `Profissão: ${formatValue(formData.profession)}`,
    `Renda: ${formatValue(formData.income)}`,
    '',
    '--- HISTÓRICO MÉDICO ---',
    `Histórico de terapia: ${formatValue(formData.therapyHistory)}`,
    `Diagnósticos: ${formatValue(formData.diagnosis)}`,
    `Medicações: ${formatValue(formData.medication)}`,
    `Rotina: ${formatValue(formData.routine)}`,
    '',
    '--- OBJETIVOS ---',
    `Motivo da terapia: ${formatValue(formData.reason)}`,
    `Objetivos (3 meses): ${formatValue(formData.goals)}`,
    `Observações: ${formatValue(formData.additional)}`,
    '',
    '---',
    `Data/Hora do envio: ${new Date().toLocaleString('pt-BR')}`,
  ];

  return lines.join('\n');
}

export async function sendFormDataViaEmail(formData, recipientEmail) {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;

  if (!apiKey) {
    console.error('Resend API key not configured');
    throw new Error('Email service not configured');
  }

  const emailBody = formatFormDataForEmail(formData);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'formulario@resend.dev',
        to: recipientEmail,
        subject: `[Formulário Pré-Sessão] ${formData.name}`,
        text: emailBody,
        html: `<pre style="font-family: monospace; white-space: pre-wrap;">${emailBody}</pre>`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Email API error:', errorData);
      throw new Error(`Email service error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
