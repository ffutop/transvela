function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestGet({ params, env }) {
  const code = params.code;
  if (!/^[a-zA-Z0-9]{4,32}$/.test(code)) {
    return jsonResponse({ error: 'not_found' }, 404);
  }

  const row = await env.DB.prepare('SELECT ciphertext, hint FROM links WHERE short_code = ?')
    .bind(code)
    .first();

  if (!row) {
    return jsonResponse({ error: 'not_found' }, 404);
  }

  return jsonResponse({ ciphertext: row.ciphertext, hint: row.hint }, 200);
}
