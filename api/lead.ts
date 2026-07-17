import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MetaCapiError, sendMetaLeadEvent } from './_lib/metaCapi';

interface LeadRequestBody {
  eventId: string;
  eventSourceUrl: string;
  email?: string;
  phone?: string;
  firstName?: string;
  city?: string;
  leadType: string;
  serviceType: string;
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

  if (!body?.eventId || !body.eventSourceUrl || !body.leadType || !body.serviceType) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  if (!body.email && !body.phone) {
    return res.status(400).json({ ok: false, error: 'At least one of email or phone is required' });
  }

  const userAgent = req.headers['user-agent'];

  try {
    const metaResponse = await sendMetaLeadEvent({
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
    });

    console.log('[meta-capi] Lead event sent', {
      eventId: body.eventId,
      serviceType: body.serviceType,
      metaResponse,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const metaResponse = err instanceof MetaCapiError ? err.metaResponse : undefined;

    console.error('[meta-capi] Failed to send Lead event', {
      eventId: body.eventId,
      message,
      metaResponse,
    });

    return res.status(502).json({ ok: false, error: 'Failed to send conversion event' });
  }
}
