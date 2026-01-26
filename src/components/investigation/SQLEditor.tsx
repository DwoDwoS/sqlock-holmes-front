import React from 'react';
import Editor from '@monaco-editor/react';

interface SQLEditorProps {
  sqlCode: string;
  onChange: (value: string | undefined) => void;
  onExecute: () => void;
  onShowHints: () => void;
  onSubmit: () => void;
  loading: boolean;
}

const SQLEditor: React.FC<SQLEditorProps> = ({ sqlCode, onChange, onExecute, onShowHints, onSubmit, loading }) => {
  return (
    <div className="editor-container">
      <div className="editor-header">
        <button className="hints-button" onClick={onShowHints}>
          Indices
        </button>
      </div>
      <Editor
        height="400px"
        language="sql"
        value={sqlCode}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
      <button className="execute-button" onClick={onExecute} disabled={loading}>
        {loading ? 'Exécution...' : 'Exécuter'}
      </button>
      <button className="submit-button" onClick={onSubmit} disabled={loading}>
        Soumettre la réponse
      </button>
    </div>
  );
};

export default SQLEditor;