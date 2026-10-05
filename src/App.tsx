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
  const [appliedQuery, setAppliedQuery] = useState('');
  return (
    <>
      <Header />
      <Navigation onSearch={setAppliedQuery} />
      <main>
        <WildlifeArticle query={appliedQuery} />
        <RelatedLinks />
      </main>
      <Footer />
    </>
  );
}
