import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Router from './router/routes.tsx';
import { AgenticaRpcProvider } from './agentica/AgenticaRpcProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AgenticaRpcProvider>
      <Router />
    </AgenticaRpcProvider>
  </StrictMode>
);
