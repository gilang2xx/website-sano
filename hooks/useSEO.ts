import { useEffect } from 'react';

// Dipakai di setiap halaman untuk kasih title/description/OG tag yang UNIK per
// route -- sebelum ini semua halaman berbagi satu <title> statis dari
// index.html, yang bikin Google menganggap situs ini cuma 1 halaman.
//
// Zero-dependency (bukan react-helmet) supaya tidak nambah bundle -- cukup
// manipulasi DOM langsung lewat useEffect. Ini cukup untuk Google (Googlebot
// menjalankan JS), tapi TIDAK terbaca oleh crawler yang tidak menjalankan JS
// (mis. bot preview link WhatsApp/Meta). Untuk itu index.html sudah dikasih
// OG tag statis (brand-level) sebagai fallback baseline di semua halaman.

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
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;
    const resolvedImage = image
      ? (image.startsWith('http') ? image : `${SITE_URL}${image}`)
      : DEFAULT_IMAGE;

    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    upsertLink('canonical', url);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', 'id_ID');
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', resolvedImage);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', resolvedImage);
  }, [title, description, path, image]);
}
