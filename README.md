[![CI](https://github.com/DwoDwoS/sqlock-holmes-front/actions/workflows/ci.yml/badge.svg)](https://github.com/DwoDwoS/sqlock-holmes-front/actions/workflows/ci.yml)

# SQLock-Holmes Front

Application web ludique pour résoudre des enquêtes policières en utilisant des requêtes SQL. 

## Contexte

SQLock-Holmes est un jeu éducatif qui transforme l'apprentissage du SQL en aventure policière interactive. Incarnez un détective et résolvez des enquêtes criminelles en interrogeant une base de données avec vos requêtes SQL.  Chaque indice découvert vous rapproche de la résolution du mystère !

**À qui ça s'adresse ?**
- Débutants en SQL cherchant une approche ludique
- Étudiants en informatique voulant pratiquer
- Passionnés d'énigmes et de logique

**Objectifs pédagogiques :**
- Maîtriser SELECT, JOIN, GROUP BY, sous-requêtes
- Comprendre les relations entre tables
- Développer la logique de requêtage

## Fonctionnalités

- **Enquêtes scénarisées** : Histoires immersives avec rebondissements
- **Base de données réaliste** : Suspects, témoignages, indices, alibis
- **Système d'indices** : Aide progressive si bloqué
- **Progression** : Débloquez de nouvelles enquêtes
- **Statistiques** :  Suivez votre progression SQL

## Stack Technique

**Frontend :**
- React 19.2 + TypeScript
- Vite 7.x (bundler)
- React Router 7 (navigation)
- Axios (HTTP client)
- Monaco Editor (éditeur SQL)

**Backend :**
- Java 17 + Spring Boot
- PostgreSQL 16 (base de données des enquêtes)
- API REST

**Outils qualité :**
- Vitest + Testing Library (tests)
- ESLint 9 + Prettier (linting)
- GitHub Actions (CI/CD)

## Installation

### Prérequis

- Node.js >= 20.x
- npm >= 10.x
- Backend SQLock-Holmes (Java/Spring Boot) : [@SQLock Holmes Back](https://github.com/DwoDwoS/sqlock-holmes-back)

### Étapes

```bash
# Cloner le repository
git clone https://github.com/DwoDwoS/SQLock-Holmes-front.git
cd SQLock-Holmes-front

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

L'application sera accessible sur **http://localhost:5173**

## Commandes

```bash
# Développement
npm run dev              # Lancer le serveur de dev
npm run build            # Build de production
npm run preview          # Prévisualiser le build

# Qualité de code
npm run lint             # Linter le code
npm run lint:fix         # Fixer automatiquement
npm run format           # Formater le code
npm run type-check       # Vérifier les types TypeScript

# Tests
npm run test             # Lancer les tests
npm run test: ui         # UI interactive des tests
npm run test:coverage    # Coverage des tests
```

## Structure du Projet

```
src/
├── components/          # Composants React
│   ├── Footer.tsx       # Pied de page
│   ├── Home.tsx         # Page d'accueil
│   ├── InvestigationPage.tsx  # Page d'enquête
│   ├── Investigations.tsx     # Liste des enquêtes
│   ├── Leaderboard.tsx        # Classement
│   ├── Login.tsx              # Connexion
│   ├── Navbar.tsx             # Barre de navigation
│   ├── Profile.tsx            # Profil utilisateur
│   ├── ProtectedRoute.tsx     # Route protégée
│   ├── Register.tsx           # Inscription
│   └── investigation/         # Composants d'enquête
│       ├── Actions.tsx        # Actions de l'enquête
│       ├── HintsModal.tsx     # Modal des indices
│  Configuration API

L'URL du backend est configurée dans le fichier `src/api/api.ts`. Par défaut :
- Développement : `http://localhost:8080`
- Production : à configurer selon l'environnement

Les tokens d'authentification sont automatiquement gérés et stockés dans le localStorage.ook données enquête
│   ├── useInvestigationSubmission.ts # Hook soumission
│   └── useLeaderboard.ts             # Hook classement
├── services/            # Services API
│   ├── authService.ts   # Service authentification
│   ├── hintsService.ts  # Service indices
│   ├── investigationService.ts  # Service enquêtes
│   ├── leaderboardService.ts    # Service classement
│   └── sqlService.ts             # Service SQL
├── types/               # Types TypeScript
│   ├── auth.ts          # Types authentification
│   ├── investigation.ts # Types enquête
│   └── leaderboard.ts   # Types classement
├── utils/               # Utilitaires
│   ├── formatters.ts    # Formatage des données
│   └── investigationUtils.ts  # Utils pour enquêtes
├── tests/               # Tests unitaires
├── api/                 # Configuration API
│   └── api.ts           # Client Axios
├── assets/              # Ressources statiques
├── App.tsx              # Composant principal
├── App.css              # Styles globaux
├── main.tsx             # Point d'entrée
└── index.css            # Styles de base
```

## Variables d'Environnement

Copier `.env.example` en `.env` et renseigner : 

```env
VITE_API_URL=http://localhost:8080/api  # URL du backend
VITE_API_TIMEOUT=10000                   # Timeout requêtes (ms)
VITE_TOKEN_KEY=sqlockholmes_token        # Clé localStorage JWT
```

**Ne jamais commiter le fichier `.env`**

## Workflow Git

- **`main`** : Production (branche protégée)
- **`dev`** : Développement (branche par défaut)
- **`feature/*`** : Nouvelles fonctionnalités
- **`fix/*`** : Corrections de bugs

### Processus de contribution

1. Créer une branche depuis `dev` :  `git checkout -b feature/nom-feature`
2. Développer et commiter avec des messages clairs
3. Ouvrir une Pull Request vers `dev`
4. Attendre la review + CI pass
5. Merge dans `dev`
6. Release périodique :  `dev` → `main`

## Accessibilité

- Conformité WCAG 2.1 AA visée
- Navigation clavier complète
- ARIA labels sur les composants interactifs
- Contraste des couleurs vérifié
- Tests avec `eslint-plugin-jsx-a11y`

## Sécurité

### Mesures en place

- ✅ Headers de sécurité (CSP, X-Frame-Options, etc.)
- ✅ Validation des entrées utilisateur
- ✅ Protection XSS (échappement React automatique)
- ✅ Audit npm automatique en CI
- ✅ HTTPS obligatoire en production
- ✅ Authentification JWT

### Bonnes pratiques

- Versions de packages lockées (pas de `^` ou `~`)
- Audit régulier :  `npm audit`
- Pas de dépendances obsolètes ou dangereuses

## Tests

```bash
# Lancer tous les tests
npm test

# Mode watch (développement)
npm test -- --watch

# Générer le rapport de coverage
npm run test:coverage
```

**Objectif :  >80% de code coverage**

## Docker

```bash
# Build de l'image
docker build -t sqlockholmes-front:latest .

# Lancer avec docker-compose (front + back + db)
docker-compose up -d

# Logs
docker-compose logs -f frontend

# Arrêter
docker-compose down
```

## Licence

MIT License - voir [LICENSE](LICENSE)

## Contributeurs

- Elouan GAURIAUD - [@DwoDwoS](https://github.com/DwoDwoS) - Créateur et développeur principal

## Support

Pour toute question ou bug :
- Ouvrir une [issue](https://github.com/DwoDwoS/SQLock-Holmes-front/issues)
- Contacter via GitHub

---

**Prêt à résoudre des enquêtes ?  Que l'investigation commence !**