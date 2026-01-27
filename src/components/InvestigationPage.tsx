import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { getInvestigationDetails, executeSQL, getHints } from '../services/investigationService';
import { InvestigationHeader, SQLEditor, ResultsDisplay, HintsModal, Actions, SubmitSolutionModal } from './investigation';
import { useInvestigationSubmission } from '../hooks/useInvestigationSubmission';
import './InvestigationPage.css';

interface Investigation {
  id: number;
  title: string;
  description: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  status: 'Disponible' | 'En cours' | 'Terminée';
  databaseId: string;
  image?: string;
}

interface SQLResult {
  columns?: string[];
  rows?: unknown[];
  error?: string;
  message?: string;
}

interface Hint {
  id?: number;
  content: string;
}

const getMockInvestigationData = (id: number): Investigation => {
  const mockInvestigations = {
    1: {
      id: 1,
      title: 'Le vol du musée',
      description: 'Un tableau de valeur inestimable a disparu du musée national. Les caméras de sécurité ont filmé plusieurs personnes suspectes. Analysez les données pour identifier le voleur.',
      difficulty: 'Facile' as const,
      status: 'En cours' as const,
      databaseId: 'museum_db',
      image: '/museum-heist.png'
    },
    2: {
      id: 2,
      title: 'Fraudes corporatives',
      description: 'Des transactions suspectes ont été détectées dans les comptes de l\'entreprise TechCorp. Identifiez l\'employé responsable et découvrez comment il a détourné les fonds.',
      difficulty: 'Moyen' as const,
      status: 'En cours' as const,
      databaseId: 'corporate_db',
      image: '/corporate-fraud.png'
    },
    3: {
      id: 3,
      title: 'Meurtre au Manoir',
      description: 'Lord Blackwood a été retrouvé mort dans sa bibliothèque. Six personnes étaient présentes ce soir-là. Qui est le meurtrier ? Et pourquoi ?',
      difficulty: 'Difficile' as const,
      status: 'En cours' as const,
      databaseId: 'manor_db',
      image: '/manor-murder.png'
    }
  };

  return mockInvestigations[id as keyof typeof mockInvestigations] || {
    id,
    title: 'Enquête inconnue',
    description: 'Description non disponible.',
    difficulty: 'Facile' as const,
    status: 'En cours' as const,
    databaseId: 'unknown_db'
  };
};

const getDefaultQuery = (investigationId: number): string => {
  const queries: Record<number, string> = {
    1: 'SELECT * FROM museum_employees LIMIT 5;',
    2: 'SELECT * FROM company_employees LIMIT 5;',
    3: 'SELECT * FROM mansion_guests LIMIT 5;',
  };
  return queries[investigationId] || 'SELECT \'Utilisez les indices pour découvrir les tables disponibles\' as hint;';
};

const InvestigationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const investigationId = id ? parseInt(id) : 1;
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [sqlCode, setSqlCode] = useState<string>(getDefaultQuery(investigationId));
  const [results, setResults] = useState<SQLResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hints, setHints] = useState<Hint[]>([]);
  const [showHints, setShowHints] = useState(false);

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

  useEffect(() => {
    const loadInvestigation = async () => {
      if (!id) return;
            const mockData = getMockInvestigationData(parseInt(id));
      setInvestigation(mockData);
      setSqlCode(getDefaultQuery(parseInt(id)));
            try {
        const data = await getInvestigationDetails(parseInt(id));
        setInvestigation({ ...mockData, ...data, image: data.image || mockData.image });
      } catch {
        console.log('Back-end non disponible, utilisation des données mockées');
      }
    };
    loadInvestigation();
  }, [id]);

  const handleExecuteSQL = async () => {
    if (!id || !investigation) return;
    setLoading(true);
    try {
      const data = await executeSQL({ sql: sqlCode, investigationId: parseInt(id) });
      setResults(data);
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
    if (!id) return;
    try {
      const data = await getHints(parseInt(id));
      setHints(data.map((hint: { id: number; content?: string; text?: string }) => ({ id: hint.id, content: hint.content || hint.text || '' })));
      setShowHints(true);
    } catch (error) {
      console.error('Erreur lors du chargement des indices:', error);
    }
  };

  if (!investigation) {
    return <div>Chargement...</div>;
  }

  const style = investigation.image ? { backgroundImage: `url(${investigation.image})` } : undefined;

  return (
    <div className={`investigation-page investigation-${investigation.id} ${investigation.image ? 'has-image' : ''}`} style={style}>
      <div className="investigation-overlay">
        <InvestigationHeader investigation={investigation} />

        <SQLEditor
          sqlCode={sqlCode}
          onChange={(value) => setSqlCode(value || '')}
          onExecute={handleExecuteSQL}
          onShowHints={handleShowHints}
          onSubmit={openSubmitModal}
          loading={loading}
        />

        <ResultsDisplay results={results} />

        <HintsModal
          hints={hints}
          show={showHints}
          onClose={() => setShowHints(false)}
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