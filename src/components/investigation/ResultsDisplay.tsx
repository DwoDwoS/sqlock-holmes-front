import React from 'react';

interface SQLResult {
  columns?: string[];
  rows?: unknown[];
  error?: string;
  message?: string;
}

interface ResultsDisplayProps {
  results: SQLResult | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results) return null;

  return (
    <div className="results-container">
      <h3>Résultats</h3>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
};

export default ResultsDisplay;