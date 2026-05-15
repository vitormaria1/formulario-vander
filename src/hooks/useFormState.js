import { useEffect, useMemo, useState } from 'react';

function validateQuestion(question, value) {
  if (!question) return null;

  if (question.required && !value) {
    return 'Este campo é obrigatório';
  }

  if (question.id === 'email' && value) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(value)) {
      return 'E-mail inválido';
    }
  }

  if (question.id === 'phone' && value) {
    const phoneRegex = /^\d{10,11}$/;
    const cleanPhone = String(value).replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return 'Telefone deve ter 10 ou 11 dígitos';
    }
  }

  if (question.id === 'name' && value && String(value).length < 3) {
    return 'Nome deve ter pelo menos 3 caracteres';
  }

  return null;
}

export function useFormState(questions) {
  const questionsKey = useMemo(() => (questions || []).map(q => q.id).join('|'), [questions]);
  const [formData, setFormData] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({});
    setCurrentIndex(0);
    setIsLoading(false);
    setErrors({});
  }, [questionsKey]);

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

  const canAdvance = () => {
    const question = questions?.[currentIndex];
    if (!question) return true;

    const value = formData[question.id];
    const error = validateQuestion(question, value);

    if (error) {
      setErrors({ [question.id]: error });
      return false;
    }

    return true;
  };

  const validateAllFields = () => {
    const newErrors = {};

    (questions || []).forEach(question => {
      const value = formData[question.id];
      const error = validateQuestion(question, value);
      if (error) {
        newErrors[question.id] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (canAdvance()) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const getCurrentQuestion = () => {
    return questions?.[currentIndex] || null;
  };

  return {
    formData,
    currentIndex,
    setCurrentIndex,
    isLoading,
    setIsLoading,
    errors,
    updateField,
    goNext,
    goPrev,
    validateAllFields,
    getCurrentQuestion,
    totalQuestions: questions?.length || 0,
    questions: questions || [],
  };
}
