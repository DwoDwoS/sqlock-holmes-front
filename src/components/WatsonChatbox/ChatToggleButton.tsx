import React from 'react';
import { MessageCircle, X } from 'lucide-react';

interface ChatToggleButtonProps {
  isOpen: boolean;
  hasUnread: boolean;
  onToggle: () => void;
}

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ isOpen, hasUnread, onToggle }) => (
  <button
    type="button"
    className={`watson-toggle${isOpen ? ' watson-toggle--open' : ''}`}
    onClick={onToggle}
    aria-label={isOpen ? 'Fermer Watson' : 'Ouvrir Watson'}
  >
    {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
    {hasUnread && !isOpen && <span className="watson-toggle-dot" aria-hidden />}
  </button>
);

export default ChatToggleButton;