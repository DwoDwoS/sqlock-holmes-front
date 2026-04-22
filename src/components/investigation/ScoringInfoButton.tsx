import React, { useState, useEffect, useRef } from 'react';

const ScoringInfoButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="scoring-info" ref={containerRef}>
      <button
        className="scoring-info-btn"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        aria-label="Informations sur le calcul des points"
      >
        i
      </button>
      {open && (
        <div className="scoring-tooltip">
          <p><strong>Calcul des points :</strong></p>
          <ul>
            <li><span className="penalty">-1 point</span> par requête utilisée</li>
            <li><span className="penalty">-10 points</span> par indice révélé</li>
          </ul>
          <p className="scoring-tip">
            Un schéma de base de données est disponible à droite de chaque enquête pour éviter les requêtes inutiles.
          </p>
        </div>
      )}
    </div>
  );
};

export default ScoringInfoButton;