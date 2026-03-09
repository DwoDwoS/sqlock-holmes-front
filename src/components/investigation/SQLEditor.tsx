import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import ResultsDisplay from './ResultsDisplay';
import type { SQLResult } from '../../types/investigation';

export interface QueryHistoryEntry {
  query: string;
  timestamp: Date;
}

interface SQLEditorProps {
  sqlCode: string;
  onChange: (value: string | undefined) => void;
  onExecute: (query?: string) => void;
  onShowHints: () => void;
  onSubmit: () => void;
  loading: boolean;
  queryHistory?: QueryHistoryEntry[];
  showHistory?: boolean;
  onToggleHistory?: () => void;
  onLoadQuery?: (query: string) => void;
  results?: SQLResult | null;
}

const SQLEditor: React.FC<SQLEditorProps> = ({ 
  sqlCode, 
  onChange, 
  onExecute, 
  onShowHints, 
  onSubmit, 
  loading,
  queryHistory = [],
  showHistory = false,
  onToggleHistory,
  onLoadQuery,
  results,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      setTimeout(() => {
        editorRef.current?.layout();
      }, 50);
    }
  }, [showHistory]);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.addCommand(
      window.navigator.platform.toLowerCase().includes('mac') 
        ? (2048 | 3)
        : (2048 | 3),
      () => {
        if (!loading && editorRef.current) {
          const currentQuery = editorRef.current.getValue();
          onExecute(currentQuery);
        }
      }
    );
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button className="hints-button" onClick={onShowHints}>
          Indices
        </button>
        {onToggleHistory && (
          <button 
            className="history-button" 
            onClick={onToggleHistory}
            title={showHistory ? "Masquer l'historique" : "Afficher l'historique"}
          >
            {showHistory ? 'Masquer historique' : 'Historique'}
          </button>
        )}
      </div>
      <div className="editor-body">
        <div className="editor-body-left">
          <div className={`editor-wrapper ${showHistory ? 'with-history' : ''}`}>
            <div className="editor-main">
              <Editor
                height="20rem"
                width="100%"
                language="sql"
                value={sqlCode}
                onChange={onChange}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                }}
              />
            </div>
            {showHistory && queryHistory.length > 0 && (
              <div className="query-history-panel">
                <h4>Requêtes précédentes</h4>
                <div className="history-list">
                  {queryHistory.slice().reverse().map((entry, index) => (
                    <div
                      key={queryHistory.length - 1 - index}
                      className="history-entry"
                      onClick={() => onLoadQuery?.(entry.query)}
                      title="Cliquez pour charger cette requête"
                    >
                      <div className="history-timestamp">
                        {formatTimestamp(entry.timestamp)}
                      </div>
                      <div className="history-query">
                        {entry.query.slice(0, 100)}
                        {entry.query.length > 100 ? '...' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="editor-body-right">
            <ResultsDisplay results={results ?? null} />
          </div>
      </div>
      <div className="editor-actions">
        <button className="execute-button" onClick={() => onExecute()} disabled={loading}>
          {loading ? 'Exécution...' : 'Exécuter'}
        </button>
        <button className="submit-button" onClick={onSubmit} disabled={loading}>
          Soumettre la réponse
        </button>
      </div>
    </div>
  );
};

export default SQLEditor;