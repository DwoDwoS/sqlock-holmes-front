import React from 'react';
import { X } from 'lucide-react';

interface ChatAlertBannerProps {
  error: string | null;
  rateLimitResetAt: string | null;
  onDismiss: () => void;
}

const ChatAlertBanner: React.FC<ChatAlertBannerProps> = ({ error, rateLimitResetAt, onDismiss }) => {
  const isRateLimited = Boolean(rateLimitResetAt);
  if (!error && !isRateLimited) return null;

  return (
    <div
      className={`watson-alert${isRateLimited ? ' watson-alert--ratelimit' : ''}`}
    >
      <span>
        {isRateLimited
          ? `Limite atteinte, retente à ${rateLimitResetAt} 🕐`
          : error}
      </span>
      <button
        type="button"
        className="watson-alert-close"
        onClick={onDismiss}
        aria-label="Fermer l'erreur"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default ChatAlertBanner;