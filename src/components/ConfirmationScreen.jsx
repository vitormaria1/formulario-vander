const PHOTO_URL = 'https://jfltbluknvirjoizhavf.supabase.co/storage/v1/object/public/vander/WhatsApp%20Image%202026-04-17%20at%2022.28.38.jpeg';

export function ConfirmationScreen() {
  return (
    <div className="screen confirmation-screen">
      <div className="screen-content">
        <div className="text-section">
          <h1>
            RESPOSTAS<br />
            RECEBIDAS.<br />
            NOS FALAMOS<br />
            EM BREVE.
          </h1>
        </div>

        <div className="photo-section">
          <img src={PHOTO_URL} alt="Vander" className="photo" />
        </div>
      </div>

      <div className="footer">
        <div className="monogram">VM</div>
      </div>

      <style jsx>{`
        .screen {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
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
        }

        .text-section h1 {
          font-size: 56px;
          line-height: 1.15;
          font-weight: 400;
          color: var(--color-text-primary);
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

        .footer {
          position: absolute;
          bottom: 40px;
          width: 100%;
          text-align: center;
        }

        .monogram {
          font-size: 24px;
          font-weight: 700;
          color: var(--color-accent);
          letter-spacing: 2px;
          font-family: var(--font-title);
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

          .footer {
            bottom: 20px;
          }

          .monogram {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
