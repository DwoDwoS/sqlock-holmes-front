import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitSolution } from '../services/investigationService';
import { useLeaderboardRefresh } from '../contexts/LeaderboardRefreshContext';
import { useToast } from './useToast';

export interface SolutionResult {
  success: boolean;
  message: string;
}

export const useInvestigationSubmission = (investigationId: string | undefined) => {
  const navigate = useNavigate();
  const { triggerRefresh } = useLeaderboardRefresh();
  const toast = useToast();
  const [culprit, setCulprit] = useState('');
  const [motive, setMotive] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [solutionResult, setSolutionResult] = useState<SolutionResult | null>(null);

  const parseSqlSolution = (sql: string) => {
    const aliasCulprit = sql.match(/['"]([^'"]+)['"]\s+AS\s+solution_culprit/i);
    const aliasMotive = sql.match(/['"]([^'"]+)['"]\s+AS\s+solution_motive/i);

    if (aliasCulprit && aliasMotive) {
      return { culprit: aliasCulprit[1], motive: aliasMotive[1] };
    }

    const assignCulprit = sql.match(/solution_culprit\s*=\s*['"]([^'"]+)['"]/i);
    const assignMotive = sql.match(/solution_motive\s*=\s*['"]([^'"]+)['"]/i);

    if (assignCulprit && assignMotive) {
      return { culprit: assignCulprit[1], motive: assignMotive[1] };
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
      toast.warning('Veuillez remplir soit les champs simples, soit un SQL valide avec culprit et motive.');
      return;
    }

    setLoading(true);
    try {
      const data = await submitSolution(parseInt(investigationId), submissionData.culprit, submissionData.motive);

      setShowSubmitModal(false);

      if (data.success) {
        setCulprit('');
        setMotive('');
        triggerRefresh();
      }

      setSolutionResult({
        success: data.success,
        message: data.message || (data.success
          ? 'Felicitations, detective ! Vous avez resolu cette affaire.'
          : 'Ce n\'est pas la bonne piste. Continuez a chercher des indices !'),
      });
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setShowSubmitModal(false);
      setSolutionResult({
        success: false,
        message: 'Erreur lors de la soumission de la solution.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResultClose = () => {
    const wasSuccess = solutionResult?.success;
    setSolutionResult(null);
    if (wasSuccess) {
      navigate('/investigations');
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
    solutionResult,
    handleResultClose,
  };
};