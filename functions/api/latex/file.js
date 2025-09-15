export async function onRequest(context) {
  if (context.request.method === 'GET') {
    const mockContent = `\documentclass{article}
\begin{document}
This is a mock file. The backend is not yet implemented.
\end{document}`;
    return new Response(mockContent);
  }

  if (context.request.method === 'POST') {
    return new Response('Backend not implemented yet.', { status: 501 });
  }

  return new Response('Method not allowed', { status: 405 });
}
