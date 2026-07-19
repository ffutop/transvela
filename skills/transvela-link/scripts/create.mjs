#!/usr/bin/env node
// Encrypts a URL locally (AES-GCM via PBKDF2-derived key) and uploads only the
// ciphertext to Transvela. Mirrors shared/crypto.js's envelope format exactly.
import { webcrypto } from 'node:crypto';

const API_ORIGIN = 'https://transvela.ffutop.com';
const PBKDF2_ITERATIONS = 150000;

const [, , url, password, hint] = process.argv;
if (!url || !password) {
  console.error('Usage: node create.mjs <url> <password> [hint]');
  process.exit(1);
}

function bytesToBase64(bytes) {
  return Buffer.from(bytes).toString('base64');
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
    ['encrypt']
  );
}

async function encryptToEnvelope(password, plaintext) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const ctBuf = await webcrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  return JSON.stringify({
    v: 1,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ct: bytesToBase64(new Uint8Array(ctBuf))
  });
}

const ciphertext = await encryptToEnvelope(password, url);

const res = await fetch(`${API_ORIGIN}/api/create`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ciphertext, hint: hint || undefined })
});

if (!res.ok) {
  const body = await res.text().catch(() => '');
  console.error(`Request failed: ${res.status} ${body}`);
  process.exit(1);
}

const data = await res.json();
console.log(`${API_ORIGIN}/${data.short_code}`);
