// Guard shared by every WhatsApp button so one real user click can never
// push the click_whatsapp event to the dataLayer more than once, even if
// called from multiple components or fired twice by a stray double event.
let lastWhatsAppTrackAt = 0;
const DEDUPE_WINDOW_MS = 800;

export function trackWhatsAppClick(eventLabel: string): void {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  if (now - lastWhatsAppTrackAt < DEDUPE_WINDOW_MS) return;
  lastWhatsAppTrackAt = now;

  const w = window as any;

  // Single source of truth for the GTM/Google-tag trigger: push straight to
  // dataLayer instead of ALSO calling gtag('event', ...), since gtag() just
  // pushes its own arguments object into the same dataLayer and would fire
  // the same 'click_whatsapp' trigger a second time for the same click.
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: 'click_whatsapp',
    event_category: 'Kontak',
    event_label: eventLabel,
    value: 1,
  });

  if (w.fbq) {
    w.fbq('track', 'Contact');
  }

  if (w.ttq) {
    w.ttq.track('Contact');
  }
}
