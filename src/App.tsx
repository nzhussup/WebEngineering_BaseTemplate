import type { ReactElement } from 'react';
import { LegacyContent } from './LegacyContent.tsx';

export function App(): ReactElement {
  return (
    <>
      <header className="header">
        <h1>Welcome to our wildlife website</h1>
      </header>
      <LegacyContent />
      <footer>
        <p>©Copyright 2050 by nobody. All rights reversed.</p>
      </footer>
    </>
  );
}
