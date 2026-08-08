// Guard shared by every WhatsApp button so one real user click can never
// push the click_whatsapp event to the dataLayer more than once, even if
// called from multiple components or fired twice by a stray double event.
let lastWhatsAppTrackAt = 0;
const DEDUPE_WINDOW_MS = 800;

// Single source of truth for the WhatsApp click conversion event.
// GTM's "Tracking Konversi Google Ads" tag listens for a dataLayer push
// with `event: 'click_whatsapp'`. Do not also call gtag('event', 'click_whatsapp', ...)
// anywhere else — gtag() is defined in index.html as `dataLayer.push(arguments)`,
// so calling both pushes the same conversion twice per click.
export function trackWhatsAppClick(eventLabel: string): void {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  if (now - lastWhatsAppTrackAt < DEDUPE_WINDOW_MS) return;
  lastWhatsAppTrackAt = now;

  const w = window as any;

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
