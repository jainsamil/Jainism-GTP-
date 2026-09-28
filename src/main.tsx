import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Unregister any old or stuck service workers to prevent cached splash loops
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  } catch (e) {
    // ignore
  }
}

// Clean any stale splash screen elements from DOM
if (typeof document !== 'undefined') {
  try {
    const staleSplashes = document.querySelectorAll('#initial-splash, .splash-content, .splash-bg, [id*="splash"], [class*="splash"], .splash-badge');
    staleSplashes.forEach((el) => el.remove());
  } catch (e) {
    // ignore
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
