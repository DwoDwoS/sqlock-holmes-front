import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { SQLService } from '../services/sqlService';
import { InvestigationHeader, SQLEditor, ResultsDisplay, HintsModal, Actions, SubmitSolutionModal } from './investigation';
import type { QueryHistoryEntry } from './investigation/SQLEditor';
import { useInvestigationSubmission } from '../hooks/useInvestigationSubmission';
import { useInvestigationData } from '../hooks/useInvestigationData';
import { useHints } from '../hooks/useHints';
import { getDefaultQuery } from '../utils/investigationUtils';
import type { SQLResult } from '../types/investigation';
import './InvestigationPage.css';

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
  const resultsRef = useRef<HTMLDivElement>(null);

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
  } = useInvestigationSubmission(id);

  const handleExecuteSQL = async (queryOverride?: string) => {
    if (!id || !investigation) return;
    setLoading(true);
    const queryToExecute = queryOverride !== undefined ? queryOverride : sqlCode;
    try {
      const data = await SQLService.executeSQL({ sql: queryToExecute, investigationId: parseInt(id) });
      setResults(data);
      setQueryHistory(prev => [...prev, { query: queryToExecute, timestamp: new Date() }]);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
        />

        <ResultsDisplay results={results} ref={resultsRef} />

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

        <Actions onBack={() => navigate('/investigations')} />
      </div>
    </div>
  );
};

export default InvestigationPage;