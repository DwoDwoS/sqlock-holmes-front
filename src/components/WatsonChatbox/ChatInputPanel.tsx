import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Paperclip, Send, X } from 'lucide-react';
import { useCurrentSql } from '../../hooks/useCurrentSql';

interface ChatInputPanelProps {
  investigationId?: number;
  isOpen: boolean;
  isLoading: boolean;
  quotaExhausted: boolean;
  isRateLimited: boolean;
  onSubmit: (message: string) => void;
}

const composeMessage = (text: string, attachedSql: string | null): string => {
  if (!attachedSql) return text;
  return `${text}\n\n---\nMa requête SQL actuelle :\n\`\`\`sql\n${attachedSql}\n\`\`\``;
};

const ChatInputPanel: React.FC<ChatInputPanelProps> = ({
  investigationId,
  isOpen,
  isLoading,
  quotaExhausted,
  isRateLimited,
  onSubmit,
}) => {
  const { getCurrentSql } = useCurrentSql();
  const [inputValue, setInputValue] = useState('');
  const [attachedSql, setAttachedSql] = useState<string | null>(null);
  const [attachNotice, setAttachNotice] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isOpen) textareaRef.current?.focus();
  }, [isOpen]);

  const inputDisabled = isLoading || quotaExhausted || isRateLimited;

  const handleAttachSql = useCallback(() => {
    const sql = getCurrentSql()?.trim();
    if (!sql) {
      setAttachNotice('Aucune requête à joindre.');
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
    onSubmit(composeMessage(value, attachedSql));
    setInputValue('');
    setAttachedSql(null);
    setAttachNotice(null);
  }, [inputValue, attachedSql, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
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
    </>
  );
};

export default ChatInputPanel;