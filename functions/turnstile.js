export async function onRequest(context) {
  const { env } = context;
  const envKeys = Object.keys(env);

  const data = {
    success: false,
    error: 'DEBUG_MODE',
    'error-codes': [`Available env keys: ${envKeys.join(', ')}`],
  };

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}