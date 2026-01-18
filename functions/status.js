export async function onRequest(context) {
    const url = new URL(context.request.url).searchParams.get('url');
    if (!url) {
        return new Response('Missing url param', { status: 400 });
    }

    try {
        // Try HEAD first to save bandwidth
        let response = await fetch(url, { 
            method: 'HEAD', 
            redirect: 'follow',
            headers: { 'User-Agent': 'StatusCheck/1.0' }
        });

        // If HEAD fails with 405 (Method Not Allowed), try GET
        if (response.status === 405) {
             response = await fetch(url, { 
                method: 'GET', 
                redirect: 'follow',
                 headers: { 'User-Agent': 'StatusCheck/1.0' }
            });
        }

        const success = response.status >= 200 && response.status < 500; // 500 is error, 4xx is client error but server is "up"

        return new Response(JSON.stringify({ live: success, status: response.status }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ live: false, error: error.message }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
