import React from 'react';
import './Terms.scss';

const Terms: React.FC = () => {
  return (
    <div className="terms-container">
      <div className="terms-hero">
        <h1>Conditions Générales d'Utilisation</h1>
        <p className="hero-subtitle">Dernière mise à jour : 18 mars 2026</p>
      </div>

      <div className="terms-content">
        <section className="terms-section">
          <h2>1. Introduction et acceptation</h2>
          <p>
            Bienvenue sur SQLock Holmes, une plateforme d'apprentissage et de pratique SQL sous forme d'enquêtes. 
            En accédant ou en utilisant nos services, vous acceptez d'être lié par les présentes conditions générales 
            d'utilisation (« CGU »).
          </p>
          <p>
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service. Nous nous réservons le 
            droit de modifier ces CGU à tout moment. Les modifications prendront effet dès leur publication sur 
            le site.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Description du service</h2>
          <p>
            SQLock Holmes est une plateforme éducative qui propose :
          </p>
          <ul>
            <li>Des enquêtes interactives nécessitant des requêtes SQL pour progresser</li>
            <li>Un système de classement (leaderboard) pour comparer les performances</li>
            <li>Des indices et une assistance pour faciliter l'apprentissage</li>
            <li>Un espace personnel pour suivre votre progression</li>
            <li>Des fonctionnalités d'administration pour les utilisateurs autorisés</li>
          </ul>
          <p>
            Le service est fourni « en l'état » et peut évoluer à tout moment selon nos besoins et objectifs 
            pédagogiques.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Création de compte et responsabilités</h2>
          
          <h3>3.1 Conditions d'inscription</h3>
          <p>
            Pour utiliser SQLock Holmes, vous devez créer un compte en fournissant des informations exactes 
            et à jour. Vous êtes responsable de :
          </p>
          <ul>
            <li>Fournir des informations véridiques lors de votre inscription</li>
            <li>Maintenir la confidentialité de vos identifiants de connexion</li>
            <li>Toutes les activités réalisées via votre compte</li>
            <li>Nous informer immédiatement de toute utilisation non autorisée de votre compte</li>
          </ul>

          <h3>3.2 Restrictions d'âge</h3>
          <p>
            Vous devez avoir au moins 13 ans pour utiliser SQLock Holmes. Les utilisateurs mineurs doivent 
            obtenir l'autorisation d'un parent ou tuteur légal avant de créer un compte.
          </p>

          <h3>3.3 Un compte par personne</h3>
          <p>
            Chaque utilisateur ne peut créer qu'un seul compte. La création de comptes multiples pour manipuler 
            le classement ou obtenir un avantage injuste est strictement interdite.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Utilisation acceptable</h2>
          
          <h3>4.1 Comportements interdits</h3>
          <p>Vous vous engagez à ne pas :</p>
          <ul>
            <li>Utiliser le service à des fins illégales ou non autorisées</li>
            <li>Tenter d'accéder à des zones restreintes du système</li>
            <li>Exploiter des vulnérabilités pour obtenir un avantage injuste</li>
            <li>Partager les solutions des enquêtes publiquement</li>
            <li>Utiliser des scripts automatisés ou des bots pour manipuler les scores</li>
            <li>Harceler, menacer ou intimider d'autres utilisateurs</li>
            <li>Transmettre des virus, malware ou tout code malveillant</li>
            <li>Collecter ou stocker des données personnelles d'autres utilisateurs</li>
            <li>Usurper l'identité d'une autre personne ou entité</li>
            <li>Surcharger délibérément nos serveurs ou infrastructures</li>
          </ul>

          <h3>4.2 Utilisation équitable</h3>
          <p>
            Nous encourageons l'apprentissage et la collaboration, mais le système de classement doit refléter 
            les compétences individuelles. L'entraide est permise tant qu'elle ne compromet pas l'intégrité 
            des évaluations.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Propriété intellectuelle</h2>
          
          <h3>5.1 Contenu de SQLock Holmes</h3>
          <p>
            Tous les contenus présents sur SQLock Holmes (enquêtes, bases de données, interface, logos, textes, 
            graphiques) sont protégés par les droits de propriété intellectuelle et appartiennent à SQLock Holmes 
            ou à ses concédants de licence.
          </p>

          <h3>5.2 Licence d'utilisation</h3>
          <p>
            Nous vous accordons une licence limitée, non exclusive, non transférable et révocable pour utiliser 
            le service à des fins personnelles et éducatives. Cette licence ne vous confère aucun droit de 
            propriété sur le contenu.
          </p>

          <h3>5.3 Contenu utilisateur</h3>
          <p>
            Vous conservez la propriété des requêtes SQL que vous soumettez. Toutefois, en utilisant le service, 
            vous nous accordez une licence mondiale, gratuite et non exclusive pour stocker, analyser et afficher 
            vos requêtes dans le cadre du fonctionnement du service (notamment pour le classement et les statistiques).
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Système de classement (Leaderboard)</h2>
          <p>
            Le leaderboard affiche les performances des utilisateurs selon des critères établis (vitesse, 
            précision, utilisation d'indices). Les règles sont :
          </p>
          <ul>
            <li>Les scores sont calculés automatiquement selon nos algorithmes</li>
            <li>Nous nous réservons le droit de vérifier et corriger les scores suspects</li>
            <li>Toute tentative de manipulation entraînera des sanctions</li>
            <li>Les classements peuvent être réinitialisés périodiquement</li>
            <li>Les pseudonymes et scores peuvent être publiquement visibles</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>7. Sanctions et suspension</h2>
          <p>
            En cas de violation de ces CGU, nous nous réservons le droit de :
          </p>
          <ul>
            <li>Émettre un avertissement</li>
            <li>Réinitialiser vos scores et progressions</li>
            <li>Suspendre temporairement votre compte</li>
            <li>Supprimer définitivement votre compte</li>
            <li>Bloquer votre accès au service</li>
            <li>Prendre toute action légale appropriée</li>
          </ul>
          <p>
            Les décisions de modération sont prises à notre seule discrétion. Vous pouvez contester une sanction 
            en nous contactant via le formulaire de contact.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. Disponibilité et maintenance</h2>
          <p>
            Nous nous efforçons de maintenir le service accessible 24h/24 et 7j/7, mais nous ne garantissons pas :
          </p>
          <ul>
            <li>Une disponibilité ininterrompue du service</li>
            <li>L'absence d'erreurs ou de bugs</li>
            <li>La compatibilité avec tous les navigateurs et appareils</li>
          </ul>
          <p>
            Nous pouvons suspendre le service temporairement pour maintenance, mises à jour ou urgences techniques, 
            avec ou sans préavis.
          </p>
        </section>

        <section className="terms-section">
          <h2>9. Limitation de responsabilité</h2>
          <p>
            Dans les limites autorisées par la loi :
          </p>
          <ul>
            <li>SQLock Holmes est fourni « en l'état » sans garantie d'aucune sorte</li>
            <li>Nous ne sommes pas responsables des pertes de données, de progression ou de scores</li>
            <li>Nous ne garantissons pas l'exactitude pédagogique du contenu</li>
            <li>Notre responsabilité est limitée aux dommages directs et prévisibles</li>
            <li>Nous ne sommes pas responsables des comportements des autres utilisateurs</li>
          </ul>
          <p>
            En utilisant le service, vous acceptez d'utiliser SQLock Holmes à vos propres risques.
          </p>
        </section>

        <section className="terms-section">
          <h2>10. Protection des données</h2>
          <p>
            Le traitement de vos données personnelles est régi par notre 
            <a href="/privacy" className="terms-link"> Politique de Confidentialité</a>. En acceptant ces CGU, 
            vous reconnaissez avoir lu et accepté notre politique de confidentialité.
          </p>
          <p>
            Conformément au RGPD, vous disposez de droits sur vos données (accès, rectification, suppression, 
            portabilité). Pour exercer ces droits, contactez-nous via notre formulaire de contact.
          </p>
        </section>

        <section className="terms-section">
          <h2>11. Résiliation</h2>
          
          <h3>11.1 Par l'utilisateur</h3>
          <p>
            Vous pouvez supprimer votre compte à tout moment depuis votre profil. La suppression entraîne :
          </p>
          <ul>
            <li>La perte définitive de votre progression et scores</li>
            <li>Le retrait de votre nom du leaderboard</li>
            <li>La suppression de vos données personnelles selon notre politique de confidentialité</li>
          </ul>

          <h3>11.2 Par SQLock Holmes</h3>
          <p>
            Nous pouvons résilier votre accès immédiatement en cas de violation des CGU, sans préavis ni 
            responsabilité de notre part.
          </p>
        </section>

        <section className="terms-section">
          <h2>12. Modifications du service</h2>
          <p>
            Nous nous réservons le droit de :
          </p>
          <ul>
            <li>Modifier, suspendre ou interrompre tout ou partie du service</li>
            <li>Ajouter ou retirer des fonctionnalités</li>
            <li>Modifier les règles de scoring et de classement</li>
            <li>Archiver ou supprimer des enquêtes</li>
          </ul>
          <p>
            Ces modifications peuvent intervenir sans préavis. La poursuite de l'utilisation du service après 
            une modification vaut acceptation des changements.
          </p>
        </section>

        <section className="terms-section">
          <h2>13. Droit applicable et juridiction</h2>
          <p>
            Les présentes CGU sont régies par le droit français. Tout litige relatif à l'interprétation ou 
            l'exécution de ces conditions sera soumis à la juridiction exclusive des tribunaux français.
          </p>
          <p>
            En cas de désaccord, nous encourageons une résolution amiable par contact direct avant toute 
            action judiciaire.
          </p>
        </section>

        <section className="terms-section">
          <h2>14. Dispositions générales</h2>
          
          <h3>14.1 Intégralité de l'accord</h3>
          <p>
            Ces CGU constituent l'intégralité de l'accord entre vous et SQLock Holmes concernant l'utilisation 
            du service.
          </p>

          <h3>14.2 Divisibilité</h3>
          <p>
            Si une disposition de ces CGU est jugée invalide ou inapplicable, les autres dispositions 
            resteront en vigueur.
          </p>

          <h3>14.3 Renonciation</h3>
          <p>
            Le fait de ne pas exercer un droit prévu par ces CGU ne constitue pas une renonciation à ce droit.
          </p>

          <h3>14.4 Cession</h3>
          <p>
            Vous ne pouvez pas céder vos droits ou obligations sans notre consentement écrit préalable. Nous 
            pouvons céder nos droits à tout moment.
          </p>
        </section>

        <section className="terms-section">
          <h2>15. Contact</h2>
          <p>
            Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter :
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <strong>Par email</strong>
                <p>Via notre formulaire de contact sur la page dédiée</p>
              </div>
            </div>
          </div>
        </section>

        <section className="terms-section terms-acknowledgment">
          <p className="acknowledgment-text">
            <strong>En utilisant SQLock Holmes, vous reconnaissez avoir lu, compris et accepté les présentes 
            conditions générales d'utilisation.</strong>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;