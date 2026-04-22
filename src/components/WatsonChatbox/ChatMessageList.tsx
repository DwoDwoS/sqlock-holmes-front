import React, { useEffect, useRef } from 'react';
import MarkdownText from './MarkdownText';
import type { ChatMessage } from '../../types/watson';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
}

const formatTime = (date: Date): string =>
  date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isLoading, isOpen }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages.length, isLoading]);

  return (
    <div className="watson-messages" role="log" aria-live="polite">
      {messages.length === 0 && (
        <div className="watson-empty">
          <p className="watson-empty-title">Bonjour détective.</p>
          <p className="watson-empty-hint">
            Posez-moi une question sur votre enquête, une syntaxe SQL,
            ou demandez une piste pour avancer.
          </p>
        </div>
      )}

      {messages.map((m) => (
        <div
          key={m.id}
          className={`watson-msg watson-msg--${m.role}`}
        >
          {m.role === 'watson' && (
            <div className="watson-msg-avatar" aria-hidden>🕵️</div>
          )}
          <div className="watson-msg-bubble">
            <div className="watson-msg-content">
              <MarkdownText content={m.content} />
            </div>
            <div className="watson-msg-meta">
              <span>{formatTime(m.timestamp)}</span>
              {m.fromCache && <span className="watson-msg-cache">· cache</span>}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="watson-msg watson-msg--watson">
          <div className="watson-msg-avatar" aria-hidden>🕵️</div>
          <div className="watson-msg-bubble watson-msg-bubble--typing">
            <span className="watson-typing-label">Watson réfléchit</span>
            <span className="watson-typing-dots">
              <span />
              <span />
              <span />
            </span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;