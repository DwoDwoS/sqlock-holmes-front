import React from 'react';

type Token =
  | { kind: 'text'; value: string }
  | { kind: 'bold'; value: string }
  | { kind: 'code'; value: string };

const INLINE_REGEX = /(\*\*([^*]+)\*\*)|(`([^`]+)`)/g;

const parseInline = (line: string): Token[] => {
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  INLINE_REGEX.lastIndex = 0;
  while ((match = INLINE_REGEX.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ kind: 'text', value: line.slice(lastIndex, match.index) });
    }
    if (match[2] !== undefined) {
      tokens.push({ kind: 'bold', value: match[2] });
    } else if (match[4] !== undefined) {
      tokens.push({ kind: 'code', value: match[4] });
    }
    lastIndex = INLINE_REGEX.lastIndex;
  }
  if (lastIndex < line.length) {
    tokens.push({ kind: 'text', value: line.slice(lastIndex) });
  }
  return tokens;
};

const renderInline = (line: string, keyPrefix: string): React.ReactNode[] => {
  return parseInline(line).map((tok, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (tok.kind === 'bold') return <strong key={key}>{tok.value}</strong>;
    if (tok.kind === 'code') return <code key={key} className="watson-inline-code">{tok.value}</code>;
    return <React.Fragment key={key}>{tok.value}</React.Fragment>;
  });
};

interface Block {
  kind: 'text' | 'code';
  language?: string;
  content: string;
}

const splitBlocks = (raw: string): Block[] => {
  const blocks: Block[] = [];
  const fenceRe = /```(\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = fenceRe.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({ kind: 'text', content: raw.slice(lastIndex, match.index) });
    }
    blocks.push({
      kind: 'code',
      language: match[1] || 'text',
      content: match[2].replace(/\n$/, ''),
    });
    lastIndex = fenceRe.lastIndex;
  }
  if (lastIndex < raw.length) {
    blocks.push({ kind: 'text', content: raw.slice(lastIndex) });
  }
  return blocks;
};

interface Props {
  content: string;
}

const MarkdownText: React.FC<Props> = ({ content }) => {
  const blocks = splitBlocks(content);
  return (
    <>
      {blocks.map((block, idx) => {
        if (block.kind === 'code') {
          return (
            <pre key={idx} className={`watson-code-block watson-code-block--${block.language}`}>
              <code>{block.content}</code>
            </pre>
          );
        }
        const lines = block.content.split('\n');
        return (
          <React.Fragment key={idx}>
            {lines.map((line, lineIdx) => (
              <React.Fragment key={lineIdx}>
                {renderInline(line, `${idx}-${lineIdx}`)}
                {lineIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default MarkdownText;