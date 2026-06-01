export async function onRequest(context) {
  const clientId = context.env.GITHUB_CLIENT_ID;
  const origin = new URL(context.request.url).origin;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/callback`,
    scope: 'repo,user',
    state: crypto.randomUUID()
  });
  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
    302
  );
}
