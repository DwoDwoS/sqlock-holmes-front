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
    },
    4: {
      id: 4,
      title: 'Le Poison du Chef',
      description: 'Un client prestigieux, le critique gastronomique Philippe Renard, a été hospitalisé après un dîner au restaurant étoilé "Le Cygne Doré". Les analyses révèlent un empoisonnement volontaire. Analysez les données pour trouver qui a empoisonné le critique.',
      difficulty: 'Facile' as const,
      status: 'En cours' as const,
      databaseId: 'poison_db',
      image: '/poison-restaurant.webp'
    },
    5: {
      id: 5,
      title: 'Fuite de Données',
      description: 'La startup MedSecure découvre que les dossiers patients de 50 000 utilisateurs ont été vendus sur le dark web. La fuite vient de l\'intérieur. Croisez les connexions VPN, les accès aux fichiers et les mouvements financiers pour identifier le traître.',
      difficulty: 'Moyen' as const,
      status: 'En cours' as const,
      databaseId: 'dataleak_db',
      image: '/data-leak.webp'
    },
    6: {
      id: 6,
      title: 'Le Mystère du Train de Nuit',
      description: 'Henri Castellan, riche collectionneur, a disparu du train de nuit Paris-Nice. Son compartiment a été retrouvé vide, la fenêtre ouverte, et son diamant de 2 millions d\'euros a été volé. Suicide ? Enlèvement ? La vérité est bien plus tordue.',
      difficulty: 'Difficile' as const,
      status: 'En cours' as const,
      databaseId: 'train_db',
      image: '/train-mystery.webp'
    },
    7: {
      id: 7,
      title: 'Le Kidnapping du Chien Star',
      description: 'Bella, championne de l\'exposition canine nationale, a disparu la veille du grand concours. Son propriétaire est effondré. Jalousie entre concurrents, réputation en jeu, messages haineux sur les forums… Qui a enlevé Bella ?',
      difficulty: 'Facile' as const,
      status: 'En cours' as const,
      databaseId: 'dog_db',
      image: '/dog-kidnapping.webp'
    },
    8: {
      id: 8,
      title: 'L\'Arnaque aux Cryptomonnaies',
      description: 'La plateforme CryptoNova s\'est effondrée du jour au lendemain, emportant les économies de 400 investisseurs. Fausse identité, schéma de Ponzi, fuite à l\'étranger… Retrouvez le cerveau de l\'arnaque avant qu\'il disparaisse.',
      difficulty: 'Facile' as const,
      status: 'En cours' as const,
      databaseId: 'crypto_db',
      image: '/crypto-scam.webp'
    },
    9: {
      id: 9,
      title: 'Le Vandalisme à l\'École',
      description: 'Le lycée Voltaire a été saccagé la nuit suivant le conseil de discipline. Des tags, du mobilier détruit, un trophée brisé. Vengeance d\'un élève renvoyé pour tricherie ? Les badges, caméras et réseaux sociaux ne mentent pas.',
      difficulty: 'Facile' as const,
      status: 'En cours' as const,
      databaseId: 'school_db',
      image: '/school-vandalism.webp'
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
    4: 'SELECT * FROM restaurant_staff LIMIT 5;',
    5: 'SELECT * FROM medsecure_employees LIMIT 5;',
    6: 'SELECT * FROM train_passengers LIMIT 5;',
    7: 'SELECT * FROM dog_show_participants LIMIT 5;',
    8: 'SELECT * FROM platform_employees LIMIT 5;',
    9: 'SELECT * FROM school_badge_access LIMIT 5;',
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
    ],
    4: [
      { id: 1, content: 'Commencez par examiner le rapport médical pour comprendre ce qui est arrivé à la victime.' },
      { id: 2, content: 'Le poison a été ingéré vers 20h45. Quel plat a été servi à cette heure ?' },
      { id: 3, content: 'Consultez les critiques de restaurants pour découvrir un lien entre le chef et la victime.' }
    ],
    5: [
      { id: 1, content: 'Cherchez les connexions VPN nocturnes avec de gros volumes de données téléchargées.' },
      { id: 2, content: 'Qui a téléchargé des fichiers patients en dehors des heures de bureau ?' },
      { id: 3, content: 'Suivez l\'argent : cherchez des virements entrants suspects supérieurs à 10 000€.' }
    ],
    6: [
      { id: 1, content: 'Analysez qui est sorti de son compartiment entre 2h et 4h du matin.' },
      { id: 2, content: 'Comment un passager peut-il émettre un signal téléphonique hors du trajet du train ?' },
      { id: 3, content: 'Ce n\'est peut-être pas un vol ni un meurtre. Regardez les assurances et l\'historique de navigation.' }
    ],
    7: [
      { id: 1, content: 'Consultez la liste des participants : qui avait le plus à perdre face à Bella ?' },
      { id: 2, content: 'Les caméras de sécurité couvrent les entrées et les couloirs. Cherchez des présences inhabituelles la nuit du kidnapping.' },
      { id: 3, content: 'Les messages du forum révèlent des tensions. Cherchez des mentions de jalousie professionnelle et de réputation perdue.' }
    ],
    8: [
      { id: 1, content: 'Commencez par les logs d\'administration : qui avait accès aux fonds clients ?' },
      { id: 2, content: 'Croisez les transactions avec les réservations de vols : quelqu\'un a fui juste avant l\'effondrement.' },
      { id: 3, content: 'Les documents d\'identité contiennent un indice clé : comparez les noms et les photos.' }
    ],
    9: [
      { id: 1, content: 'Les badges d\'accès enregistrent toutes les entrées et sorties, même la nuit.' },
      { id: 2, content: 'Les caméras du parking ont filmé les véhicules présents cette nuit-là.' },
      { id: 3, content: 'Le dossier disciplinaire révèle qui a été renvoyé pour tricherie peu avant les faits.' }
    ]
  };
  return mockHints[investigationId] || [{ id: 1, content: 'Indices non disponibles pour cette enquête.' }];
};