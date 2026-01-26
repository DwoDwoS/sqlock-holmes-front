import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitSolution } from '../services/investigationService';

export const useInvestigationSubmission = (investigationId: string | undefined) => {
  const navigate = useNavigate();
  const [culprit, setCulprit] = useState('');
  const [motive, setMotive] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const parseSqlSolution = (sql: string) => {
    const culpritMatch = sql.match(/solution_culprit\s*=\s*['"]([^'"]+)['"]/i);
    const motiveMatch = sql.match(/solution_motive\s*=\s*['"]([^'"]+)['"]/i);

    if (culpritMatch && motiveMatch) {
      return { culprit: culpritMatch[1], motive: motiveMatch[1] };
    }
    return null;
  };

  const getSubmissionData = (sqlCode: string) => {
    if (culprit.trim() && motive.trim()) {
      return { culprit: culprit.trim(), motive: motive.trim() };
    }

    if (sqlCode.trim()) {
      const parsed = parseSqlSolution(sqlCode);
      if (parsed) {
        return parsed;
      }
    }

    return null;
  };

  const handleSubmit = async (sqlCode: string) => {
    if (!investigationId) return;

    const submissionData = getSubmissionData(sqlCode);
    if (!submissionData) {
      alert('Veuillez remplir soit les champs simples, soit un SQL valide avec culprit et motive.');
      return;
    }

    setLoading(true);
    try {
      const data = await submitSolution(parseInt(investigationId), submissionData.culprit, submissionData.motive);
      console.log('Réponse soumission:', data);

      if (data.success) {
        console.log('Soumission réussie, redirection vers /investigations');
        setShowSubmitModal(false);
        setCulprit('');
        setMotive('');
        navigate('/investigations');
        alert('Solution soumise avec succès ! Enquête terminée !');
      } else {
        alert(data.message || 'Erreur lors de la soumission.');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Erreur lors de la soumission de la solution.');
    } finally {
      setLoading(false);
    }
  };

  const openSubmitModal = () => setShowSubmitModal(true);
  const closeSubmitModal = () => setShowSubmitModal(false);

  return {
    culprit,
    setCulprit,
    motive,
    setMotive,
    showSubmitModal,
    loading,
    handleSubmit,
    openSubmitModal,
    closeSubmitModal,
  };
};