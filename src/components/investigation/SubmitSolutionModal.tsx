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

const parseSqlPreview = (sql: string) => {
  const aliasCulprit = sql.match(/['"]([^'"]+)['"]\s+AS\s+solution_culprit/i);
  const aliasMotive = sql.match(/['"]([^'"]+)['"]\s+AS\s+solution_motive/i);
  if (aliasCulprit && aliasMotive) {
    return { culprit: aliasCulprit[1], motive: aliasMotive[1] };
  }

  const assignCulprit = sql.match(/solution_culprit\s*=\s*['"]([^'"]+)['"]/i);
  const assignMotive = sql.match(/solution_motive\s*=\s*['"]([^'"]+)['"]/i);
  if (assignCulprit && assignMotive) {
    return { culprit: assignCulprit[1], motive: assignMotive[1] };
  }

  return null;
};

const SubmitSolutionModal = ({
  show,
  onClose,
  culprit,
  setCulprit,
  motive,
  setMotive,
  sqlCode,
  loading,
  onSubmit,
}: SubmitSolutionModalProps) => {
  if (!show) return null;

  const sqlParsed = sqlCode.trim() ? parseSqlPreview(sqlCode) : null;
  const hasOption1 = culprit.trim() && motive.trim();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="submit-folder" onClick={(e) => e.stopPropagation()}>
        <div className="submit-folder-tab">DOSSIER</div>
        <div className="submit-folder-staple" />
        <div className="submit-folder-content">
          <div className="submit-folder-header">
            <div className="submit-folder-stamp">CLASSIFIED</div>
            <h3>Soumission de preuves</h3>
            <p>Choisissez votre méthode de soumission :</p>
          </div>

        <div className="submission-options">
          <div className={`option-section ${hasOption1 ? 'option-active' : ''}`}>
            <h4>Option 1 : Champs simples</h4>
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
              <span className="info-tooltip">
                <span className="info-icon">i</span>
                <span className="tooltip-text">
                  Indiquez des mots-clés ou une courte phrase expliquant la raison pour laquelle le ou la suspect(e) a commis ce crime (ex: jalousie, vengeance, financier, héritage, etc.)
                </span>
              </span>
              <input
                type="text"
                value={motive}
                onChange={(e) => setMotive(e.target.value)}
                placeholder="Ex: Motif du crime avec explication détaillée"
              />
            </label>
          </div>

          <div className={`option-section ${!hasOption1 && sqlParsed ? 'option-active' : ''}`}>
            <h4>Option 2 : Requête SQL (avancé)</h4>
            <p className="option-instructions">
              Écrivez dans l'éditeur SQL une requête contenant vos réponses avec les alias
              <code>solution_culprit</code> et <code>solution_motive</code>.
            </p>
            <div className="sql-example">
              <span className="sql-example-label">Exemple :</span>
              <pre>SELECT 'Jean Dupont' AS solution_culprit, 'vengeance' AS solution_motive</pre>
            </div>
            {sqlCode.trim() && (
              <div className="sql-preview-section">
                <span className="sql-preview-label">Votre requête actuelle :</span>
                <pre className="sql-preview">{sqlCode}</pre>
                {sqlParsed ? (
                  <div className="sql-parsed-result sql-parsed-success">
                    <span className="sql-parsed-icon">&#10003;</span>
                    Détecté : <strong>{sqlParsed.culprit}</strong> &mdash; <em>{sqlParsed.motive}</em>
                  </div>
                ) : (
                  <div className="sql-parsed-result sql-parsed-error">
                    <span className="sql-parsed-icon">&#10007;</span>
                    Alias <code>solution_culprit</code> et/ou <code>solution_motive</code> non détectés.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {hasOption1 && sqlParsed && (
          <p className="option-priority-note">
            Les champs simples (option 1) seront utilisés en priorité.
          </p>
        )}

        <div className="modal-actions">
          <button onClick={onClose}>Annuler</button>
          <button
            onClick={onSubmit}
            disabled={loading || (!hasOption1 && !sqlParsed)}
          >
            {loading ? 'Soumission...' : 'Soumettre'}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitSolutionModal;