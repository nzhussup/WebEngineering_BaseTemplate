import type { ReactElement } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Bear } from '../../types.ts';
import { SafeImage } from '../shared/SafeImage.tsx';
import { Highlight } from '../search/Highlight.tsx';
import { getBearId } from './bearRoutes.ts';

export interface BearView extends Bear {
  readonly imageUrl: string | null;
  readonly imageError: boolean;
}
export function BearCard({
  bear,
  query,
  linkToDetail = true,
}: {
  readonly bear: BearView;
  readonly query: string;
  readonly linkToDetail?: boolean;
}): ReactElement {
  const location = useLocation();
  const title = <Highlight text={bear.name} query={query} />;
  return (
    <div className="bear">
      <SafeImage
        src={bear.imageUrl}
        description={'Image of ' + bear.name}
        width={200}
      />
      {bear.imageError && (
        <p>Image could not be loaded. A placeholder is shown.</p>
      )}
      <p>
        <b>
          {linkToDetail ? (
            <Link
              to={{
                pathname: '/bears/' + getBearId(bear),
                search: location.search,
              }}
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </b>{' '}
        (<Highlight text={bear.binomial} query={query} />)
      </p>
      <p>
        <Highlight text={'Range: ' + bear.range} query={query} />
      </p>
    </div>
  );
}
export function BearList({
  bears,
  query,
}: {
  readonly bears: readonly BearView[];
  readonly query: string;
}): ReactElement {
  return (
    <div className="bear-list">
      {bears.map((bear) => (
        <BearCard key={bear.binomial} bear={bear} query={query} />
      ))}
    </div>
  );
}
