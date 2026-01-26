import React from 'react';

interface ActionsProps {
  onBack: () => void;
}

const Actions: React.FC<ActionsProps> = ({ onBack }) => {
  return (
    <div className="actions">
      <button className="secondary-button" onClick={onBack}>
        Retour aux enquêtes
      </button>
    </div>
  );
};

export default Actions;