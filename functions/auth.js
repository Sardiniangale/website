/*
this cloudflare worker handles the google sign-in callback.
it verifies the google id token and checks if the user is the admin.
*/

export async function onRequest(context) {
  const { request, env } = context;
  const { token } = await request.json();

  // verify the token with google
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
  const data = await response.json();

  // check if the token is valid and the email matches the admin email
  if (data.email && data.email === env.ADMIN_EMAIL) {
    // generate a secure, short-lived token
    const sessionToken = crypto.randomUUID();
    // store the token in cloudflare kv
    await env.SESSIONS.put(sessionToken, data.email, { expirationTtl: 3600 }); // 1 hour

    return new Response(JSON.stringify({ success: true, token: sessionToken }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ success: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
