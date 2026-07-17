// Fires the Lead conversion on both the browser Meta Pixel and the server-side
// Meta Conversions API using the SAME event_id, so Meta deduplicates the two
// into a single event instead of counting it twice.
export interface ConsultationLeadInput {
  firstName: string;
  email: string;
  phone: string;
  city: string;
  leadType: string;
  serviceType: string;
}

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export async function submitConsultationLead(input: ConsultationLeadInput): Promise<{ ok: boolean }> {
  const eventId = crypto.randomUUID();
  const eventSourceUrl = window.location.href;

  const w = window as any;
  if (w.fbq) {
    w.fbq(
      'track',
      'Lead',
      {
        content_name: input.serviceType,
        lead_type: input.leadType,
      },
      { eventID: eventId },
    );
  }

  try {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        eventSourceUrl,
        email: input.email,
        phone: input.phone,
        firstName: input.firstName,
        city: input.city,
        leadType: input.leadType,
        serviceType: input.serviceType,
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
      }),
    });

    if (!response.ok) {
      console.error('[meta-capi] Server lead tracking failed', response.status, await response.text());
      return { ok: false };
    }

    return { ok: true };
  } catch (err) {
    console.error('[meta-capi] Server lead tracking request threw', err);
    return { ok: false };
  }
}
