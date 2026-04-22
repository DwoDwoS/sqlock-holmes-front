import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useWatsonChat } from '../../hooks/useWatsonChat';
import ChatToggleButton from './ChatToggleButton';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatAlertBanner from './ChatAlertBanner';
import ChatQuotaBar from './ChatQuotaBar';
import ChatInputPanel from './ChatInputPanel';
import './WatsonChatbox.scss';

interface Props {
  investigationId?: number;
}

const WatsonChatbox: React.FC<Props> = ({ investigationId }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const lastSeenIdRef = useRef<string | null>(null);

  const {
    messages,
    isLoading,
    status,
    error,
    rateLimitResetAt,
    sendMessage,
    clearHistory,
    dismissError,
  } = useWatsonChat(Boolean(user));

  const latestMessage = messages[messages.length - 1];
  const latestId = latestMessage?.id;
  const latestRole = latestMessage?.role;

  useEffect(() => {
    if (!latestId || latestRole !== 'watson') return;

    if (isOpen) {
      lastSeenIdRef.current = latestId;
      setHasUnread(false);
    } else if (lastSeenIdRef.current !== latestId) {
      setHasUnread(true);
    }
  }, [isOpen, latestId, latestRole]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSend = useCallback(
    (message: string) => {
      sendMessage(message, investigationId);
    },
    [sendMessage, investigationId]
  );

  if (!user) return null;

  const quotaExhausted = status?.tokensRemainingThisHour === 0;
  const isRateLimited = Boolean(rateLimitResetAt);

  return (
    <div className="watson-chatbox">
      <ChatToggleButton isOpen={isOpen} hasUnread={hasUnread} onToggle={handleToggle} />

      <div
        className={`watson-panel${isOpen ? ' watson-panel--open' : ''}`}
        role="dialog"
        aria-label="Watson assistant"
        aria-hidden={!isOpen}
      >
        <ChatHeader
          canClear={messages.length > 0}
          onClear={clearHistory}
          onClose={handleToggle}
        />

        <ChatMessageList messages={messages} isLoading={isLoading} isOpen={isOpen} />

        <ChatAlertBanner
          error={error}
          rateLimitResetAt={rateLimitResetAt}
          onDismiss={dismissError}
        />

        {status && <ChatQuotaBar status={status} />}

        <ChatInputPanel
          investigationId={investigationId}
          isOpen={isOpen}
          isLoading={isLoading}
          quotaExhausted={quotaExhausted}
          isRateLimited={isRateLimited}
          onSubmit={handleSend}
        />
      </div>
    </div>
  );
};

export default WatsonChatbox;
