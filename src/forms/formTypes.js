export const FORM_TYPES = {
  PRE_SESSAO: 'pre-sessao',
  ORIENTACAO_FAMILIAR: 'orientacao-familiar',
};

export function isValidFormType(value) {
  return value === FORM_TYPES.PRE_SESSAO || value === FORM_TYPES.ORIENTACAO_FAMILIAR;
}

