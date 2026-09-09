import type { VercelRequest, VercelResponse } from '@vercel/node';

// Langkah 2 GitHub OAuth untuk Decap CMS (/admin). GitHub redirect balik ke
// sini dengan ?code=...&state=.... Kita tukar code -> access token, lalu
// balas HTML kecil yang menjalankan protokol postMessage yang Decap
// harapkan dari OAuth provider eksternal:
//
//   1. Popup ini kirim "authorizing:github" ke window pembuka (Decap core).
//   2. Decap core ECHO string yang SAMA balik ke popup -- itu tandanya siap.
//   3. Baru popup kirim payload sukses/gagal yang sebenarnya.
//
// (Bukan sebaliknya -- popup TIDAK menunggu handshake duluan dari core.)

function parseCookie(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined;
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function renderResult(status: 'success' | 'error', payload: { token?: string; message?: string }): string {
  const message = status === 'success'
    ? `authorization:github:success:${JSON.stringify({ token: payload.token, provider: 'github' })}`
    : `authorization:github:error:${JSON.stringify({ message: payload.message })}`;

  return `<!DOCTYPE html><html><body>
<script>
(function () {
  function receiveMessage(e) {
    window.removeEventListener("message", receiveMessage, false);
    window.opener.postMessage(${JSON.stringify(message)}, e.origin);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body></html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'text/html');
  // State cookie cuma dipakai sekali -- bersihkan begitu callback ini jalan.
  res.setHeader('Set-Cookie', 'decap_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');

  const { code, state, error } = req.query as Record<string, string | undefined>;
  const cookieState = parseCookie(req.headers.cookie, 'decap_oauth_state');

  if (error) {
    return res.status(200).send(renderResult('error', { message: `GitHub OAuth error: ${error}` }));
  }

  if (!code || !state || state !== cookieState) {
    return res.status(200).send(renderResult('error', { message: 'Invalid or missing OAuth state (kemungkinan popup basi/kedaluwarsa, coba login ulang)' }));
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.status(200).send(renderResult('error', { message: 'Server missing GitHub OAuth credentials' }));
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });

    const json = await tokenResponse.json().catch(() => undefined);

    if (!tokenResponse.ok || !json?.access_token) {
      console.error('[decap-oauth] Token exchange failed', { status: tokenResponse.status, body: json });
      return res.status(200).send(renderResult('error', { message: 'Failed to exchange code for token' }));
    }

    return res.status(200).send(renderResult('success', { token: json.access_token }));
  } catch (err) {
    console.error('[decap-oauth] Token exchange threw', err instanceof Error ? err.message : err);
    return res.status(200).send(renderResult('error', { message: 'Token exchange request failed' }));
  }
}
