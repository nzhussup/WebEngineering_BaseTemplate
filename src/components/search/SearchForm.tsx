import { useEffect, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';

interface Props {
  readonly query: string;
  readonly onSearch: (query: string) => void;
}
export function SearchForm({ query, onSearch }: Props): ReactElement {
  const [draftQuery, setDraftQuery] = useState(query);

  useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSearch(draftQuery.trim());
  }
  return (
    <form className="search" onSubmit={submit}>
      <input
        type="search"
        name="q"
        aria-label="Search article"
        placeholder="Search query"
        value={draftQuery}
        onChange={(event) => {
          setDraftQuery(event.currentTarget.value);
        }}
      />
      <input type="submit" value="Go!" />
    </form>
  );
}
