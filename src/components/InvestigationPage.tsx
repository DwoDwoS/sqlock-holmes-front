import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getInvestigationDetails, executeSQL, getHints, startInvestigation } from '../api/api';
import './InvestigationPage.css';

interface Investigation {
  id: number;
  titre: string;
  description: string;
  difficulte: 'Facile' | 'Moyen' | 'Difficile';
  statut: 'Disponible' | 'En cours' | 'Terminée';
  databaseId: string;
  image?: string;
}

interface SQLResult {
  columns?: string[];
  rows?: unknown[];
  error?: string;
  message?: string;
}

const getMockInvestigationData = (id: number): Investigation => {
  const mockInvestigations = {
    1: {
      id: 1,
      titre: 'Le vol du musée',
      description: 'Un tableau de valeur inestimable a disparu du musée national. Les caméras de sécurité ont filmé plusieurs personnes suspectes. Analysez les données pour identifier le voleur.',
      difficulte: 'Facile' as const,
      statut: 'En cours' as const,
      databaseId: 'museum_db',
      image: '/museum-heist.png'
    },
    2: {
      id: 2,
      titre: 'Fraudes corporatives',
      description: 'Des transactions suspectes ont été détectées dans les comptes de l\'entreprise TechCorp. Identifiez l\'employé responsable et découvrez comment il a détourné les fonds.',
      difficulte: 'Moyen' as const,
      statut: 'En cours' as const,
      databaseId: 'corporate_db',
      image: '/corporate-fraud.png'
    },
    3: {
      id: 3,
      titre: 'Meurtre au Manoir',
      description: 'Lord Blackwood a été retrouvé mort dans sa bibliothèque. Six personnes étaient présentes ce soir-là. Qui est le meurtrier ? Et pourquoi ?',
      difficulte: 'Difficile' as const,
      statut: 'En cours' as const,
      databaseId: 'manor_db',
      image: '/manor-murder.png'
    }
  };

  return mockInvestigations[id as keyof typeof mockInvestigations] || {
    id,
    titre: 'Enquête inconnue',
    description: 'Description non disponible.',
    difficulte: 'Facile' as const,
    statut: 'En cours' as const,
    databaseId: 'unknown_db'
  };
};

const InvestigationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [sqlCode, setSqlCode] = useState<string>('SELECT * FROM table_name;');
  const [results, setResults] = useState<SQLResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    const loadInvestigation = async () => {
      if (!id) return;
      
      // Utiliser d'abord les données mockées
      const mockData = getMockInvestigationData(parseInt(id));
      setInvestigation(mockData);
      
      // Essayer de charger depuis l'API si disponible
      try {
        const data = await getInvestigationDetails(parseInt(id));
        setInvestigation(data);
        // Démarrer l'investigation si elle n'est pas déjà en cours
        if (data.statut === 'Disponible') {
          try {
            await startInvestigation(parseInt(id), data.databaseId);
          } catch (startError) {
            console.warn('Impossible de démarrer l\'investigation côté serveur:', startError);
            // Ne pas bloquer l'affichage de la page
          }
        }
      } catch {
        console.log('Back-end non disponible, utilisation des données mockées');
        // Garder les données mockées déjà définies
      }
    };
    loadInvestigation();
  }, [id]);

  const handleExecuteSQL = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await executeSQL(parseInt(id), sqlCode);
      setResults(data);
    } catch (error: unknown) {
      const is404Error = error && typeof error === 'object' && 'response' in error &&
                        error.response && typeof error.response === 'object' && 'status' in error.response &&
                        error.response.status === 404;

      if (is404Error) {
        setResults({ error: 'Le back-end n\'est pas encore implémenté. Cette fonctionnalité sera disponible prochainement.' });
      } else {
        setResults({ error: 'Erreur lors de l\'exécution de la requête.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShowHints = async () => {
    if (!id) return;
    try {
      const data = await getHints(parseInt(id));
      setHints(data);
      setShowHints(true);
    } catch (error) {
      console.error('Erreur lors du chargement des indices:', error);
    }
  };

  if (!investigation) {
    return <div>Chargement...</div>;
  }

  return (
    <div className={`investigation-page investigation-${investigation.id}`} style={investigation.image ? { backgroundImage: `url(${investigation.image})` } : undefined}>
      <div className="investigation-overlay">
        <h1>{investigation.titre}</h1>
        <p className="investigation-plot">{investigation.description}</p>

        <div className="editor-container">
          <div className="editor-header">
            <button className="hints-button" onClick={handleShowHints}>
              Indices
            </button>
          </div>
          <Editor
            height="400px"
            language="sql"
            value={sqlCode}
            onChange={(value) => setSqlCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
          <button className="execute-button" onClick={handleExecuteSQL} disabled={loading}>
            {loading ? 'Exécution...' : 'Exécuter'}
          </button>
        </div>

        {results && (
          <div className="results-container">
            <h3>Résultats</h3>
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </div>
        )}

        {showHints && (
          <div className="hints-modal">
            <div className="hints-content">
              <h3>Indices</h3>
              <ul>
                {hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
              <button onClick={() => setShowHints(false)}>Fermer</button>
            </div>
          </div>
        )}

        <div className="actions">
          <button className="secondary-button" onClick={() => navigate('/investigations')}>
            Retour aux enquêtes
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestigationPage;