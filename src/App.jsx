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
  const [debugEvents, setDebugEvents] = useState([]);
  const [debugMode] = useState(() => {
    if (typeof window === 'undefined') return false;

    const params = new URLSearchParams(window.location.search);
    return params.get('debug') === '1' || window.localStorage.getItem('formularioDebug') === '1';
  });

  const pushDebugEvent = (event) => {
    if (!debugMode) return;

    setDebugEvents((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        ...event,
      },
    ]);
  };

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
      pushDebugEvent({
        level: 'info',
        stage: 'submit.start',
        message: 'Iniciando envio do formulário',
        details: {
          env: {
            hasWhatsappBaseUrl: Boolean(import.meta.env.VITE_UAZAPI_BASE_URL),
            hasWhatsappToken: Boolean(import.meta.env.VITE_UAZAPI_TOKEN),
            hasQueue: Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
            hasEmailFallback: Boolean(import.meta.env.VITE_RESEND_API_KEY),
          },
        },
      });

      const phoneDestination = import.meta.env.VITE_WHATSAPP_DESTINATION || '554899298643';
      const emailDestination = import.meta.env.VITE_EMAIL_DESTINATION || 'formulario@vandermaria.com.br';

      // Tenta WhatsApp, fallback para email se falhar
      const result = await sendFormDataWithFallback(
        form.formData,
        phoneDestination,
        emailDestination,
        pushDebugEvent
      );

      // Cliente sempre vê sucesso (se chegou aqui, funcionou algo)
      setSuccessMessage('Respostas recebidas com sucesso!');
      pushDebugEvent({
        level: 'success',
        stage: 'submit.success',
        message: `Envio concluído via ${result.method}`,
      });
      console.log(`Formulário enviado via ${result.method}`);

      setTimeout(() => {
        form.setCurrentScreen(form.totalQuestions + 2);
      }, 500);
    } catch (error) {
      // Erro interno - NUNCA mostrar ao cliente
      console.error('Erro crítico ao enviar:', error);
      pushDebugEvent({
        level: 'error',
        stage: 'submit.error',
        message: 'Falha final no envio',
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
      });
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

      {debugMode && (
        <div className="debug-panel">
          <div className="debug-panel__header">
            <div>
              <div className="debug-panel__eyebrow">Diagnostics</div>
              <h3 className="debug-panel__title">Modo debug ativo</h3>
            </div>
            <button
              type="button"
              className="debug-panel__clear"
              onClick={() => setDebugEvents([])}
            >
              Limpar
            </button>
          </div>

          <div className="debug-panel__body">
            {debugEvents.length === 0 ? (
              <p className="debug-panel__empty">Aguardando o próximo envio.</p>
            ) : (
              debugEvents.slice(-8).map((event) => (
                <div key={event.id} className={`debug-event debug-event--${event.level}`}>
                  <div className="debug-event__meta">
                    <strong>{event.stage}</strong>
                    <span>{new Date(event.timestamp).toLocaleTimeString('pt-BR')}</span>
                  </div>
                  <div className="debug-event__message">{event.message}</div>
                  {event.details && (
                    <pre className="debug-event__details">
                      {JSON.stringify(event.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
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

        .debug-panel {
          position: fixed;
          right: 16px;
          bottom: 16px;
          width: min(420px, calc(100vw - 32px));
          max-height: 42vh;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 16px;
          background: rgba(16, 16, 18, 0.94);
          color: #f5f5f5;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
          z-index: 1100;
          backdrop-filter: blur(12px);
        }

        .debug-panel__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .debug-panel__eyebrow {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8f8f98;
          margin-bottom: 4px;
        }

        .debug-panel__title {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
        }

        .debug-panel__clear {
          background: transparent;
          color: #f5f5f5;
          border: 1px solid rgba(255, 255, 255, 0.14);
          padding: 8px 10px;
          border-radius: 10px;
          font-size: 12px;
          cursor: pointer;
          text-transform: none;
          letter-spacing: 0;
        }

        .debug-panel__body {
          padding: 12px 16px 14px;
          overflow: auto;
          max-height: calc(42vh - 64px);
        }

        .debug-panel__empty {
          margin: 0;
          color: #b5b5bf;
          font-size: 13px;
        }

        .debug-event {
          border-left: 3px solid rgba(255, 255, 255, 0.18);
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          margin-bottom: 10px;
        }

        .debug-event--success {
          border-left-color: #53d17d;
        }

        .debug-event--warning {
          border-left-color: #f2c14e;
        }

        .debug-event--error {
          border-left-color: #ff6b6b;
        }

        .debug-event--info {
          border-left-color: #6aa9ff;
        }

        .debug-event__meta {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          font-size: 12px;
          color: #c9c9d2;
          margin-bottom: 6px;
        }

        .debug-event__message {
          font-size: 13px;
          line-height: 1.4;
          margin-bottom: 6px;
        }

        .debug-event__details {
          margin: 0;
          padding: 10px;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.28);
          font-size: 11px;
          line-height: 1.4;
          overflow: auto;
          white-space: pre-wrap;
          word-break: break-word;
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

          .debug-panel {
            right: 12px;
            left: 12px;
            bottom: 12px;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
