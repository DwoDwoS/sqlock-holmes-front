import { forwardRef } from 'react';

interface SQLResult {
  columns?: string[];
  rows?: unknown[];
  error?: string;
  message?: string;
}

interface ResultsDisplayProps {
  results: SQLResult | null;
}

const ResultsDisplay = forwardRef<HTMLDivElement, ResultsDisplayProps>(({ results }, ref) => {
  if (!results) {
    return (
      <div className="results-container results-container--empty" ref={ref}>
        <span className="results-placeholder">Exécutez une requête pour voir les résultats ici.</span>
      </div>
    );
  }

  return (
    <div className="results-container" ref={ref}>
      <h3>Résultats</h3>
      <div className="results-pre-wrapper">
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>
    </div>
  );
});

ResultsDisplay.displayName = 'ResultsDisplay';

export default ResultsDisplay;