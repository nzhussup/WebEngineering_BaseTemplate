import type { ReactElement } from 'react';
import { BearList } from './BearCard.tsx';
import { Highlight } from '../search/Highlight.tsx';
import { useBears } from './useBears.ts';

export function BearsSection({
  query,
}: {
  readonly query: string;
}): ReactElement {
  const { state, reload } = useBears();
  const message =
    state.status === 'loading'
      ? 'Loading bears…'
      : state.status === 'empty'
        ? 'No bears are listed in the returned species tables.'
        : state.status === 'error'
          ? state.message
          : '';
  return (
    <section className="more_bears" aria-busy={state.status === 'loading'}>
      <h2>
        <Highlight text="More Bears" query={query} />
      </h2>
      <p className="bear-status" role="status" aria-live="polite">
        {message}
      </p>
      <button type="button" onClick={reload}>
        {state.status === 'error' ? 'Retry loading bears' : 'Reload bears'}
      </button>
      {state.status === 'success' && (
        <BearList bears={state.bears} query={query} />
      )}
    </section>
  );
}
