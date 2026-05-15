export const familyOrientationQuestions = [
  // Identificação
  { id: 'email', label: 'E-mail', type: 'email', required: true },
  { id: 'fatherName', label: 'Nome completo do pai', type: 'text', required: true },
  { id: 'motherName', label: 'Nome completo da mãe', type: 'text', required: true },
  { id: 'fatherAge', label: 'Idade do pai', type: 'number', required: true },
  { id: 'motherAge', label: 'Idade da mãe', type: 'number', required: true },
  { id: 'marriageYears', label: 'Tempo de casamento (anos)', type: 'number', required: true },
  { id: 'cityState', label: 'Cidade/estado', type: 'text', required: true },
  { id: 'phone', label: 'WhatsApp para contato', type: 'tel', required: true },

  // Sobre os filhos
  { id: 'childrenCountAges', label: 'Quantos filhos e idades?', type: 'textarea', required: true },
  {
    id: 'childrenSpecialNeeds',
    label: 'Algum filho com diagnóstico, necessidade especial ou em tratamento?',
    type: 'textarea',
    required: true,
  },

  // Realidade da família
  { id: 'familyIncome', label: 'Renda familiar (valor exato)', type: 'text', required: true },
  {
    id: 'workOutsideChildcare',
    label: 'Ambos trabalham fora? Quem fica com as crianças no dia a dia?',
    type: 'textarea',
    required: true,
  },
  { id: 'supportNetwork', label: 'Têm rede de apoio (avós, família, comunidade)?', type: 'textarea', required: true },

  // O que motivou a busca
  {
    id: 'currentChallenges',
    label: 'Quais são os principais desafios com os filhos hoje?',
    type: 'textarea',
    required: true,
  },
  { id: 'challengeDuration', label: 'Há quanto tempo essa situação se arrasta?', type: 'text', required: true },
  {
    id: 'coupleAlignment',
    label: 'Vocês estão alinhados como casal na forma de educar? Onde mais divergem?',
    type: 'textarea',
    required: true,
  },
  {
    id: 'previousHelp',
    label: 'Já buscaram ajuda antes (psicólogo, pediatra, escola)?',
    type: 'textarea',
    required: true,
  },

  // Fé e comunidade
  { id: 'churchCommunity', label: 'Participam de alguma igreja ou comunidade cristã?', type: 'textarea', required: true },

  // Expectativas
  { id: 'expectedOutcome', label: 'O que esperam alcançar com essa orientação?', type: 'textarea', required: true },
];
