import { useState } from 'react';

const QUESTIONS = [
  { id: 'email', label: 'E-mail', type: 'email', required: true },
  { id: 'name', label: 'Nome completo', type: 'text', required: true },
  { id: 'phone', label: 'Número para contato', type: 'tel', required: true },
  { id: 'age', label: 'Idade', type: 'number', required: false },
  { id: 'birthDate', label: 'Data de nascimento', type: 'date', required: false },
  { id: 'address', label: 'Endereço (CEP)', type: 'text', required: false },
  { id: 'religion', label: 'Religião', type: 'text', required: false },
  { id: 'maritalStatus', label: 'Estado civil', type: 'select', required: false, options: ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'Prefiro não informar'] },
  { id: 'profession', label: 'Profissão', type: 'text', required: false },
  { id: 'income', label: 'Renda média', type: 'select', required: false, options: ['Menos de R$ 1.000', 'R$ 1.000 - R$ 3.000', 'R$ 3.000 - R$ 5.000', 'Mais de R$ 5.000', 'Prefiro não informar'] },
  { id: 'therapyHistory', label: 'Já fez terapia? Se sim, por quanto tempo?', type: 'textarea', required: false },
  { id: 'diagnosis', label: 'Já recebeu algum diagnóstico?', type: 'textarea', required: false },
  { id: 'medication', label: 'Toma alguma medicação? Se sim, qual e em qual dosagem?', type: 'textarea', required: false },
  { id: 'routine', label: 'Como é a sua rotina?', type: 'textarea', required: false },
  { id: 'reason', label: 'O que te faz buscar terapia hoje?', type: 'textarea', required: true },
  { id: 'goals', label: 'O que você gostaria de concretizar dentro dos próximos três meses em terapia?', type: 'textarea', required: true },
  { id: 'additional', label: 'Há mais algo que você julgue importante eu saber?', type: 'textarea', required: false },
];

export function useFormState() {
  const [formData, setFormData] = useState({});
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateField = (fieldId, value) => {
    const question = QUESTIONS[currentScreen - 1];
    if (!question) return null;

    if (question.required && !value) {
      return 'Este campo é obrigatório';
    }

    if (fieldId === 'email' && value) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(value)) {
        return 'E-mail inválido';
      }
    }

    if (fieldId === 'phone' && value) {
      const phoneRegex = /^\d{10,11}$/;
      const cleanPhone = value.replace(/\D/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        return 'Telefone deve ter 10 ou 11 dígitos';
      }
    }

    if (fieldId === 'name' && value && value.length < 3) {
      return 'Nome deve ter pelo menos 3 caracteres';
    }

    return null;
  };

  const canAdvance = () => {
    if (currentScreen === 0) return true;

    const question = QUESTIONS[currentScreen - 1];
    if (!question) return true;

    const value = formData[question.id];
    const error = validateField(question.id, value);

    if (error) {
      setErrors({ [question.id]: error });
      return false;
    }

    return true;
  };

  const validateAllFields = () => {
    const newErrors = {};

    QUESTIONS.forEach(question => {
      const value = formData[question.id];
      const error = validateField(question.id, value);
      if (error) {
        newErrors[question.id] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (canAdvance()) {
      setCurrentScreen(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentScreen > 0) {
      setCurrentScreen(prev => prev - 1);
    }
  };

  const getCurrentQuestion = () => {
    return QUESTIONS[currentScreen - 1] || null;
  };

  return {
    formData,
    currentScreen,
    setCurrentScreen,
    isLoading,
    setIsLoading,
    errors,
    updateField,
    goNext,
    goPrev,
    validateAllFields,
    getCurrentQuestion,
    totalQuestions: QUESTIONS.length,
    questions: QUESTIONS,
  };
}
