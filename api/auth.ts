import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'node:crypto';

// Langkah 1 GitHub OAuth (Authorization Code flow) untuk Decap CMS (/admin).
// Popup Decap membuka endpoint ini, di sini kita redirect ke halaman izin
// GitHub sambil taruh `state` acak di cookie -- api/callback.ts nanti
// mencocokkan `state` yang GitHub kembalikan dengan cookie ini, supaya
// permintaan akses tidak bisa dipalsukan pihak lain (proteksi CSRF).
const SITE_URL = 'https://sanomatrassehat.com';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return res.status(500).send('Missing GITHUB_OAUTH_CLIENT_ID environment variable');
  }

  const state = crypto.randomBytes(16).toString('hex');

  res.setHeader(
    'Set-Cookie',
    `decap_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  );

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', `${SITE_URL}/api/callback`);
  authorizeUrl.searchParams.set('scope', 'repo');
  authorizeUrl.searchParams.set('state', state);

  res.writeHead(302, { Location: authorizeUrl.toString() });
  res.end();
}
