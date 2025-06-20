/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {
    const { method } = request; 
    const url = new URL(request.url);
    console.log("method", method);
    if (method === 'POST' && url.pathname === '/') {
      const { url: longUrl } = await request.json();
      console.log("longUrl", longUrl);
      const slug = Math.random().toString(36).slice(2, 8);
      console.log("slug", slug)
      await env.jimmy.put(slug, longUrl);
      return new Response(JSON.stringify({ short: `${url.origin}/${slug}` }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'GET' && url.pathname !== '/') {
      const slug = url.pathname.slice(1);
      console.log("slug", slug)
      const longUrl = await env.jimmy.get(slug);
      console.log("longUrl", longUrl)
      if (longUrl) return Response.redirect(longUrl, 302);
      return new Response('Not found', { status: 404 });
    }

    return new Response('Short URL Worker is running');
  }
}
