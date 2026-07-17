const CODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CODE_LENGTH = 8;
const MAX_CIPHERTEXT_LEN = 20000;
const MAX_HINT_LEN = 300;
const MAX_INSERT_ATTEMPTS = 5;

function generateShortCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return code;
}

function isValidEnvelope(ciphertext) {
  if (typeof ciphertext !== 'string' || ciphertext.length === 0 || ciphertext.length > MAX_CIPHERTEXT_LEN) {
    return false;
  }
  try {
    const parsed = JSON.parse(ciphertext);
    return (
      parsed &&
      parsed.v === 1 &&
      typeof parsed.salt === 'string' &&
      typeof parsed.iv === 'string' &&
      typeof parsed.ct === 'string'
    );
  } catch {
    return false;
  }
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'invalid_body' }, 400);
  }

  const { ciphertext, hint } = body || {};

  if (!isValidEnvelope(ciphertext)) {
    return jsonResponse({ error: 'invalid_ciphertext' }, 400);
  }
  if (hint != null && (typeof hint !== 'string' || hint.length > MAX_HINT_LEN)) {
    return jsonResponse({ error: 'invalid_hint' }, 400);
  }

  const createdAt = Date.now();

  for (let attempt = 0; attempt < MAX_INSERT_ATTEMPTS; attempt++) {
    const shortCode = generateShortCode();
    try {
      await env.DB.prepare(
        'INSERT INTO links (short_code, ciphertext, hint, created_at) VALUES (?, ?, ?, ?)'
      )
        .bind(shortCode, ciphertext, hint || null, createdAt)
        .run();
      return jsonResponse({ short_code: shortCode }, 200);
    } catch (err) {
      // Most likely a short_code primary-key collision; retry with a fresh code.
      if (attempt === MAX_INSERT_ATTEMPTS - 1) {
        return jsonResponse({ error: 'server_error' }, 500);
      }
    }
  }
}
