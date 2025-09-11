/*
this cloudflare worker handles the google sign-in callback.
it verifies the google id token and checks if the user is authorized.
*/

export async function onRequest(context) {
  const { request, env } = context;
  const { token } = await request.json();

  // verify the token with google
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
  const data = await response.json();

  if (data.email) {
    // check if the user is the admin
    if (data.email === env.ADMIN_EMAIL) {
      const sessionToken = crypto.randomUUID();
      await env.SESSIONS.put(sessionToken, data.email, { expirationTtl: 3600 });
      await env.USERS.put(data.email, JSON.stringify({ permissions: ['admin'] }));
      const cookie = `__session=${sessionToken}; HttpOnly; Secure; Path=/; Max-Age=3600;`;
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' },
      });
    }

    // check if the user is in the database
    const user = await env.USERS.get(data.email);
    if (user) {
      const sessionToken = crypto.randomUUID();
      await env.SESSIONS.put(sessionToken, data.email, { expirationTtl: 3600 });
      const cookie = `__session=${sessionToken}; HttpOnly; Secure; Path=/; Max-Age=3600;`;
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ success: false }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}