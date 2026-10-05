import type { ReactElement } from 'react';
import { SearchForm } from '../search/SearchForm.tsx';

export function Header(): ReactElement {
  return (
    <header className="header">
      <h1>Welcome to our wildlife website</h1>
    </header>
  );
}
export function Navigation({
  onSearch,
}: {
  readonly onSearch: (query: string) => void;
}): ReactElement {
  return (
    <nav className="nav">
      <ul>
        {['Home', 'Our team', 'Projects', 'Blog'].map((label) => (
          <li key={label}>
            <a href="#">{label}</a>
          </li>
        ))}
      </ul>
      <SearchForm onSearch={onSearch} />
    </nav>
  );
}
export function RelatedLinks(): ReactElement {
  return (
    <aside className="secondary">
      <h2>Related</h2>
      <ul>
        {['Bees', 'Otters', 'Penguins', 'Octopi', 'Lemurs'].map((animal) => (
          <li key={animal}>
            <a href="#">The trouble with {animal}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
export function Footer(): ReactElement {
  return (
    <footer>
      <p>©Copyright 2050 by nobody. All rights reversed.</p>
    </footer>
  );
}
