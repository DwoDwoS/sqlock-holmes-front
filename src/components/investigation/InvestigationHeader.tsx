import React from 'react';

interface Investigation {
  id: number;
  title: string;
  description: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  status: 'Disponible' | 'En cours' | 'Terminée';
  databaseId: string;
  image?: string;
}

interface InvestigationHeaderProps {
  investigation: Investigation;
}

const InvestigationHeader: React.FC<InvestigationHeaderProps> = ({ investigation }) => {
  return (
    <>
      <h1>{investigation.title}</h1>
      <p className="investigation-plot">{investigation.description}</p>
    </>
  );
};

export default InvestigationHeader;