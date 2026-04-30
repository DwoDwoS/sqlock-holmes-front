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

  7: {
    label: 'Le Kidnapping du Chien Star',
    tables: [
      {
        name: 'dog_show_participants', color: 'cyan',
        columns: [
          { name: 'id',                  type: 'INTEGER', description: 'Identifiant unique'   },
          { name: 'owner_name',          type: 'TEXT',    description: 'Nom du propriétaire'  },
          { name: 'dog_name',            type: 'TEXT',    description: 'Nom du chien'         },
          { name: 'breed',               type: 'TEXT',    description: 'Race'                 },
          { name: 'registration_number', type: 'TEXT',    description: "Numéro d'inscription" },
          { name: 'arrival_time',        type: 'TEXT',    description: "Heure d'arrivée"      },
        ],
      },
      {
        name: 'security_footage', color: 'blue',
        columns: [
          { name: 'id',              type: 'INTEGER', description: 'Identifiant'               },
          { name: 'timestamp',       type: 'TEXT',    description: 'Horodatage'                },
          { name: 'camera_location', type: 'TEXT',    description: 'Emplacement de la caméra'  },
          { name: 'person_seen',     type: 'TEXT',    description: 'Personne filmée'           },
          { name: 'activity',        type: 'TEXT',    description: 'Activité observée'         },
        ],
      },
      {
        name: 'competition_history', color: 'emerald',
        columns: [
          { name: 'id',               type: 'INTEGER', description: 'Identifiant'         },
          { name: 'owner_name',       type: 'TEXT',    description: 'Nom du propriétaire' },
          { name: 'dog_name',         type: 'TEXT',    description: 'Nom du chien'        },
          { name: 'competition_name', type: 'TEXT',    description: 'Nom du concours'     },
          { name: 'year',             type: 'INTEGER', description: 'Année'               },
          { name: 'rank',             type: 'INTEGER', description: 'Classement obtenu'   },
          { name: 'prize',            type: 'TEXT',    description: 'Prix remporté'       },
        ],
      },
      {
        name: 'forum_messages', color: 'purple',
        columns: [
          { name: 'id',             type: 'INTEGER', description: 'Identifiant'         },
          { name: 'author',         type: 'TEXT',    description: 'Auteur du message'   },
          { name: 'post_date',      type: 'TEXT',    description: 'Date de publication' },
          { name: 'thread_subject', type: 'TEXT',    description: 'Sujet du fil'        },
          { name: 'content',        type: 'TEXT',    description: 'Contenu du message'  },
        ],
      },
      {
        name: 'phone_records', color: 'amber',
        columns: [
          { name: 'id',           type: 'INTEGER', description: 'Identifiant'        },
          { name: 'caller_name',  type: 'TEXT',    description: "Nom de l'appelant"  },
          { name: 'call_date',    type: 'TEXT',    description: "Date de l'appel"    },
          { name: 'call_time',    type: 'TEXT',    description: "Heure de l'appel"   },
          { name: 'duration_sec', type: 'INTEGER', description: 'Durée (secondes)'   },
          { name: 'recipient',    type: 'TEXT',    description: 'Destinataire'       },
          { name: 'location',     type: 'TEXT',    description: 'Localisation'       },
        ],
      },
    ],
  },

  8: {
    label: "L'Arnaque aux Cryptomonnaies",
    tables: [
      {
        name: 'platform_employees', color: 'cyan',
        columns: [
          { name: 'id',           type: 'INTEGER', description: 'Identifiant unique' },
          { name: 'name',         type: 'TEXT',    description: "Nom de l'employé"   },
          { name: 'role',         type: 'TEXT',    description: 'Rôle'               },
          { name: 'department',   type: 'TEXT',    description: 'Département'        },
          { name: 'hire_date',    type: 'TEXT',    description: "Date d'embauche"    },
          { name: 'access_level', type: 'TEXT',    description: "Niveau d'accès"     },
        ],
      },
      {
        name: 'crypto_transactions', color: 'amber',
        columns: [
          { name: 'id',                type: 'INTEGER', description: 'Identifiant'            },
          { name: 'sender_id',         type: 'INTEGER', description: "ID de l'expéditeur"     },
          { name: 'recipient_address', type: 'TEXT',    description: 'Adresse destinataire'   },
          { name: 'amount_eur',        type: 'REAL',    description: 'Montant (€)'            },
          { name: 'transaction_date',  type: 'TEXT',    description: 'Date de la transaction' },
          { name: 'transaction_type',  type: 'TEXT',    description: 'Type de transaction'    },
          { name: 'status',            type: 'TEXT',    description: 'Statut'                 },
        ],
      },
      {
        name: 'admin_access_logs', color: 'red',
        columns: [
          { name: 'id',          type: 'INTEGER', description: 'Identifiant'      },
          { name: 'employee_id', type: 'INTEGER', description: "ID de l'employé"  },
          { name: 'access_date', type: 'TEXT',    description: "Date d'accès"     },
          { name: 'access_time', type: 'TEXT',    description: "Heure d'accès"    },
          { name: 'action',      type: 'TEXT',    description: 'Action effectuée' },
          { name: 'ip_address',  type: 'TEXT',    description: 'Adresse IP'       },
        ],
      },
      {
        name: 'flight_bookings', color: 'blue',
        columns: [
          { name: 'id',             type: 'INTEGER', description: 'Identifiant'         },
          { name: 'passenger_name', type: 'TEXT',    description: 'Nom du passager'     },
          { name: 'flight_number',  type: 'TEXT',    description: 'Numéro de vol'       },
          { name: 'departure_date', type: 'TEXT',    description: 'Date de départ'      },
          { name: 'destination',    type: 'TEXT',    description: 'Destination'         },
          { name: 'booking_date',   type: 'TEXT',    description: 'Date de réservation' },
        ],
      },
      {
        name: 'identity_documents', color: 'emerald',
        columns: [
          { name: 'id',              type: 'INTEGER', description: 'Identifiant'        },
          { name: 'document_type',   type: 'TEXT',    description: 'Type de document'   },
          { name: 'holder_name',     type: 'TEXT',    description: 'Nom du titulaire'   },
          { name: 'document_number', type: 'TEXT',    description: 'Numéro du document' },
          { name: 'issue_date',      type: 'TEXT',    description: "Date d'émission"    },
          { name: 'country',         type: 'TEXT',    description: 'Pays émetteur'      },
        ],
      },
    ],
  },

  9: {
    label: "Le Vandalisme à l'École",
    tables: [
      {
        name: 'school_badge_access', color: 'cyan',
        columns: [
          { name: 'id',          type: 'INTEGER', description: 'Identifiant unique'    },
          { name: 'badge_id',    type: 'TEXT',    description: 'Identifiant du badge'  },
          { name: 'holder_name', type: 'TEXT',    description: 'Nom du porteur'        },
          { name: 'access_time', type: 'TEXT',    description: "Heure d'accès"         },
          { name: 'location',    type: 'TEXT',    description: 'Zone accédée'          },
          { name: 'access_type', type: 'TEXT',    description: "Type d'accès"          },
        ],
      },
      {
        name: 'school_cameras', color: 'blue',
        columns: [
          { name: 'id',              type: 'INTEGER', description: 'Identifiant'               },
          { name: 'camera_location', type: 'TEXT',    description: 'Emplacement de la caméra'  },
          { name: 'timestamp',       type: 'TEXT',    description: 'Horodatage'                },
          { name: 'person_detected', type: 'TEXT',    description: 'Personne détectée'         },
          { name: 'activity',        type: 'TEXT',    description: 'Activité observée'         },
        ],
      },
      {
        name: 'school_disciplinary', color: 'red',
        columns: [
          { name: 'id',            type: 'INTEGER', description: 'Identifiant'           },
          { name: 'student_name',  type: 'TEXT',    description: "Nom de l'élève"        },
          { name: 'incident_date', type: 'TEXT',    description: "Date de l'incident"    },
          { name: 'incident_type', type: 'TEXT',    description: "Type d'incident"       },
          { name: 'decision',      type: 'TEXT',    description: 'Décision du conseil'   },
          { name: 'teacher_name',  type: 'TEXT',    description: 'Enseignant rapporteur' },
        ],
      },
      {
        name: 'school_parking', color: 'emerald',
        columns: [
          { name: 'id',            type: 'INTEGER', description: 'Identifiant'              },
          { name: 'vehicle_plate', type: 'TEXT',    description: "Plaque d'immatriculation" },
          { name: 'owner_name',    type: 'TEXT',    description: 'Nom du propriétaire'      },
          { name: 'entry_time',    type: 'TEXT',    description: "Heure d'entrée"           },
          { name: 'exit_time',     type: 'TEXT',    description: 'Heure de sortie'          },
          { name: 'parking_zone',  type: 'TEXT',    description: 'Zone de stationnement'    },
        ],
      },
      {
        name: 'school_social_media', color: 'purple',
        columns: [
          { name: 'id',        type: 'INTEGER', description: 'Identifiant'         },
          { name: 'username',  type: 'TEXT',    description: "Nom d'utilisateur"   },
          { name: 'post_date', type: 'TEXT',    description: 'Date de publication' },
          { name: 'platform',  type: 'TEXT',    description: 'Plateforme'          },
          { name: 'content',   type: 'TEXT',    description: 'Contenu du post'     },
          { name: 'reactions', type: 'INTEGER', description: 'Nombre de réactions' },
        ],
      },
    ],
  },
};