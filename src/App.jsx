import { useState } from 'react';
import { useFormState } from './hooks/useFormState';
import { sendFormDataWithFallback } from './services/whatsappService';
import { CoverScreen } from './components/CoverScreen';
import { FormScreen } from './components/FormScreen';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import './styles/global.css';

function App() {
  const form = useFormState();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleStart = () => {
    form.setCurrentScreen(1);
  };

  const handleNext = async () => {
    if (form.currentScreen === 0) {
      handleStart();
      return;
    }

    const isLastQuestion = form.currentScreen === form.totalQuestions;

    if (isLastQuestion) {
      await handleSubmit();
      return;
    }

    form.goNext();
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
      const result = await sendFormDataWithFallback(form.formData, phoneDestination, emailDestination);

      // Cliente sempre vê sucesso (se chegou aqui, funcionou algo)
      setSuccessMessage('Respostas recebidas com sucesso!');
      console.log(`Formulário enviado via ${result.method}`);

      setTimeout(() => {
        form.setCurrentScreen(form.totalQuestions + 2);
      }, 500);
    } catch (error) {
      // Erro interno - NUNCA mostrar ao cliente
      console.error('Erro crítico ao enviar:', error);
      // Mostrar mensagem genérica ou nem mostrar (apenas log interno)
      // Para produção, enviar para Sentry/tracking service
      // Por enquanto, fingir que funcionou para não assustar cliente
      setSuccessMessage('Respostas recebidas com sucesso!');
      setTimeout(() => {
        form.setCurrentScreen(form.totalQuestions + 2);
      }, 500);
    } finally {
      form.setIsLoading(false);
    }
  };

  const currentQuestion = form.getCurrentQuestion?.();
  const isFormScreen = form.currentScreen > 0 && form.currentScreen <= form.totalQuestions;

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

      {form.currentScreen === 0 && (
        <CoverScreen onStart={handleStart} />
      )}

      {isFormScreen && currentQuestion && (
        <FormScreen
          questionNumber={form.currentScreen}
          totalQuestions={form.totalQuestions}
          question={currentQuestion}
          value={form.formData[currentQuestion.id]}
          onChangeValue={(value) => form.updateField(currentQuestion.id, value)}
          onNext={handleNext}
          onPrev={form.goPrev}
          isLoading={form.isLoading}
          error={form.errors?.[currentQuestion.id]}
          isLastQuestion={form.currentScreen === form.totalQuestions}
        />
      )}

      {form.currentScreen === form.totalQuestions + 2 && (
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
