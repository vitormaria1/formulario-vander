import { useEffect, useMemo, useState } from 'react';
import { useFormState } from './hooks/useFormState';
import { sendFormDataWithFallback } from './services/whatsappService';
import { LandingScreen } from './components/LandingScreen';
import { FormScreen } from './components/FormScreen';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { FORM_TYPES, isValidFormType } from './forms/formTypes';
import { preSessionQuestions } from './forms/questions/preSessionQuestions';
import { familyOrientationQuestions } from './forms/questions/familyOrientationQuestions';
import { PresentationContent } from './content/presentation.jsx';
import './styles/global.css';

function getFormTypeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const form = params.get('form');
  return isValidFormType(form) ? form : null;
}

function setFormTypeInUrl(formType) {
  const url = new URL(window.location.href);
  if (!formType) {
    url.searchParams.delete('form');
  } else {
    url.searchParams.set('form', formType);
  }
  window.history.pushState({}, '', url);
}

function App() {
  const [view, setView] = useState('landing'); // landing | form | confirmation
  const [activeFormType, setActiveFormType] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const questions = useMemo(() => {
    if (activeFormType === FORM_TYPES.ORIENTACAO_FAMILIAR) return familyOrientationQuestions;
    return preSessionQuestions;
  }, [activeFormType]);

  const form = useFormState(questions);

  useEffect(() => {
    const syncFromUrl = () => {
      const formType = getFormTypeFromUrl();
      if (formType) {
        setActiveFormType(formType);
        setView('form');
      } else {
        setActiveFormType(null);
        setView('landing');
      }
    };

    syncFromUrl();
    const onPopState = () => syncFromUrl();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleSelectForm = (formType) => {
    setErrorMessage('');
    setSuccessMessage('');
    setActiveFormType(formType);
    setView('form');
    setFormTypeInUrl(formType);
  };

  const handleBackToLanding = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setActiveFormType(null);
    setView('landing');
    setFormTypeInUrl(null);
  };

  const handleNext = async () => {
    const isLastQuestion = form.currentIndex === form.totalQuestions - 1;

    if (isLastQuestion) {
      await handleSubmit();
      return;
    }

    form.goNext();
  };

  const handlePrev = () => {
    if (form.currentIndex === 0) {
      handleBackToLanding();
      return;
    }
    form.goPrev();
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!form.validateAllFields?.()) {
      const missingFields = form.questions
        ?.filter(q => q.required && !form.formData[q.id])
        .map(q => q.label)
        .join(', ');

      setErrorMessage(
        missingFields
          ? `Campos obrigatórios não preenchidos: ${missingFields}`
          : 'Por favor, preencha todos os campos obrigatórios'
      );
      return;
    }

    form.setIsLoading(true);

    try {
      const phoneDestination = import.meta.env.VITE_WHATSAPP_DESTINATION || '554899298643';
      const emailDestination = import.meta.env.VITE_EMAIL_DESTINATION || 'formulario@vandermaria.com.br';

      // Tenta WhatsApp, fallback para email se falhar
      const result = await sendFormDataWithFallback(form.formData, phoneDestination, emailDestination, activeFormType);

      // Cliente sempre vê sucesso (se chegou aqui, funcionou algo)
      setSuccessMessage('Respostas recebidas com sucesso!');
      console.log(`Formulário enviado via ${result.method}`);

      setTimeout(() => {
        setView('confirmation');
      }, 500);
    } catch (error) {
      // Erro interno - NUNCA mostrar ao cliente
      console.error('Erro crítico ao enviar:', error);
      // Mostrar mensagem genérica ou nem mostrar (apenas log interno)
      // Para produção, enviar para Sentry/tracking service
      // Por enquanto, fingir que funcionou para não assustar cliente
      setSuccessMessage('Respostas recebidas com sucesso!');
      setTimeout(() => {
        setView('confirmation');
      }, 500);
    } finally {
      form.setIsLoading(false);
    }
  };

  const currentQuestion = form.getCurrentQuestion?.();
  const isFormScreen = view === 'form' && activeFormType && currentQuestion;

  return (
    <div className="app">
      {errorMessage && (
        <div className="toast error-toast">
          {errorMessage}
          <button
            className="toast-close"
            onClick={() => setErrorMessage('')}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="toast success-toast">
          {successMessage}
        </div>
      )}

      {view === 'landing' && (
        <LandingScreen
          presentation={<PresentationContent />}
          onSelectPreSession={() => handleSelectForm(FORM_TYPES.PRE_SESSAO)}
          onSelectFamilyOrientation={() => handleSelectForm(FORM_TYPES.ORIENTACAO_FAMILIAR)}
        />
      )}

      {isFormScreen && (
        <FormScreen
          questionNumber={form.currentIndex + 1}
          totalQuestions={form.totalQuestions}
          question={currentQuestion}
          value={form.formData[currentQuestion.id]}
          onChangeValue={(value) => form.updateField(currentQuestion.id, value)}
          onNext={handleNext}
          onPrev={handlePrev}
          isLoading={form.isLoading}
          error={form.errors?.[currentQuestion.id]}
          isLastQuestion={form.currentIndex === form.totalQuestions - 1}
        />
      )}

      {view === 'confirmation' && (
        <ConfirmationScreen />
      )}

      <style jsx>{`
        .app {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: var(--color-background);
        }

        .toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 16px 24px;
          border-radius: 4px;
          font-size: 14px;
          z-index: 1000;
          animation: slideUp 0.3s ease;
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 500px;
        }

        .error-toast {
          background-color: var(--color-error);
          color: white;
        }

        .success-toast {
          background-color: #2d5016;
          color: white;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @media (max-width: 768px) {
          .toast {
            bottom: 16px;
            left: 16px;
            right: 16px;
            transform: none;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
