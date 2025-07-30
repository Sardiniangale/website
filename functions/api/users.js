/*
this cloudflare worker handles user management.
*/

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // only admins can access this endpoint
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const adminEmail = await env.SESSIONS.get(token);
  if (adminEmail !== env.ADMIN_EMAIL) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (request.method === 'GET') {
    const { keys } = await env.USERS.list();
    return new Response(JSON.stringify(keys), { headers: { 'Content-Type': 'application/json' } });
  }

  if (request.method === 'POST') {
    const { email, permissions } = await request.json();
    await env.USERS.put(email, JSON.stringify({ permissions }));
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  if (request.method === 'DELETE') {
    const { email } = await request.json();
    await env.USERS.delete(email);
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response('Method not allowed', { status: 405 });
}
