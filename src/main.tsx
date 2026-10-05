import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './App.tsx';
import { requireElement } from './dom.ts';

const container = requireElement('#root', HTMLDivElement);
createRoot(container).render(
  <HashRouter>
    <App />
  </HashRouter>
);
