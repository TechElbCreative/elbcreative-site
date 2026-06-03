export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://elbcreative.co',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  if (method === 'OPTIONS') return new Response(null, { headers });
  const auth = request.headers.get('Authorization');
  const password = auth ? auth.replace('Bearer ', '') : null;
  const storedPassword = await env.ELB_CONTENT.get('ADMIN_PASSWORD');
  if (!password || password !== storedPassword) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
  }
  if (method === 'GET') {
    const content = await env.ELB_CONTENT.get('content');
    const settings = await env.ELB_CONTENT.get('settings');
    return new Response(JSON.stringify({
      content: content ? JSON.parse(content) : {},
      settings: settings ? JSON.parse(settings) : {}
    }), { headers });
  }
  if (method === 'POST') {
    const body = await request.json();
    if (body.content) await env.ELB_CONTENT.put('content', JSON.stringify(body.content));
    if (body.settings) await env.ELB_CONTENT.put('settings', JSON.stringify(body.settings));
    return new Response(JSON.stringify({ success: true }), { headers });
  }
  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}
