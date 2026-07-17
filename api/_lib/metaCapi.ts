import crypto from 'node:crypto';

const GRAPH_API_VERSION = 'v21.0';

export function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// Meta requires trimmed, lowercased email before hashing.
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Meta requires digits only, country code included, no leading '+'.
// Assumes Indonesian numbers: a leading local '0' is rewritten to '62'.
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }
  return digits;
}

// Meta requires trimmed, lowercased, letters-only value for fn/ct before hashing.
export function normalizeNameOrCity(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z]/g, '');
}

export interface LeadEventInput {
  eventId: string;
  eventSourceUrl: string;
  actionSource?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  city?: string;
  leadType: string;
  serviceType: string;
  location?: string;
  clientIp?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
  testEventCode?: string;
}

export class MetaCapiError extends Error {
  constructor(message: string, public readonly metaResponse?: unknown, public readonly status?: number) {
    super(message);
    this.name = 'MetaCapiError';
  }
}

// Lead value is resolved server-side (never trusted from the client) so ad
// spend optimization can't be manipulated by tampering with the request body.
// Override per service via META_LEAD_VALUE_MAP (JSON, e.g. '{"klinik_matras":150000}'),
// fall back to META_LEAD_DEFAULT_VALUE, then to a hardcoded default.
function resolveLeadValue(serviceType: string): { value: number; currency: string } {
  const currency = process.env.META_LEAD_CURRENCY?.trim() || 'IDR';
  const defaultValue = Number(process.env.META_LEAD_DEFAULT_VALUE) || 50000;

  const rawMap = process.env.META_LEAD_VALUE_MAP;
  if (rawMap) {
    try {
      const map = JSON.parse(rawMap) as Record<string, number>;
      if (typeof map[serviceType] === 'number') {
        return { value: map[serviceType], currency };
      }
    } catch (err) {
      console.error('[meta-capi] Invalid META_LEAD_VALUE_MAP, falling back to default value', err);
    }
  }

  return { value: defaultValue, currency };
}

export async function sendMetaLeadEvent(input: LeadEventInput): Promise<unknown> {
  const datasetId = process.env.META_DATASET_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!datasetId || !accessToken) {
    throw new MetaCapiError('Missing META_DATASET_ID or META_ACCESS_TOKEN environment variable');
  }

  const userData: Record<string, unknown> = {};
  if (input.email) userData.em = [sha256(normalizeEmail(input.email))];
  if (input.phone) userData.ph = [sha256(normalizePhone(input.phone))];
  if (input.firstName) userData.fn = [sha256(normalizeNameOrCity(input.firstName))];
  if (input.city) userData.ct = [sha256(normalizeNameOrCity(input.city))];
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  const { value, currency } = resolveLeadValue(input.serviceType);

  const customData: Record<string, unknown> = {
    lead_type: input.leadType,
    service_type: input.serviceType,
    value,
    currency,
  };
  if (input.location) customData.location = input.location;

  const payload = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: input.actionSource ?? 'website',
        user_data: userData,
        custom_data: customData,
      },
    ],
    ...(input.testEventCode ? { test_event_code: input.testEventCode } : {}),
  };

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${datasetId}/events?access_token=${encodeURIComponent(accessToken)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new MetaCapiError(
      `Meta CAPI request failed with status ${response.status}`,
      json,
      response.status,
    );
  }

  return json;
}
