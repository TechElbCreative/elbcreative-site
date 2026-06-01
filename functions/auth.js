export async function onRequest(context) {
  const { GITHUB_CLIENT_ID } = context.env;
  const origin = new URL(context.request.url).origin;
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: `${origin}/callback`,
    scope: 'repo,user',
    state: crypto.randomUUID()
  });
  return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
}
