import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MessageCircle, X, Trash2, Send, Paperclip } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWatsonChat } from '../../hooks/useWatsonChat';
import { useCurrentSql } from '../../hooks/useCurrentSql';
import MarkdownText from './MarkdownText';
import './WatsonChatbox.scss';

interface Props {
  investigationId?: number;
}

const formatTime = (date: Date): string =>
  date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

const WatsonChatbox: React.FC<Props> = ({ investigationId }) => {
  const { user } = useAuth();
  const { getCurrentSql } = useCurrentSql();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasUnread, setHasUnread] = useState(false);
  const [attachedSql, setAttachedSql] = useState<string | null>(null);
  const [attachNotice, setAttachNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
    if (!isOpen && latestRole === 'watson' && latestId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasUnread(true);
    }
  }, [isOpen, latestId, latestRole]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages.length, isLoading]);

  useEffect(() => {
    if (isOpen) textareaRef.current?.focus();
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setHasUnread(false);
      return !prev;
    });
  }, []);

  const handleAttachSql = useCallback(() => {
    const sql = getCurrentSql()?.trim();
    if (!sql) {
      setAttachNotice("Aucune requête à joindre.");
      return;
    }
    setAttachedSql(sql);
    setAttachNotice(null);
  }, [getCurrentSql]);

  const handleRemoveAttachment = useCallback(() => {
    setAttachedSql(null);
    setAttachNotice(null);
  }, []);

  const handleSubmit = useCallback(() => {
    const value = inputValue.trim();
    if (!value) return;
    const finalMessage = attachedSql
      ? `${value}\n\n---\nMa requête SQL actuelle :\n\`\`\`sql\n${attachedSql}\n\`\`\``
      : value;
    sendMessage(finalMessage, investigationId);
    setInputValue('');
    setAttachedSql(null);
    setAttachNotice(null);
  }, [inputValue, attachedSql, sendMessage, investigationId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!user) return null;

  const tokensRemaining = status?.tokensRemainingThisHour ?? null;
  const maxTokens = status?.maxTokensPerHour ?? 5000;
  const tokensUsed =
    tokensRemaining !== null ? Math.max(0, maxTokens - tokensRemaining) : 0;
  const tokenPct =
    tokensRemaining !== null ? Math.min(100, (tokensUsed / maxTokens) * 100) : 0;
  const quotaExhausted = tokensRemaining === 0;
  const isRateLimited = Boolean(rateLimitResetAt);
  const inputDisabled = isLoading || quotaExhausted || isRateLimited;

  return (
    <div className="watson-chatbox">
      <button
        type="button"
        className={`watson-toggle${isOpen ? ' watson-toggle--open' : ''}`}
        onClick={handleToggle}
        aria-label={isOpen ? 'Fermer Watson' : 'Ouvrir Watson'}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
        {hasUnread && !isOpen && <span className="watson-toggle-dot" aria-hidden />}
      </button>

      <div
        className={`watson-panel${isOpen ? ' watson-panel--open' : ''}`}
        role="dialog"
        aria-label="Watson assistant"
        aria-hidden={!isOpen}
      >
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
              onClick={clearHistory}
              disabled={messages.length === 0}
              title="Effacer la conversation"
            >
              <Trash2 size={16} />
              <span>Effacer</span>
            </button>
            <button
              type="button"
              className="watson-header-btn watson-header-btn--icon"
              onClick={handleToggle}
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>
        </header>

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

        {(error || isRateLimited) && (
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
              onClick={dismissError}
              aria-label="Fermer l'erreur"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {status && (
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
        )}

        {investigationId !== undefined && (
          <div className="watson-attach-row">
            {attachedSql ? (
              <div className="watson-attachment" title={attachedSql}>
                <Paperclip size={12} aria-hidden />
                <span className="watson-attachment-label">
                  Requête SQL jointe · {attachedSql.length} car.
                </span>
                <button
                  type="button"
                  className="watson-attachment-remove"
                  onClick={handleRemoveAttachment}
                  aria-label="Retirer la requête"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="watson-attach-btn"
                onClick={handleAttachSql}
                disabled={inputDisabled}
                title="Joindre la requête SQL actuelle au message"
              >
                <Paperclip size={12} aria-hidden />
                <span>Joindre ma requête</span>
              </button>
            )}
            {attachNotice && (
              <span className="watson-attach-notice">{attachNotice}</span>
            )}
          </div>
        )}

        <div className="watson-input">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              quotaExhausted
                ? 'Quota horaire épuisé…'
                : isRateLimited
                ? 'Patientez avant de relancer…'
                : 'Écrivez à Watson… (Entrée pour envoyer, Maj+Entrée = saut de ligne)'
            }
            rows={2}
            maxLength={1000}
            disabled={inputDisabled}
          />
          <button
            type="button"
            className="watson-send"
            onClick={handleSubmit}
            disabled={inputDisabled || inputValue.trim().length === 0}
            aria-label="Envoyer"
            title="Envoyer le message"
          >
            <Send size={18} aria-hidden />
            <span className="watson-send-label">Envoyer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatsonChatbox;