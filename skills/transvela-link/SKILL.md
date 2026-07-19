---
name: transvela-link
description: Use when the user wants to create a password-protected Transvela short link (加密链接/密码保护短链接), or to resolve/decrypt one they already own. Encryption and decryption run locally via Node — the password and the original URL never leave the user's machine, only ciphertext is sent to transvela.ffutop.com.
---

# Transvela Link

Transvela wraps any URL into a short link that requires a password to unlock. The
security model depends on the password and plaintext URL being encrypted **before**
they ever touch the network — only the AES-GCM ciphertext is uploaded. This skill
reproduces that client-side crypto (see `shared/crypto.js` in the main project) in a
small Node script so an agent can drive the same flow without a browser or a
long-running MCP server.

Requires Node.js 18+ (uses `node:crypto`'s WebCrypto implementation and global
`fetch`). No `npm install` needed — both scripts are dependency-free.

## Creating a link

```
node scripts/create.mjs <url> <password> [hint]
```

- `<url>`: the link to protect.
- `<password>`: the password required to unlock it later. **Ask the user for this
  directly — never invent one, and never guess it from context.** If the user hasn't
  given a password, ask before running the script.
- `[hint]`: optional password hint shown on the unlock page.

On success it prints the resulting short URL, e.g. `https://transvela.ffutop.com/AbC123xy`.

## Resolving a link

```
node scripts/open.mjs <short_code_or_url> <password>
```

Fetches the ciphertext for that code, decrypts it locally with the given password,
and prints the original URL. If the password is wrong it prints the hint (if any)
and exits non-zero — never retries with guessed passwords.

`<short_code_or_url>` accepts either the bare short code or a full
`https://transvela.ffutop.com/<code>` URL.

## Rules

- Never send the plaintext password or the plaintext URL to any network endpoint.
  Only the JSON ciphertext envelope (`{v, salt, iv, ct}`) leaves the machine.
- Never log, cache, or persist the password anywhere outside the current process.
- Don't fabricate a password on the user's behalf — always ask.
