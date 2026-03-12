import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const ALLOWED_HOST = 'https://groww.in/';

function isAllowedTarget(url) {
  return typeof url === 'string' && url.startsWith(ALLOWED_HOST);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

const localGrowwProxy = {
  name: 'local-groww-proxy',
  configureServer(server) {
    server.middlewares.use('/api/groww-proxy', async (req, res) => {
      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
      }

      try {
        const url = new URL(req.url || '', 'http://localhost');
        const isGet = req.method === 'GET';
        const body = isGet ? {} : await readJsonBody(req);
        const targetUrl = isGet ? url.searchParams.get('url') : body?.url;
        const method = (
          isGet ? url.searchParams.get('method') : body?.method || 'GET'
        ).toUpperCase();
        const data = body?.data;

        if (!isAllowedTarget(targetUrl)) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: 'Invalid or blocked target URL' }));
          return;
        }

        if (!['GET', 'POST'].includes(method)) {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: 'Only GET and POST are supported' }));
          return;
        }

        const upstream = await fetch(targetUrl, {
          method,
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: method === 'POST' ? JSON.stringify(data || {}) : undefined,
        });

        const text = await upstream.text();
        res.statusCode = upstream.status;
        res.setHeader(
          'Content-Type',
          upstream.headers.get('content-type') ||
            'application/json; charset=utf-8'
        );
        res.end(text);
      } catch (error) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(
          JSON.stringify({
            error: 'Local proxy failed',
            details: error?.message || 'Unknown error',
          })
        );
      }
    });
  },
};

export default defineConfig({
  plugins: [react(), localGrowwProxy],
  base: '/',
});
