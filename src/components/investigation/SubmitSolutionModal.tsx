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

  const motiveKeywords = motive.trim().split(/[\s,;]+/).filter(Boolean);
  const hasEnoughKeywordsOption1 = motiveKeywords.length >= 3;

  const sqlMotiveKeywords = sqlParsed
    ? sqlParsed.motive.trim().split(/[\s,;]+/).filter(Boolean)
    : [];
  const hasEnoughKeywordsSql = sqlMotiveKeywords.length >= 3;

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
                  Le système attend un minimum de 3 mots-clés expliquant la raison pour laquelle le ou la suspect(e) a commis ce crime (ex: jalousie, vengeance, financier, héritage, etc.) Pensez à mettre le montant du larcin si c'est une question d'argent.
                </span>
              </span>
              <input
                type="text"
                value={motive}
                onChange={(e) => setMotive(e.target.value)}
                placeholder="Ex: Motif du crime avec explication détaillée"
              />
            </label>
            {motive.trim() && !hasEnoughKeywordsOption1 && (
              <p className="keyword-warning">
                ⚠ Attention : votre motif ne contient que {motiveKeywords.length} mot{motiveKeywords.length > 1 ? 's' : ''}-clé{motiveKeywords.length > 1 ? 's' : ''}. Minimum 3 attendus.
              </p>
            )}
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
                  <>
                  <div className="sql-parsed-result sql-parsed-success">
                    <span className="sql-parsed-icon">&#10003;</span>
                    Détecté : <strong>{sqlParsed.culprit}</strong> &mdash; <em>{sqlParsed.motive}</em>
                  </div>
                  {!hasEnoughKeywordsSql && (
                    <p className="keyword-warning">
                      ⚠ Attention : le motif détecté ne contient que {sqlMotiveKeywords.length} mot{sqlMotiveKeywords.length > 1 ? 's' : ''}-clé{sqlMotiveKeywords.length > 1 ? 's' : ''}. Minimum 3 attendus.
                    </p>
                  )}
                  </>
                ) : (
                  <div className="sql-parsed-result sql-parsed-error">
                    <span className="sql-parsed-icon">&#10007;</span>
                    <span>
                      Alias non détectés :<br />
                      <code>solution_culprit</code> et/ou <code>solution_motive</code>
                    </span>
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