export interface Column {
  name: string;
  type: string;
  description: string;
}

export interface Table {
  name: string;
  color: string;
  columns: Column[];
}

export interface InvestigationSchema {
  label: string;
  tables: Table[];
}

export const COLOR_MAP: Record<string, { dot: string; badge: string }> = {
  cyan:    { dot: '#22d3ee', badge: 'rgba(34,211,238,0.15)'  },
  blue:    { dot: '#60a5fa', badge: 'rgba(96,165,250,0.15)'  },
  emerald: { dot: '#34d399', badge: 'rgba(52,211,153,0.15)'  },
  amber:   { dot: '#fbbf24', badge: 'rgba(251,191,36,0.15)'  },
  purple:  { dot: '#a78bfa', badge: 'rgba(167,139,250,0.15)' },
  red:     { dot: '#f87171', badge: 'rgba(248,113,113,0.15)' },
};

export const SCHEMAS: Record<number, InvestigationSchema> = {
  1: {
    label: 'Le vol du musée',
    tables: [
      {
        name: 'museum_employees', color: 'cyan',
        columns: [
          { name: 'id',          type: 'INTEGER', description: 'Identifiant unique'  },
          { name: 'name',        type: 'TEXT',    description: "Nom de l'employé"    },
          { name: 'position',    type: 'TEXT',    description: 'Poste occupé'         },
          { name: 'shift_date',  type: 'TEXT',    description: 'Date du service'      },
          { name: 'shift_start', type: 'TEXT',    description: 'Début du service'     },
          { name: 'shift_end',   type: 'TEXT',    description: 'Fin du service'       },
        ],
      },
      {
        name: 'bank_transactions', color: 'amber',
        columns: [
          { name: 'id',               type: 'INTEGER', description: 'Identifiant'            },
          { name: 'account_holder',   type: 'TEXT',    description: 'Titulaire du compte'    },
          { name: 'transaction_date', type: 'TEXT',    description: 'Date de la transaction' },
          { name: 'transaction_type', type: 'TEXT',    description: 'Type de transaction'    },
          { name: 'amount',           type: 'REAL',    description: 'Montant (€)'            },
          { name: 'description',      type: 'TEXT',    description: 'Description'            },
        ],
      },
      {
        name: 'security_cameras', color: 'blue',
        columns: [
          { name: 'id',               type: 'INTEGER', description: 'Identifiant'             },
          { name: 'visitor_name',     type: 'TEXT',    description: 'Nom du visiteur filmé'   },
          { name: 'camera_location',  type: 'TEXT',    description: 'Emplacement de la caméra'},
          { name: 'timestamp',        type: 'TEXT',    description: 'Horodatage'              },
          { name: 'activity',         type: 'TEXT',    description: 'Activité observée'       },
        ],
      },
      {
        name: 'visitors', color: 'purple',
        columns: [
          { name: 'id',          type: 'INTEGER', description: 'Identifiant'          },
          { name: 'name',        type: 'TEXT',    description: 'Nom du visiteur'      },
          { name: 'visit_date',  type: 'TEXT',    description: 'Date de la visite'    },
          { name: 'entry_time',  type: 'TEXT',    description: "Heure d'entrée"       },
          { name: 'exit_time',   type: 'TEXT',    description: 'Heure de sortie'      },
          { name: 'ticket_type', type: 'TEXT',    description: 'Type de billet'       },
        ],
      },
    ],
  },

  2: {
    label: 'Fraudes corporatives',
    tables: [
      {
        name: 'company_employees', color: 'cyan',
        columns: [
          { name: 'id',         type: 'INTEGER', description: 'Identifiant unique'  },
          { name: 'name',       type: 'TEXT',    description: "Nom de l'employé"    },
          { name: 'position',   type: 'TEXT',    description: 'Poste occupé'         },
          { name: 'department', type: 'TEXT',    description: 'Département'          },
          { name: 'hire_date',  type: 'TEXT',    description: "Date d'embauche"      },
          { name: 'salary',     type: 'REAL',    description: 'Salaire annuel (€)'   },
        ],
      },
      {
        name: 'financial_transactions', color: 'red',
        columns: [
          { name: 'id',               type: 'INTEGER', description: 'Identifiant'           },
          { name: 'employee_id',      type: 'INTEGER', description: "ID de l'employé"        },
          { name: 'transaction_date', type: 'TEXT',    description: 'Date de la transaction' },
          { name: 'amount',           type: 'REAL',    description: 'Montant (€)'            },
          { name: 'account_from',     type: 'TEXT',    description: 'Compte source'          },
          { name: 'account_to',       type: 'TEXT',    description: 'Compte destinataire'    },
          { name: 'description',      type: 'TEXT',    description: 'Description'            },
        ],
      },
      {
        name: 'bank_accounts', color: 'blue',
        columns: [
          { name: 'id',             type: 'INTEGER', description: 'Identifiant'         },
          { name: 'account_number', type: 'TEXT',    description: 'Numéro de compte'    },
          { name: 'account_holder', type: 'TEXT',    description: 'Titulaire du compte' },
          { name: 'account_type',   type: 'TEXT',    description: 'Type de compte'      },
          { name: 'balance',        type: 'REAL',    description: 'Solde actuel (€)'    },
        ],
      },
      {
        name: 'system_access_logs', color: 'emerald',
        columns: [
          { name: 'id',              type: 'INTEGER', description: 'Identifiant'          },
          { name: 'employee_id',     type: 'INTEGER', description: "ID de l'employé"      },
          { name: 'access_date',     type: 'TEXT',    description: "Date d'accès"          },
          { name: 'access_time',     type: 'TEXT',    description: "Heure d'accès"         },
          { name: 'system_accessed', type: 'TEXT',    description: 'Système consulté'      },
          { name: 'action',          type: 'TEXT',    description: 'Action effectuée'      },
        ],
      },
    ],
  },

  3: {
    label: 'Meurtre au Manoir',
    tables: [
      {
        name: 'mansion_guests', color: 'cyan',
        columns: [
          { name: 'id',            type: 'INTEGER', description: 'Identifiant unique'      },
          { name: 'name',          type: 'TEXT',    description: 'Nom du convive'          },
          { name: 'relationship',  type: 'TEXT',    description: 'Lien avec Lord Blackwood'},
          { name: 'room_assigned', type: 'TEXT',    description: 'Chambre attribuée'       },
          { name: 'arrival_time',  type: 'TEXT',    description: "Heure d'arrivée"         },
        ],
      },
      {
        name: 'timeline_events', color: 'blue',
        columns: [
          { name: 'id',         type: 'INTEGER', description: 'Identifiant'           },
          { name: 'event_time', type: 'TEXT',    description: "Heure de l'événement"  },
          { name: 'person',     type: 'TEXT',    description: 'Personne concernée'    },
          { name: 'location',   type: 'TEXT',    description: 'Lieu'                  },
          { name: 'activity',   type: 'TEXT',    description: 'Activité'              },
          { name: 'witness',    type: 'TEXT',    description: 'Témoin'                },
        ],
      },
      {
        name: 'inheritance_info', color: 'amber',
        columns: [
          { name: 'id',                  type: 'INTEGER', description: 'Identifiant'           },
          { name: 'heir_name',           type: 'TEXT',    description: "Nom de l'héritier"     },
          { name: 'relationship',        type: 'TEXT',    description: 'Lien avec le défunt'   },
          { name: 'inheritance_amount',  type: 'REAL',    description: 'Montant hérité (€)'    },
          { name: 'conditions',          type: 'TEXT',    description: "Conditions d'héritage" },
        ],
      },
      {
        name: 'personal_notes', color: 'purple',
        columns: [
          { name: 'id',        type: 'INTEGER', description: 'Identifiant'       },
          { name: 'note_date', type: 'TEXT',    description: 'Date de la note'   },
          { name: 'author',    type: 'TEXT',    description: 'Auteur'            },
          { name: 'content',   type: 'TEXT',    description: 'Contenu de la note'},
        ],
      },
      {
        name: 'evidence', color: 'red',
        columns: [
          { name: 'id',             type: 'INTEGER', description: 'Identifiant'            },
          { name: 'item_name',      type: 'TEXT',    description: "Nom de l'indice"        },
          { name: 'found_location', type: 'TEXT',    description: 'Lieu de découverte'     },
          { name: 'description',    type: 'TEXT',    description: 'Description'            },
          { name: 'found_by',       type: 'TEXT',    description: 'Trouvé par'             },
        ],
      },
    ],
  },
};