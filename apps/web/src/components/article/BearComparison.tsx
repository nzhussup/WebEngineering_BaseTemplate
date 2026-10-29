import type { ReactElement } from 'react';
import { Highlight } from '../search/Highlight.tsx';

export function BearComparison({
  query,
}: {
  readonly query: string;
}): ReactElement {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">
            <Highlight query={query} text={'Bear Type'} />
          </th>
          <th scope="col">
            <Highlight query={query} text={'Coat'} />
          </th>
          <th scope="col">
            <Highlight query={query} text={'Adult size'} />
          </th>
          <th scope="col">
            <Highlight query={query} text={'Habitat'} />
          </th>
          <th scope="col">
            <Highlight query={query} text={'Lifespan'} />
          </th>
          <th scope="col">
            <Highlight query={query} text={'Diet'} />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">
            <Highlight query={query} text={'Wild'} />
          </th>
          <td>
            <Highlight query={query} text={'Brown or black'} />
          </td>
          <td>
            <Highlight query={query} text={'1.4 to 2.8 meters'} />
          </td>
          <td>
            <Highlight query={query} text={'Woods and forests'} />
          </td>
          <td>
            <Highlight query={query} text={'25 to 28 years'} />
          </td>
          <td>
            <Highlight query={query} text={'Fish, meat, plants'} />
          </td>
        </tr>
        <tr>
          <th scope="row">
            <Highlight query={query} text={'Urban'} />
          </th>
          <td>
            <Highlight query={query} text={'North Face'} />
          </td>
          <td>
            <Highlight query={query} text={'18 to 22'} />
          </td>
          <td>
            <Highlight query={query} text={'Condos and coffee shops'} />
          </td>
          <td>
            <Highlight query={query} text={'20 to 32 years'} />
          </td>
          <td>
            <Highlight query={query} text={'Starbucks, sushi'} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
