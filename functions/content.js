export async function onRequest(context) {
  const { env } = context;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache'
  };
  const content = await env.ELB_CONTENT.get('content');
  const settings = await env.ELB_CONTENT.get('settings');
  return new Response(JSON.stringify({
    content: content ? JSON.parse(content) : null,
    settings: settings ? JSON.parse(settings) : null
  }), { headers });
}
