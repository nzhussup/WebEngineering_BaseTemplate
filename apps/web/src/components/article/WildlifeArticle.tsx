import { BearComparison } from './BearComparison.tsx';
import type { ReactElement } from 'react';
import wildBear from '../../../media/wild-bear.jpg';
import urbanBear from '../../../media/urban-bear.jpg';
import bearMp3 from '../../../media/bear.mp3';
import bearOgg from '../../../media/bear.ogg';
import { Highlight } from '../search/Highlight.tsx';
import { SafeImage } from '../shared/SafeImage.tsx';
import { CommentsSection } from '../comments/CommentsSection.tsx';
import { BearsSection } from '../bears/BearsSection.tsx';

interface Props {
  readonly query: string;
}
export function WildlifeArticle({ query }: Props): ReactElement {
  return (
    <article>
      <h2>
        <Highlight query={query} text={'The trouble with Bears'} />
      </h2>
      <br />
      <br />
      <Highlight query={query} text={'By Evan Wild'} />
      <br />
      <br />
      <Highlight
        query={query}
        text={
          'Tall, lumbering, angry, dangerous. The real live bears of this world are proud, independent creatures, self-serving and always on the hunt for food.'
        }
      />
      <br />
      <br />
      <h3>
        <Highlight query={query} text={'Types of bear'} />
      </h3>
      <br />
      <br />
      <BearComparison query={query} />
      <h3>
        <Highlight query={query} text={'Habitats and Eating habits'} />
      </h3>
      <br />
      <br />
      <Highlight
        query={query}
        text={
          'Wild bears eat a variety of meat, fish, fruit, nuts, and other natually growing ingredients...'
        }
      />
      <br />
      <br />
      <SafeImage src={wildBear} description="Wild bear in forest" />
      <br />
      <br />
      <Highlight
        query={query}
        text={
          'Urban (gentrified) bears on the other hand have largely abandoned the old ways...'
        }
      />
      <br />
      <br />
      <SafeImage src={urbanBear} description="Urban bear near buildings" />
      <br />
      <br />
      <h3>
        <Highlight query={query} text={'Mating rituals'} />
      </h3>
      <br />
      <br />
      <Highlight
        query={query}
        text={'Bears are romantic creatures by nature...'}
      />
      <br />
      <br />
      <audio controls>
        <source src={bearMp3} type="audio/mpeg" />
        <source src={bearOgg} type="audio/ogg" />
        <p>
          <Highlight
            query={query}
            text={
              "It looks like your browser doesn't support HTML5 audio players."
            }
          />
        </p>
      </audio>
      <aside>
        <h3>
          <Highlight query={query} text={'About the author'} />
        </h3>
        <br />
        <br />
        <Highlight
          query={query}
          text={'Evan Wild is an unemployed plumber from Doncaster...'}
        />
      </aside>
      <CommentsSection query={query} />
      <BearsSection query={query} />
    </article>
  );
}
