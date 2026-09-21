import { createContext, useContext, useEffect } from 'react';

// Dipakai di setiap halaman untuk kasih title/description/OG tag yang UNIK per
// route -- sebelum ini semua halaman berbagi satu <title> statis dari
// index.html, yang bikin Google menganggap situs ini cuma 1 halaman.
//
// Zero-dependency (bukan react-helmet). Dua jalur:
//  - CLIENT: manipulasi DOM langsung lewat useEffect (navigasi SPA).
//  - BUILD (prerender/SSG): entry-server.tsx menyediakan HeadCollectorContext;
//    hook mengisi collector SAAT RENDER (bukan di effect, karena effect tidak
//    jalan di server), lalu scripts/prerender.mjs menulis tag-nya ke <head>
//    HTML statis tiap route. Di browser context ini null, jadi tidak ada
//    perubahan perilaku.

const SITE_URL = 'https://sanomatrassehat.com';
const SITE_NAME = 'KLINIK MATRAS by SANO CARE';
const DEFAULT_IMAGE = `${SITE_URL}/hero-section.png`;

interface SEOInput {
  /** Judul halaman TANPA suffix brand -- hook yang nambahin " | KLINIK MATRAS by SANO CARE" */
  title: string;
  description: string;
  /** Path route, mis. "/klinik-matras" -- dipakai untuk canonical & og:url */
  path: string;
  /** Path gambar root-relative (mis. "/pelayanan-matras.png") atau URL absolut. Default: hero-section.png */
  image?: string;
}

/** Data <head> final untuk satu route (sudah di-resolve). */
export interface HeadData {
  path: string;
  title: string;
  description: string;
  url: string;
  image: string;
}

/** Diisi entry-server.tsx saat prerender; null di browser. */
export const HeadCollectorContext = createContext<{ current: HeadData | null } | null>(null);

function resolveHead({ title, description, path, image }: SEOInput): HeadData {
  return {
    path,
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${SITE_URL}${path}`,
    image: image
      ? (image.startsWith('http') ? image : `${SITE_URL}${image}`)
      : DEFAULT_IMAGE,
  };
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** String tag <head> untuk prerender. Tag identik dengan yang dibuat useEffect di client. */
export function renderHeadTags(head: HeadData): string {
  const meta = (attr: 'name' | 'property', key: string, content: string) =>
    `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`;
  return [
    `<title>${escapeAttr(head.title)}</title>`,
    meta('name', 'description', head.description),
    `<link rel="canonical" href="${escapeAttr(head.url)}" />`,
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', SITE_NAME),
    meta('property', 'og:locale', 'id_ID'),
    meta('property', 'og:title', head.title),
    meta('property', 'og:description', head.description),
    meta('property', 'og:url', head.url),
    meta('property', 'og:image', head.image),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', head.title),
    meta('name', 'twitter:description', head.description),
    meta('name', 'twitter:image', head.image),
  ].join('\n    ');
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSEO({ title, description, path, image }: SEOInput) {
  const collector = useContext(HeadCollectorContext);
  const head = resolveHead({ title, description, path, image });

  // Server/prerender: catat data head saat render.
  if (collector) collector.current = head;

  useEffect(() => {
    document.title = head.title;
    upsertMeta('name', 'description', head.description);
    upsertLink('canonical', head.url);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', 'id_ID');
    upsertMeta('property', 'og:title', head.title);
    upsertMeta('property', 'og:description', head.description);
    upsertMeta('property', 'og:url', head.url);
    upsertMeta('property', 'og:image', head.image);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', head.title);
    upsertMeta('name', 'twitter:description', head.description);
    upsertMeta('name', 'twitter:image', head.image);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image]);
}
