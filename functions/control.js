/*
this cloudflare worker protects the control.html page.
it checks for a valid session token before allowing access.
*/

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // allow access to the control page itself
  if (url.pathname === '/control.html') {
    return next();
  }

  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (token) {
    const email = await env.SESSIONS.get(token);
    if (email) {
      // token is valid, allow access
      return next();
    }
  }

  // if no token or invalid token, redirect to login
  return Response.redirect(new URL('/prism.html', request.url), 302);
}
