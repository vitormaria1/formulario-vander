const PHOTO_URL = 'https://jfltbluknvirjoizhavf.supabase.co/storage/v1/object/public/vander/WhatsApp%20Image%202026-04-17%20at%2022.28.38.jpeg';

export function CoverScreen({ onStart }) {
  return (
    <div className="screen cover-screen">
      <div className="screen-content">
        <div className="text-section">
          <h1>
            ANTES DA<br />
            PRIMEIRA<br />
            SESSÃO,<br />
            ALGUMAS<br />
            PERGUNTAS.
          </h1>
          <button onClick={onStart} className="btn-start">
            COMEÇAR →
          </button>
        </div>

        <div className="photo-section">
          <img src={PHOTO_URL} alt="Vander" className="photo" />
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
          gap: 40px;
        }

        .text-section h1 {
          font-size: 56px;
          line-height: 1.15;
          font-weight: 400;
          color: var(--color-text-primary);
        }

        .btn-start {
          align-self: flex-start;
          padding: 14px 32px;
          background-color: var(--color-accent);
          color: var(--color-background);
          border: none;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          letter-spacing: 1px;
          transition: background-color 0.2s ease;
          font-family: var(--font-body);
        }

        .btn-start:hover {
          background-color: #5f1515;
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
            font-size: 32px;
          }

          .photo {
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
}
