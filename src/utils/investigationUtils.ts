import type { Investigation, Hint } from '../types/investigation';

export const getMockInvestigationData = (id: number): Investigation => {
  const mockInvestigations = {
    1: {
      id: 1,
      title: 'Le vol du musée',
      description: 'Un tableau de valeur inestimable a disparu du musée national. Les caméras de sécurité ont filmé plusieurs personnes suspectes. Analysez les données pour identifier le voleur.',
      difficulty: 'Facile' as const,
      status: 'En cours' as const,
      databaseId: 'museum_db',
      image: '/museum-heist.webp'
    },
    2: {
      id: 2,
      title: 'Fraudes corporatives',
      description: 'Des transactions suspectes ont été détectées dans les comptes de l\'entreprise TechCorp. Identifiez l\'employé responsable et découvrez comment il a détourné les fonds.',
      difficulty: 'Moyen' as const,
      status: 'En cours' as const,
      databaseId: 'corporate_db',
      image: '/corporate-fraud.webp'
    },
    3: {
      id: 3,
      title: 'Meurtre au Manoir',
      description: 'Lord Blackwood a été retrouvé mort dans sa bibliothèque. Six personnes étaient présentes ce soir-là. Qui est le meurtrier ? Et pourquoi ?',
      difficulty: 'Difficile' as const,
      status: 'En cours' as const,
      databaseId: 'manor_db',
      image: '/manor-murder.webp'
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

export const getDefaultQuery = (investigationId: number): string => {
  const queries: Record<number, string> = {
    1: 'SELECT * FROM museum_employees LIMIT 5;',
    2: 'SELECT * FROM company_employees LIMIT 5;',
    3: 'SELECT * FROM mansion_guests LIMIT 5;',
  };
  return queries[investigationId] || 'SELECT \'Utilisez les indices pour découvrir les tables disponibles\' as hint;';
};

export const getMockHints = (investigationId: number): Hint[] => {
  const mockHints: Record<number, Hint[]> = {
    1: [
      { id: 1, content: 'Les caméras de sécurité ont enregistré les entrées et sorties du musée.' },
      { id: 2, content: 'Vérifiez les horaires d\'arrivée et de départ des employés.' },
      { id: 3, content: 'Le voleur pourrait être quelqu\'un qui connaissait les habitudes du musée.' }
    ],
    2: [
      { id: 1, content: 'Analysez les transactions financières inhabituelles.' },
      { id: 2, content: 'Vérifiez les accès aux comptes sensibles.' },
      { id: 3, content: 'Cherchez des connexions entre les employés et les comptes compromis.' }
    ],
    3: [
      { id: 1, content: 'Tous les invités avaient un mobile potentiel.' },
      { id: 2, content: 'Examinez les alibis de chacun.' },
      { id: 3, content: 'Le testament de Lord Blackwood pourrait révéler des motifs cachés.' }
    ]
  };
  return mockHints[investigationId] || [{ id: 1, content: 'Indices non disponibles pour cette enquête.' }];
};