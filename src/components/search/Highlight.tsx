import type { ReactElement } from 'react';

interface Props {
  readonly text: string;
  readonly query: string;
}

export function Highlight({ text, query }: Props): ReactElement {
  if (query === '') return <>{text}</>;
  const pattern = new RegExp(
    query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    'gi'
  );
  const pieces: ReactElement[] = [];
  let offset = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index === undefined) continue;
    pieces.push(
      <span key={'text-' + offset}>{text.slice(offset, match.index)}</span>
    );
    pieces.push(
      <mark className="highlight" key={'match-' + match.index}>
        {match[0]}
      </mark>
    );
    offset = match.index + match[0].length;
  }
  return (
    <>
      {pieces}
      {text.slice(offset)}
    </>
  );
}
