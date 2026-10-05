import type { ReactElement } from 'react';
import type { Bear } from '../../types.ts';
import { SafeImage } from '../shared/SafeImage.tsx';
import { Highlight } from '../search/Highlight.tsx';

export interface BearView extends Bear {
  readonly imageUrl: string | null;
  readonly imageError: boolean;
}
export function BearCard({
  bear,
  query,
}: {
  readonly bear: BearView;
  readonly query: string;
}): ReactElement {
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
          <Highlight text={bear.name} query={query} />
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
