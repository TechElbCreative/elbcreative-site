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
  const provider = 'github';

  return new Response(`<!DOCTYPE html>
<html>
<body>
<script>
(function() {
  var data = {
    token: "${token}",
    provider: "${provider}"
  };
  var message = "authorization:" + data.provider + ":success:" + JSON.stringify(data);
  function sendMessage() {
    if (window.opener) {
      window.opener.postMessage(message, document.location.origin);
      window.opener.postMessage(message, 'https://elbcreative.co');
      setTimeout(function() { window.close(); }, 1000);
    }
  }
  if (document.readyState === 'complete') {
    sendMessage();
  } else {
    window.addEventListener('load', sendMessage);
  }
})();
<\/script>
<p>Authenticating... you can close this window.</p>
</body>
</html>`, {
    headers: { 'Content-Type': 'text/html' }
  });
}
