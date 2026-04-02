import { useEffect, useState } from 'react';
import './SolutionResultModal.scss';

const CONFETTI_PIECES = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 37 + 13) % 100}%`,
  animationDelay: `${(i * 0.17) % 0.8}s`,
  animationDuration: `${1.5 + ((i * 0.31) % 1.5)}s`,
}));

interface SolutionResultModalProps {
  show: boolean;
  success: boolean;
  message: string;
  onClose: () => void;
}

const SolutionResultInner = ({ success, message, onClose }: Omit<SolutionResultModalProps, 'show'>) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="solution-result-overlay" onClick={onClose}>
      <div
        className={`solution-result-modal ${success ? 'solution-result-modal--success' : 'solution-result-modal--failure'} ${animate ? 'solution-result-modal--animate' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <>
            <div className="solution-result-stamp">AFFAIRE CLASSEE</div>
            <img className="solution-result-icon" src="/sqlock-favicon.png" alt="SQLock Holmes" />
            <h3 className="solution-result-title">Enquete resolue !</h3>
            <p className="solution-result-message">{message || 'Felicitations, detective ! Vous avez resolu cette affaire.'}</p>
            <div className="solution-result-confetti" aria-hidden="true">
              {CONFETTI_PIECES.map((style, i) => (
                <span key={i} className="confetti-piece" style={style} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="solution-result-icon solution-result-icon--failure">&#128270;</div>
            <h3 className="solution-result-title solution-result-title--failure">L'enquete continue...</h3>
            <p className="solution-result-message">{message || 'Ce n\'est pas la bonne piste. Continuez a chercher des indices !'}</p>
          </>
        )}

        <button className="solution-result-btn" onClick={onClose}>
          {success ? 'Retour aux enquetes' : 'Reprendre l\'enquete'}
        </button>
      </div>
    </div>
  );
};

const SolutionResultModal = ({ show, ...props }: SolutionResultModalProps) => {
  if (!show) return null;
  return <SolutionResultInner {...props} />;
};

export default SolutionResultModal;