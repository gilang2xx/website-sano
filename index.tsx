import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App, { preloadRoute, isPublicRoute } from './App';
import { beginAttributionHydration } from './utils/attribution';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

const normalizePath = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/';

// scripts/prerender.mjs menandai HTML statis dengan data-ssg-path="<route>".
// Hydrate HANYA kalau HTML itu memang untuk URL yang sedang dibuka; kalau
// tidak (mis. shell SPA cadangan / URL tak dikenal / dev server) render
// biasa dari nol seperti sebelumnya.
const ssgPath = rootElement.getAttribute('data-ssg-path');
const currentPath = normalizePath(window.location.pathname);

// dist/404.html memakai penanda "*": HTML itu sah untuk URL APA PUN yang bukan
// route publik (Vercel menyajikannya dengan status 404).
const isSsgForThisUrl = ssgPath === '*'
  ? !isPublicRoute(currentPath)
  : ssgPath !== null && normalizePath(ssgPath) === currentPath;

if (isSsgForThisUrl && rootElement.hasChildNodes()) {
  // href WhatsApp harus sama dengan HTML server saat hydration (lihat
  // utils/attribution.ts); Layout menempelkan tag referral setelahnya.
  beginAttributionHydration();
  // Muat chunk halaman dulu supaya tidak ada spinner di atas HTML prerender.
  preloadRoute(currentPath)
    .catch(() => undefined)
    .then(() => {
      hydrateRoot(rootElement, app);
    });
} else {
  rootElement.replaceChildren();
  createRoot(rootElement).render(app);
}
