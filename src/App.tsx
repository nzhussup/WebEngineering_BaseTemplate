import { useState } from 'react';
import type { ReactElement } from 'react';
import {
  Header,
  Navigation,
  RelatedLinks,
  Footer,
} from './components/layout/PageLayout.tsx';
import { WildlifeArticle } from './components/article/WildlifeArticle.tsx';

export function App(): ReactElement {
  const [query, setQuery] = useState('');
  return (
    <>
      <Header />
      <Navigation onSearch={setQuery} />
      <main>
        <WildlifeArticle query={query} />
        <RelatedLinks />
      </main>
      <Footer />
    </>
  );
}
