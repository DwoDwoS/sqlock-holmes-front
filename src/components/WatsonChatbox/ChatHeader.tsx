import React from 'react';
import { Trash2, X } from 'lucide-react';

interface ChatHeaderProps {
  canClear: boolean;
  onClear: () => void;
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ canClear, onClear, onClose }) => (
  <header className="watson-header">
    <div className="watson-header-title">
      <span className="watson-header-avatar" aria-hidden>🔍</span>
      <div>
        <h3>Watson</h3>
        <span className="watson-header-subtitle">Assistant d'enquête</span>
      </div>
    </div>
    <div className="watson-header-actions">
      <button
        type="button"
        className="watson-header-btn"
        onClick={onClear}
        disabled={!canClear}
        title="Effacer la conversation"
      >
        <Trash2 size={16} />
        <span>Effacer</span>
      </button>
      <button
        type="button"
        className="watson-header-btn watson-header-btn--icon"
        onClick={onClose}
        aria-label="Fermer"
      >
        <X size={18} />
      </button>
    </div>
  </header>
);

export default ChatHeader;