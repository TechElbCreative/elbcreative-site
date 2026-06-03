export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code', { status: 400 });
  }

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code: code
    })
  });

  const data = await response.json();
  const token = data.access_token;

  const script = `
    <script>
      (function() {
        window.opener.postMessage(
          'authorization:github:success:' + JSON.stringify({token: '${token}', provider: 'github'}),
          'https://elbcreative.co'
        );
        window.close();
      })();
    <\/script>
  `;

  return new Response(`<!DOCTYPE html><html><body>${script}</body></html>`, {
    headers: { 'Content-Type': 'text/html' }
  });
}
