/*
this cloudflare worker provides user data based on a valid session token.
*/

export async function onRequest(context) {
  const { request, env } = context;
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (token) {
    const email = await env.SESSIONS.get(token);
    if (email) {
      // in a real application, you would fetch user data from a database
      // for now, we'll just return the email and a static set of permissions
      return new Response(JSON.stringify({ email, permissions: ['admin'] }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
