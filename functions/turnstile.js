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

    if (!env.CLOUDFLARE_SITE_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'CLOUDFLARE_SITE_KEY environment variable not set' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      });
    }

    const formData = new FormData();
    formData.append('secret', env.CLOUDFLARE_SITE_KEY);
    formData.append('response', token);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'An unexpected error occurred.', details: e.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}