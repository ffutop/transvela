export async function onRequestGet({ request, params, env }) {
  const code = params.code;
  if (!/^[a-zA-Z0-9]{4,32}$/.test(code)) {
    return env.ASSETS.fetch(request);
  }

  // Cloudflare Pages' clean-URL rewriting 308-redirects requests that end in
  // ".html", so fetch the extensionless path to get the file served directly.
  const verifyUrl = new URL('/verify', request.url);
  return env.ASSETS.fetch(new Request(verifyUrl, request));
}
