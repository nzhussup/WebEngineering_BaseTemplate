import type { FormEvent, ReactElement } from 'react';

interface Props {
  readonly onSearch: (query: string) => void;
}
export function SearchForm({ onSearch }: Props): ReactElement {
  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('q');
    onSearch(typeof value === 'string' ? value.trim() : '');
  }
  return (
    <form className="search" onSubmit={submit}>
      <input
        type="search"
        name="q"
        aria-label="Search article"
        placeholder="Search query"
      />
      <input type="submit" value="Go!" />
    </form>
  );
}
