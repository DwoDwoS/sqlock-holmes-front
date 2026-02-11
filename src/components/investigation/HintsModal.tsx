import React from 'react';

interface Hint {
  id?: number;
  content: string;
  locked?: boolean;
}

interface HintsModalProps {
  hints: Hint[];
  show: boolean;
  onClose: () => void;
  revealedCount: number;
  onRevealNext: () => void;
  hasMoreHints: boolean;
}

const HintsModal: React.FC<HintsModalProps> = ({ hints, show, onClose, revealedCount, onRevealNext, hasMoreHints }) => {
  if (!show) return null;

  const revealedHints = hints.slice(0, revealedCount);

  return (
    <div className="hints-modal">
      <div className="hints-content">
        <h3>Indices</h3>
        {revealedHints.length === 0 ? (
          <p>Aucun indice disponible pour le moment.</p>
        ) : (
          <ul>
            {revealedHints.map((hint, index) => (
              <li key={hint.id || index} className={hint.locked ? 'locked' : ''}>
                {hint.locked ? '🔒 Indice verrouillé' : hint.content}
              </li>
            ))}
          </ul>
        )}
        <div className="hints-actions">
          {hasMoreHints && (
            <button className="reveal-button" onClick={onRevealNext}>
              Révéler le prochain indice
            </button>
          )}
          <button className="close-button" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default HintsModal;