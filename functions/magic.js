import { Magic } from '@magic-sdk/admin';

export async function onRequest(context) {
    const { request, env } = context;
    const { didToken } = await request.json();

    const magic = new Magic(env.MAGIC_SECRET_KEY);

    try {
        const { email } = await magic.users.getMetadataByToken(didToken);

        if (email) {
            if (email === env.ADMIN_EMAIL) {
                const sessionToken = crypto.randomUUID();
                await env.SESSIONS.put(sessionToken, email, { expirationTtl: 3600 });
                await env.USERS.put(email, JSON.stringify({ permissions: ['admin'] }));
                const cookie = `__session=${sessionToken}; HttpOnly; Secure; Path=/; Max-Age=3600;`;
                return new Response(JSON.stringify({ success: true, user: { permissions: ['admin'] } }), {
                    headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' },
                });
            }

            const user = await env.USERS.get(email);
            if (user) {
                const sessionToken = crypto.randomUUID();
                await env.SESSIONS.put(sessionToken, email, { expirationTtl: 3600 });
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
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
