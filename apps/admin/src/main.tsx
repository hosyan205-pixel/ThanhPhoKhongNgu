import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { environmentSchema } from '@tpkn/validation';
import { App } from './App';
import './styles.css';

document.documentElement.dataset['environment'] = environmentSchema.parse(
  import.meta.env.VITE_APP_ENV || import.meta.env.MODE,
);

const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
