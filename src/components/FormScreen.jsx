export function FormScreen({
  questionNumber,
  totalQuestions,
  question,
  value,
  onChangeValue,
  onNext,
  onPrev,
  isLoading,
  error,
  isLastQuestion,
}) {
  const formatPhoneInput = (val) => {
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneInput(e.target.value);
    onChangeValue(formatted);
  };

  const canAdvance = () => {
    if (!question.required && !value) return true;

    if (question.required && !value) return false;

    if (question.id === 'email' && value) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(value)) return false;
    }

    if (question.id === 'phone' && value) {
      const cleanPhone = value.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 11) return false;
    }

    if (question.id === 'name' && value && value.length < 3) {
      return false;
    }

    return true;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLastQuestion && e.ctrlKey === false) {
      if (question.type !== 'textarea' && canAdvance()) {
        onNext();
      }
    }
  };

  const handleClickNext = () => {
    if (!canAdvance()) {
      return;
    }
    onNext();
  };

  const renderInput = () => {
    switch (question.type) {
      case 'email':
        return (
          <input
            type="email"
            value={value || ''}
            onChange={e => onChangeValue(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        );

      case 'tel':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={handlePhoneChange}
            onKeyPress={handleKeyPress}
            placeholder="(11) 99999-9999"
            maxLength="15"
            autoFocus
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={e => onChangeValue(e.target.value)}
            autoFocus
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={e => onChangeValue(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={e => onChangeValue(e.target.value)}
            autoFocus
          >
            <option value="">Selecione uma opção...</option>
            {question.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={e => onChangeValue(e.target.value)}
            rows="5"
            autoFocus
          />
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={e => onChangeValue(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        );
    }
  };

  return (
    <div className="screen form-screen">
      <div className="form-content">
        <div className="question-header">
          <span className="question-number">
            {String(questionNumber).padStart(2, '0')} de {String(totalQuestions).padStart(2, '0')}
          </span>
        </div>

        <div className="form-group">
          <label className="question-label">{question.label}</label>
          <div className="input-wrapper">
            {renderInput()}
            {error && <span className="error-message">{error}</span>}
          </div>
        </div>

        <div className="button-group">
          {questionNumber > 1 && (
            <button onClick={onPrev} disabled={isLoading} className="btn-secondary">
              ← VOLTAR
            </button>
          )}

          <button
            onClick={handleClickNext}
            disabled={isLoading || !canAdvance()}
            className="btn-primary"
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span> ENVIANDO...
              </>
            ) : isLastQuestion ? (
              'ENVIAR RESPOSTAS →'
            ) : (
              'AVANÇAR →'
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .screen {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .form-content {
          width: 100%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .question-header {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .question-number {
          font-size: 14px;
          color: var(--color-text-light);
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .question-label {
          font-size: 18px;
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1.3;
        }

        .input-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        input, textarea, select {
          font-size: 16px;
          color: var(--color-text-primary);
          border: none;
          border-bottom: 1px solid var(--color-text-primary);
          padding: 8px 0;
          background-color: transparent;
          font-family: var(--font-body);
          transition: border-color 0.2s ease;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-bottom-color: var(--color-accent);
        }

        input::placeholder, textarea::placeholder {
          color: var(--color-text-light);
        }

        .button-group {
          display: flex;
          gap: 16px;
          justify-content: flex-start;
          margin-top: 20px;
        }

        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          letter-spacing: 1px;
          transition: background-color 0.2s ease;
          font-family: var(--font-body);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background-color: var(--color-accent);
          color: var(--color-background);
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #5f1515;
        }

        .btn-secondary {
          background-color: var(--color-border);
          color: var(--color-text-primary);
        }

        .btn-secondary:hover:not(:disabled) {
          background-color: #b3b3b3;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          color: var(--color-error);
          font-size: 14px;
          margin-top: 4px;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid var(--color-background);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-content {
            gap: 30px;
          }

          .question-label {
            font-size: 16px;
          }

          .button-group {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}
