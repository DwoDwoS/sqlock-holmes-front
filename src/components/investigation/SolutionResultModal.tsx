import { useEffect, useState } from 'react';
import './SolutionResultModal.scss';

interface SolutionResultModalProps {
  show: boolean;
  success: boolean;
  message: string;
  onClose: () => void;
}

const SolutionResultModal = ({ show, success, message, onClose }: SolutionResultModalProps) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(timer);
    }
    setAnimate(false);
  }, [show]);

  if (!show) return null;

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
              {Array.from({ length: 20 }, (_, i) => (
                <span key={i} className="confetti-piece" style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.8}s`,
                  animationDuration: `${1.5 + Math.random() * 1.5}s`,
                }} />
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

export default SolutionResultModal;