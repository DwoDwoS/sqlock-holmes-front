import React from 'react';
import type { AiStatusResponse } from '../../types/watson';

interface ChatQuotaBarProps {
  status: AiStatusResponse;
}

const ChatQuotaBar: React.FC<ChatQuotaBarProps> = ({ status }) => {
  const tokensRemaining = status.tokensRemainingThisHour ?? null;
  const maxTokens = status.maxTokensPerHour ?? 5000;
  const tokensUsed =
    tokensRemaining !== null ? Math.max(0, maxTokens - tokensRemaining) : 0;
  const tokenPct =
    tokensRemaining !== null ? Math.min(100, (tokensUsed / maxTokens) * 100) : 0;

  return (
    <div
      className="watson-quota"
      title={`${tokensRemaining} tokens restants · réinitialisation à ${status.resetAt}`}
    >
      <div className="watson-quota-bar">
        <div
          className="watson-quota-fill"
          style={{ width: `${tokenPct}%` }}
        />
      </div>
      <div className="watson-quota-meta">
        <span>
          {tokensRemaining} / {maxTokens} tokens
        </span>
        <span>réinit. {status.resetAt}</span>
      </div>
    </div>
  );
};

export default ChatQuotaBar;