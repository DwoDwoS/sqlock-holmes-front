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
  if (!results) return null;

  return (
    <div className="results-container" ref={ref}>
      <h3>Résultats</h3>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
});

ResultsDisplay.displayName = 'ResultsDisplay';

export default ResultsDisplay;