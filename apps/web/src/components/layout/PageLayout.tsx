import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { SearchForm } from '../search/SearchForm.tsx';

export function Header(): ReactElement {
  return (
    <header className="header">
      <h1>Welcome to our wildlife website</h1>
    </header>
  );
}
export function Navigation({
  query,
  onSearch,
}: {
  readonly query: string;
  readonly onSearch: (query: string) => void;
}): ReactElement {
  const links = [
    { label: 'Home', path: '/bears' },
    { label: 'Our team', path: '/bears' },
    { label: 'Projects', path: '/bears' },
    { label: 'Blog', path: '/bears' },
  ];
  return (
    <nav className="nav">
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.path}>{link.label}</Link>
          </li>
        ))}
      </ul>
      <SearchForm query={query} onSearch={onSearch} />
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
