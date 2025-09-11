export async function onRequest(context) {
  const { request, env } = context;
  const cookie = request.headers.get('cookie');
  if (!cookie) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  const sessionToken = cookie.split('__session=')[1].split(';')[0];
  if (!sessionToken) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  const email = await env.SESSIONS.get(sessionToken);
  if (!email) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 });
  }

  const userData = await env.USERS.get(email);
  if (!userData) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 401 });
  }

  const { permissions } = JSON.parse(userData);
  return new Response(JSON.stringify({ permissions }), {
    headers: { 'Content-Type': 'application/json' },
  });
}