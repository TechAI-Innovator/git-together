import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { startHealthChecks } from '@fast-bites/api-client';
import App from './App';
import './index.css';

startHealthChecks();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
