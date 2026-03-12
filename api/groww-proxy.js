const ALLOWED_HOST = 'https://groww.in/';

function isAllowedTarget(url) {
  return typeof url === 'string' && url.startsWith(ALLOWED_HOST);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const isGet = req.method === 'GET';
  const targetUrl = isGet ? req.query.url : req.body?.url;
  const method = (isGet ? req.query.method : req.body?.method || 'GET')
    .toUpperCase();
  const data = isGet ? undefined : req.body?.data;

  if (!isAllowedTarget(targetUrl)) {
    res.status(400).json({
      error: 'Invalid or blocked target URL',
    });
    return;
  }

  if (!['GET', 'POST'].includes(method)) {
    res.status(405).json({
      error: 'Only GET and POST are supported',
    });
    return;
  }

  try {
    const upstream = await fetch(targetUrl, {
      method,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: method === 'POST' ? JSON.stringify(data || {}) : undefined,
    });

    const text = await upstream.text();
    const contentType =
      upstream.headers.get('content-type') || 'application/json; charset=utf-8';

    res.status(upstream.status);
    res.setHeader('Content-Type', contentType);
    res.send(text);
  } catch (error) {
    res.status(502).json({
      error: 'Upstream request failed',
      details: error?.message || 'Unknown error',
    });
  }
}
