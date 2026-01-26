import React from 'react';

interface Hint {
  id?: number;
  content: string;
}

interface HintsModalProps {
  hints: Hint[];
  show: boolean;
  onClose: () => void;
}

const HintsModal: React.FC<HintsModalProps> = ({ hints, show, onClose }) => {
  if (!show) return null;

  return (
    <div className="hints-modal">
      <div className="hints-content">
        <h3>Indices</h3>
        <ul>
          {hints.map((hint, index) => (
            <li key={index}>{hint.content}</li>
          ))}
        </ul>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default HintsModal;