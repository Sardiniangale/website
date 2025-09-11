export async function onRequest(context) {
  return new Response(JSON.stringify({ success: true, message: "Hello from the turnstile function!" }), {
    headers: { 'Content-Type': 'application/json' },
  });
}