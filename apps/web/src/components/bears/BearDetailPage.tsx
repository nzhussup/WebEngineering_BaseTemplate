import type { ReactElement } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Highlight } from '../search/Highlight.tsx';
import { BearCard } from './BearCard.tsx';
import { getBearId } from './bearRoutes.ts';
import { useBears } from './useBears.ts';

export function BearDetailPage({
  query,
}: {
  readonly query: string;
}): ReactElement {
  const { bearId } = useParams();
  const location = useLocation();
  const { state, reload } = useBears();

  const message =
    state.status === 'loading'
      ? 'Loading bear details...'
      : state.status === 'empty'
        ? 'No bears are listed in the returned species tables.'
        : state.status === 'error'
          ? state.message
          : '';

  if (state.status === 'success') {
    const bear = state.bears.find((item) => getBearId(item) === bearId);
    return (
      <article>
        <p>
          <Link to={{ pathname: '/bears', search: location.search }}>
            Back to bear list
          </Link>
        </p>
        {bear === undefined ? (
          <>
            <h2>Bear not found</h2>
            <p>
              The selected bear id does not match the loaded Wikipedia species
              list.
            </p>
          </>
        ) : (
          <section className="bear-detail">
            <h2>
              <Highlight text={bear.name} query={query} />
            </h2>
            <BearCard bear={bear} query={query} linkToDetail={false} />
          </section>
        )}
      </article>
    );
  }

  return (
    <article aria-busy={state.status === 'loading'}>
      <p>
        <Link to={{ pathname: '/bears', search: location.search }}>
          Back to bear list
        </Link>
      </p>
      <h2>
        <Highlight text="Bear details" query={query} />
      </h2>
      <p className="bear-status" role="status" aria-live="polite">
        {message}
      </p>
      <button type="button" onClick={reload}>
        {state.status === 'error' ? 'Retry loading bear' : 'Reload bear'}
      </button>
    </article>
  );
}
