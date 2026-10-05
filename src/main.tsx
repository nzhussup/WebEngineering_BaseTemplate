import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { requireElement } from './dom.ts';

const container = requireElement('#root', HTMLDivElement);
createRoot(container).render(<App />);
