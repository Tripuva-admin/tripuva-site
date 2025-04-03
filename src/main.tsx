import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// import './assets/timeburner-font/Timeburner-xJB8.ttf'
// import './assets/timeburner-font/TimeburnerBold-peGR.ttf'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);