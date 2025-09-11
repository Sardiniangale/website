export async function onRequest(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response(JSON.stringify({ success: false, 'error-codes': ['missing-input-response'] }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      });
    }

    // IMPORTANT: Ensure TURNSTILE_SECRET_KEY is set in your Cloudflare project
    if (!env.TURNSTILE_SECRET_KEY) {
      return new Response(JSON.stringify({ success: false, 'error-codes': ['missing-secret-key-config'] }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      });
    }

    const formData = new FormData();
    formData.append('secret', env.TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    // The remote IP address is an optional parameter.
    // formData.append('remoteip', request.headers.get('CF-Connecting-IP'));

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e) {
    return new Response(JSON.stringify({ success: false, 'error-codes': ['function-crash'], details: e.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
