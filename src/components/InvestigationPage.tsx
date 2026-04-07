import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Database } from 'lucide-react';
import { SQLService } from '../services/sqlService';
import { InvestigationHeader, SQLEditor, HintsModal, Actions, SubmitSolutionModal, SolutionResultModal } from './investigation';
import type { QueryHistoryEntry } from './investigation/SQLEditor';
import { useInvestigationSubmission } from '../hooks/useInvestigationSubmission';
import { useInvestigationData } from '../hooks/useInvestigationData';
import { useHints } from '../hooks/useHints';
import { getDefaultQuery } from '../utils/investigationUtils';
import type { SQLResult } from '../types/investigation';
import './InvestigationPage.scss';
import { DatabaseSchema } from './investigation/DatabaseSchema';

const InvestigationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const investigationId = id ? parseInt(id) : 1;
  const { investigation, error: dataError } = useInvestigationData(id);
  const { hints, hintCount, loadHints, unlockNextHint } = useHints(investigationId);
  const [sqlCode, setSqlCode] = useState<string>(getDefaultQuery(investigationId));
  const [results, setResults] = useState<SQLResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [loading, setLoading] = useState(false);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSchema, setShowSchema] = useState(false);

  const {
    culprit,
    setCulprit,
    motive,
    setMotive,
    showSubmitModal,
    loading: submitLoading,
    handleSubmit,
    openSubmitModal,
    closeSubmitModal,
    solutionResult,
    handleResultClose,
  } = useInvestigationSubmission(id);

  const handleExecuteSQL = async (queryOverride?: string) => {
    if (!id || !investigation) return;
    setLoading(true);
    const queryToExecute = queryOverride !== undefined ? queryOverride : sqlCode;
    try {
      const data = await SQLService.executeSQL({ sql: queryToExecute, investigationId: parseInt(id) });
      setResults(data);
      setQueryHistory(prev => [...prev, { query: queryToExecute, timestamp: new Date() }]);
    } catch (error) {
      let errorMessage = 'Erreur lors de l\'exécution de la requête.';
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          errorMessage = 'Le back-end n\'est pas encore implémenté. Cette fonctionnalité sera disponible prochainement.';
        } else if (error.response?.status === 403) {
          errorMessage = 'Accès refusé. Vérifiez vos permissions ou contactez un administrateur.';
        }
      }
      setResults({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleShowHints = async () => {
    await loadHints();
    setShowHints(true);
  };


  const handleToggleHistory = () => {
    setShowHistory(prev => !prev);
  };

  const handleLoadQuery = (query: string) => {
    setSqlCode(query);
  };
  const handleCloseHints = () => {
    setShowHints(false);
  };

  if (!investigation) {
    return <div>Chargement...</div>;
  }

  const style = investigation.image ? { backgroundImage: `url(${investigation.image})` } : undefined;

  return (
    <div className={`investigation-page investigation-${investigation.id} ${investigation.image ? 'has-image' : ''}`} style={style}>
      <div className="investigation-overlay">
        {dataError && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            padding: '12px 16px',
            marginBottom: '16px',
            color: '#856404',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{dataError}</span>
          </div>
        )}
        <InvestigationHeader investigation={investigation} />

        <div className="investigation-editor-layout">
            <div className="investigation-editor-main">
              <SQLEditor
                sqlCode={sqlCode}
                onChange={(value) => setSqlCode(value || '')}
                onExecute={handleExecuteSQL}
                onShowHints={handleShowHints}
                onSubmit={openSubmitModal}
                loading={loading}
                queryHistory={queryHistory}
                showHistory={showHistory}
                onToggleHistory={handleToggleHistory}
                onLoadQuery={handleLoadQuery}
                results={results}
                onToggleSchema={() => setShowSchema(prev => !prev)}
                showSchema={showSchema}
              />
            </div>
          </div>

        <HintsModal
          hints={hints}
          show={showHints}
          onClose={handleCloseHints}
          revealedCount={hints.length}
          onRevealNext={unlockNextHint}
          hasMoreHints={hintCount ? hintCount.remaining > 0 : false}
        />

        <SubmitSolutionModal
          show={showSubmitModal}
          onClose={closeSubmitModal}
          culprit={culprit}
          setCulprit={setCulprit}
          motive={motive}
          setMotive={setMotive}
          sqlCode={sqlCode}
          loading={submitLoading}
          onSubmit={() => handleSubmit(sqlCode)}
        />

        {solutionResult && (
          <SolutionResultModal
            show={!!solutionResult}
            success={solutionResult.success}
            message={solutionResult.message}
            onClose={handleResultClose}
          />
        )}

        <Actions onBack={() => navigate('/investigations')} />
        <button
          className={`schema-float-trigger${showSchema ? ' schema-float-trigger--open' : ''}`}
          onClick={() => setShowSchema(prev => !prev)}
          title="Schéma de base de données"
        >
          <Database size={26} />
          <span className="schema-float-label">Schéma</span>
        </button>
        <div className={`schema-float-panel${showSchema ? ' schema-float-panel--open' : ''}`}>
          <div className="schema-float-panel-inner">
            <DatabaseSchema investigationId={investigationId} />
          </div>
        </div>
        {showSchema && (
          <div className="schema-float-backdrop" onClick={() => setShowSchema(false)} />
        )}
      </div>
    </div>
  );
};

export default InvestigationPage;