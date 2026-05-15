import presentationPhoto from '../assets/presentation-photo.png';

export function LandingScreen({ presentation, onSelectPreSession, onSelectFamilyOrientation }) {
  return (
    <div className="screen landing-screen">
      <div className="screen-content">
        <div className="text-section">
          <h1>ANTES DE CONTINUAR</h1>

          <div className="presentation">
            {presentation || (
              <>
                <p>
                  Apresentação do profissional em breve. (Você vai me enviar o conteúdo e eu coloco aqui mantendo o
                  design.)
                </p>
              </>
            )}
          </div>

          <div className="cta-group">
            <button onClick={onSelectPreSession} className="btn-primary">
              TERAPIA DE CASAL →
            </button>
            <button onClick={onSelectFamilyOrientation} className="btn-secondary">
              ORIENTAÇÃO FAMILIAR →
            </button>
          </div>
        </div>

        <div className="photo-section">
          <img src={presentationPhoto} alt="Foto do profissional" className="photo" />
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

        .screen-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          max-width: 1200px;
          width: 100%;
          align-items: center;
        }

        .text-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .text-section h1 {
          font-size: 40px;
          line-height: 1.15;
          font-weight: 400;
          color: var(--color-text-primary);
        }

        .presentation {
          font-size: 16px;
          line-height: 1.6;
          color: var(--color-text-primary);
          opacity: 0.92;
        }

        .cta-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .btn-primary,
        .btn-secondary {
          padding: 14px 24px;
          border: none;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          letter-spacing: 1px;
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
          font-family: var(--font-body);
        }

        .btn-primary {
          background-color: var(--color-accent);
          color: var(--color-background);
        }

        .btn-primary:hover {
          background-color: #5f1515;
        }

        .btn-secondary {
          background: transparent;
          color: var(--color-accent);
          border: 1px solid var(--color-accent);
        }

        .btn-secondary:hover {
          background-color: rgba(122, 28, 28, 0.08);
        }

        .photo-section {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .photo {
          width: 100%;
          max-width: 400px;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .screen-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .text-section h1 {
            font-size: 28px;
          }

          .photo {
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
}
