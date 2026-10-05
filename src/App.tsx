import type { ReactElement } from 'react';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import {
  Header,
  Navigation,
  RelatedLinks,
  Footer,
} from './components/layout/PageLayout.tsx';
import { WildlifeArticle } from './components/article/WildlifeArticle.tsx';
import { BearDetailPage } from './components/bears/BearDetailPage.tsx';

export function App(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const appliedQuery = searchParams.get('q')?.trim() ?? '';

  function applySearch(query: string): void {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (query === '') next.delete('q');
      else next.set('q', query);
      return next;
    });
  }

  return (
    <>
      <Header />
      <Navigation query={appliedQuery} onSearch={applySearch} />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/bears" replace />} />
          <Route
            path="/bears"
            element={<WildlifeArticle query={appliedQuery} />}
          />
          <Route
            path="/bears/:bearId"
            element={<BearDetailPage query={appliedQuery} />}
          />
          <Route path="*" element={<Navigate to="/bears" replace />} />
        </Routes>
        <RelatedLinks />
      </main>
      <Footer />
    </>
  );
}
