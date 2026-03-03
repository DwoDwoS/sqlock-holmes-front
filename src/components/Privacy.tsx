import React from 'react';
import './Privacy.css';

const Privacy: React.FC = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-hero">
        <h1>Politique de Confidentialité</h1>
        <p className="hero-subtitle">Dernière mise à jour : 3 mars 2026</p>
      </div>

      <div className="privacy-content">
        <section className="privacy-section">
          <h2>Introduction</h2>
          <p>
            Bienvenue sur SQLock Holmes. Cette politique de confidentialité explique comment nous collectons, 
            utilisons, partageons et protégeons vos données personnelles lorsque vous utilisez notre plateforme 
            d'apprentissage SQL.
          </p>
          <p>
            En utilisant SQLock Holmes, vous acceptez les pratiques décrites dans cette politique. Si vous 
            n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Données collectées</h2>
          
          <h3>Informations d'identification</h3>
          <p>Lors de la création de votre compte, nous collectons :</p>
          <ul>
            <li>Votre nom d'utilisateur</li>
            <li>Votre adresse e-mail</li>
            <li>Votre mot de passe (crypté)</li>
          </ul>

          <h3>Données d'utilisation</h3>
          <p>Pendant votre utilisation de la plateforme, nous collectons :</p>
          <ul>
            <li>Vos requêtes SQL soumises</li>
            <li>Vos scores et classements dans le leaderboard</li>
            <li>Vos progrès dans les enquêtes</li>
            <li>Les indices utilisés</li>
            <li>La date et l'heure de vos connexions</li>
          </ul>

          <h3>Cookies et technologies similaires</h3>
          <p>
            Nous utilisons des cookies et des technologies de stockage local pour améliorer votre expérience. 
            Ces technologies nous permettent de mémoriser vos préférences et de maintenir votre session active.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Utilisation des données</h2>
          <p>Nous utilisons vos données personnelles pour :</p>
          <ul>
            <li>Créer et gérer votre compte utilisateur</li>
            <li>Fournir et améliorer nos services d'apprentissage</li>
            <li>Personnaliser votre expérience d'apprentissage</li>
            <li>Établir et maintenir les classements (leaderboards)</li>
            <li>Analyser les performances des enquêtes et du contenu pédagogique</li>
            <li>Assurer la sécurité et prévenir les fraudes</li>
            <li>Communiquer avec vous concernant votre compte ou nos services</li>
            <li>Répondre à vos demandes de support</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>Partage des informations</h2>
          <p>
            Nous ne vendons ni ne louons vos données personnelles à des tiers. Nous pouvons partager 
            vos informations dans les cas suivants :
          </p>
          <ul>
            <li>
              <strong>Données publiques :</strong> Votre nom d'utilisateur et vos scores peuvent 
              apparaître dans les classements publics de la plateforme.
            </li>
            <li>
              <strong>Prestataires de services :</strong> Nous pouvons partager des données avec 
              des prestataires qui nous aident à exploiter notre plateforme (hébergement, analyse, etc.), 
              sous strictes obligations de confidentialité.
            </li>
            <li>
              <strong>Obligations légales :</strong> Nous pouvons divulguer vos informations si la loi 
              l'exige ou pour protéger nos droits légaux.
            </li>
            <li>
              <strong>Avec votre consentement :</strong> Dans tout autre cas, nous demanderons votre 
              consentement explicite avant de partager vos données.
            </li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>Sécurité des données</h2>
          <p>
            Nous prenons la sécurité de vos données très au sérieux et mettons en œuvre des mesures 
            techniques et organisationnelles appropriées :
          </p>
          <ul>
            <li>Cryptage des mots de passe avec des algorithmes sécurisés</li>
            <li>Connexions HTTPS pour toutes les communications</li>
            <li>Authentification par token JWT sécurisé</li>
            <li>Accès restreint aux données par notre personnel</li>
            <li>Surveillance et journalisation des accès</li>
            <li>Sauvegardes régulières des données</li>
          </ul>
          <p>
            Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est 
            100% sûre. Nous ne pouvons garantir une sécurité absolue.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Vos droits (RGPD)</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez 
            des droits suivants concernant vos données personnelles :
          </p>
          <ul>
            <li>
              <strong>Droit d'accès :</strong> Vous pouvez demander une copie des données personnelles 
              que nous détenons à votre sujet.
            </li>
            <li>
              <strong>Droit de rectification :</strong> Vous pouvez corriger vos données inexactes 
              ou incomplètes via votre profil.
            </li>
            <li>
              <strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos 
              données personnelles, sous réserve de certaines exceptions légales.
            </li>
            <li>
              <strong>Droit à la limitation du traitement :</strong> Vous pouvez demander la 
              limitation du traitement de vos données dans certaines circonstances.
            </li>
            <li>
              <strong>Droit à la portabilité :</strong> Vous pouvez recevoir vos données dans un 
              format structuré et couramment utilisé.
            </li>
            <li>
              <strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos 
              données pour des motifs légitimes.
            </li>
            <li>
              <strong>Droit de retirer votre consentement :</strong> Lorsque le traitement est basé 
              sur votre consentement, vous pouvez le retirer à tout moment.
            </li>
          </ul>
          <p>
            Pour exercer ces droits, veuillez nous contacter via notre page de contact.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Conservation des données</h2>
          <p>
            Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir 
            nos services et respecter nos obligations légales. Les données d'un compte inactif 
            pendant plus de 3 ans peuvent être supprimées après notification préalable.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Services tiers</h2>
          <p>
            Notre plateforme peut contenir des liens vers des sites web tiers. Nous ne sommes pas 
            responsables des pratiques de confidentialité de ces sites. Nous vous encourageons à 
            lire leurs politiques de confidentialité.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Utilisateurs mineurs</h2>
          <p>
            SQLock Holmes est destiné aux utilisateurs âgés de 13 ans et plus. Si vous avez moins 
            de 18 ans, vous devez obtenir le consentement de vos parents ou tuteurs légaux avant 
            d'utiliser notre service. Nous ne collectons pas sciemment de données personnelles 
            d'enfants de moins de 13 ans.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Modifications de cette politique</h2>
          <p>
            Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. La date 
            de "Dernière mise à jour" en haut de cette page indique quand la politique a été 
            révisée pour la dernière fois.
          </p>
          <p>
            Nous vous notifierons de tout changement important par e-mail ou via un avis sur notre 
            plateforme. Nous vous encourageons à consulter régulièrement cette politique pour rester 
            informé de la manière dont nous protégeons vos données.
          </p>
        </section>

        <section className="privacy-section contact-section">
          <h2>Nous contacter</h2>
          <p>
            Si vous avez des questions, des préoccupations ou des demandes concernant cette politique 
            de confidentialité ou nos pratiques en matière de données personnelles, n'hésitez pas à 
            nous contacter :
          </p>
          <div className="contact-info-box">
            <p><strong>SQLock Holmes</strong></p>
            <p>Via notre formulaire : <a href="/contact">Page de contact</a></p>
          </div>
          <p className="gdpr-info">
            Vous pouvez également contacter l'autorité de protection des données de votre pays si 
            vous estimez que vos droits n'ont pas été respectés.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;