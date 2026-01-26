import React from 'react';

interface SubmitSolutionModalProps {
  show: boolean;
  onClose: () => void;
  culprit: string;
  setCulprit: (value: string) => void;
  motive: string;
  setMotive: (value: string) => void;
  sqlCode: string;
  loading: boolean;
  onSubmit: () => void;
}

const SubmitSolutionModal: React.FC<SubmitSolutionModalProps> = ({
  show,
  onClose,
  culprit,
  setCulprit,
  motive,
  setMotive,
  sqlCode,
  loading,
  onSubmit,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Confirmer la soumission</h3>
        <p>Choisissez votre méthode de soumission :</p>

        <div className="submission-options">
          <div className="option-section">
            <h4>Option 1 : Champs simples (pour débutants)</h4>
            <label>
              Nom du coupable :
              <input
                type="text"
                value={culprit}
                onChange={(e) => setCulprit(e.target.value)}
                placeholder="Ex: Prénom et Nom du suspect"
              />
            </label>
            <label>
              Motif :
              <input
                type="text"
                value={motive}
                onChange={(e) => setMotive(e.target.value)}
                placeholder="Ex: Motif du crime avec explication détaillée"
              />
            </label>
          </div>

          <div className="option-section">
            <h4>Option 2 : Requête SQL (avancé)</h4>
            <p>Ou utilisez directement votre requête SQL :</p>
            <pre className="sql-preview">{sqlCode}</pre>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Annuler</button>
          <button
            onClick={onSubmit}
            disabled={loading || (!culprit.trim() && !motive.trim() && !sqlCode.trim())}
          >
            {loading ? 'Soumission...' : 'Soumettre'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitSolutionModal;