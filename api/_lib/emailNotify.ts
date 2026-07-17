// Sends the actual human-facing lead notification. This is the real delivery
// mechanism — the Meta CAPI call in metaCapi.ts is ad-tracking only and never
// puts lead data in front of anyone at the business.
export interface LeadNotificationInput {
  name: string;
  email: string;
  phone: string;
  city?: string;
  serviceType: string;
  message?: string;
  eventSourceUrl: string;
}

export class EmailNotifyError extends Error {
  constructor(message: string, public readonly providerResponse?: unknown) {
    super(message);
    this.name = 'EmailNotifyError';
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendLeadNotificationEmail(input: LeadNotificationInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey || !to) {
    throw new EmailNotifyError('Missing RESEND_API_KEY or LEAD_NOTIFICATION_EMAIL environment variable');
  }

  const rows = [
    ['Nama', input.name],
    ['Email', input.email],
    ['WhatsApp', input.phone],
    ['Kota', input.city || '-'],
    ['Layanan', input.serviceType],
    ['Keluhan', input.message || '-'],
    ['Sumber', input.eventSourceUrl],
  ];

  const html = `
    <h2>Lead baru dari Konsultasi Gratis</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="font-weight:bold;vertical-align:top">${escapeHtml(label)}</td><td>${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`,
        )
        .join('')}
    </table>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: input.email,
      subject: `Lead baru: ${input.name} (${input.serviceType})`,
      html,
    }),
  });

  const json = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new EmailNotifyError(`Resend request failed with status ${response.status}`, json);
  }
}
