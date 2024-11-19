import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; 
import './index.scss';
import App from './view/app/App';

createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>

    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
