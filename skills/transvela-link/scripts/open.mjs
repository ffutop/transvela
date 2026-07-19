#!/usr/bin/env node
// Fetches a Transvela link's ciphertext and decrypts it locally. The password
// never leaves this process.
import { webcrypto } from 'node:crypto';

const API_ORIGIN = 'https://transvela.ffutop.com';
const PBKDF2_ITERATIONS = 150000;

const [, , codeOrUrl, password] = process.argv;
if (!codeOrUrl || !password) {
  console.error('Usage: node open.mjs <short_code_or_url> <password>');
  process.exit(1);
}

const code = codeOrUrl.includes('/') ? codeOrUrl.split('/').filter(Boolean).pop() : codeOrUrl;

function base64ToBytes(b64) {
  return new Uint8Array(Buffer.from(b64, 'base64'));
}

async function deriveKey(password, salt) {
  const baseKey = await webcrypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return webcrypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
}

const res = await fetch(`${API_ORIGIN}/api/link/${encodeURIComponent(code)}`);
if (!res.ok) {
  console.error(`Link not found (${res.status})`);
  process.exit(1);
}

const { ciphertext, hint } = await res.json();
const envelope = JSON.parse(ciphertext);
if (envelope.v !== 1) {
  console.error('Unsupported envelope version');
  process.exit(1);
}

try {
  const salt = base64ToBytes(envelope.salt);
  const iv = base64ToBytes(envelope.iv);
  const ct = base64ToBytes(envelope.ct);
  const key = await deriveKey(password, salt);
  const ptBuf = await webcrypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  console.log(new TextDecoder().decode(ptBuf));
} catch {
  console.error(hint ? `Wrong password. Hint: ${hint}` : 'Wrong password.');
  process.exit(1);
}
