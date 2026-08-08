import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MetaCapiError, sendMetaLeadEvent } from './_lib/metaCapi.js';
import { EmailNotifyError, sendLeadNotificationEmail } from './_lib/emailNotify.js';

interface LeadRequestBody {
  eventId: string;
  eventSourceUrl: string;
  name?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  city?: string;
  leadType: string;
  serviceType: string;
  message?: string;
  fbp?: string;
  fbc?: string;
}

function getClientIp(req: VercelRequest): string | undefined {
  const forwardedFor = req.headers['x-forwarded-for'];
  const first = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
  return first?.split(',')[0]?.trim() || req.socket?.remoteAddress || undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = req.body as Partial<LeadRequestBody> | undefined;

  if (!body?.eventId || !body.eventSourceUrl || !body.leadType || !body.serviceType || !body.name) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  if (!body.email && !body.phone) {
    return res.status(400).json({ ok: false, error: 'At least one of email or phone is required' });
  }

  const userAgent = req.headers['user-agent'];

  // Email is the actual lead-delivery mechanism (someone at the business has
  // to see this), so its failure is what the caller should be told about.
  // Meta CAPI is ad-tracking only — best-effort, logged, never blocks the lead.
  const [emailResult, metaResult] = await Promise.allSettled([
    sendLeadNotificationEmail({
      name: body.name,
      email: body.email ?? '',
      phone: body.phone ?? '',
      city: body.city,
      serviceType: body.serviceType,
      message: body.message,
      eventSourceUrl: body.eventSourceUrl,
    }),
    sendMetaLeadEvent({
      eventId: body.eventId,
      eventSourceUrl: body.eventSourceUrl,
      email: body.email,
      phone: body.phone,
      firstName: body.firstName,
      city: body.city,
      location: body.city,
      leadType: body.leadType,
      serviceType: body.serviceType,
      clientIp: getClientIp(req),
      clientUserAgent: typeof userAgent === 'string' ? userAgent : undefined,
      fbp: body.fbp,
      fbc: body.fbc,
      testEventCode: process.env.META_TEST_EVENT_CODE,
    }),
  ]);

  if (metaResult.status === 'fulfilled') {
    console.log('[meta-capi] Lead event sent', { eventId: body.eventId, serviceType: body.serviceType });
  } else {
    const err = metaResult.reason;
    console.error('[meta-capi] Failed to send Lead event (non-blocking)', {
      eventId: body.eventId,
      message: err instanceof Error ? err.message : 'Unknown error',
      metaResponse: err instanceof MetaCapiError ? err.metaResponse : undefined,
    });
  }

  if (emailResult.status === 'rejected') {
    const err = emailResult.reason;
    console.error('[email-notify] Failed to send lead notification email', {
      eventId: body.eventId,
      message: err instanceof Error ? err.message : 'Unknown error',
      providerResponse: err instanceof EmailNotifyError ? err.providerResponse : undefined,
    });
    return res.status(502).json({ ok: false, error: 'Failed to deliver lead notification' });
  }

  console.log('[email-notify] Lead notification email sent', { eventId: body.eventId });
  return res.status(200).json({ ok: true });
}
