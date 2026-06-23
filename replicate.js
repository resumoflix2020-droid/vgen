export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = req.headers['authorization']?.replace('Bearer ', '');
  if (!apiKey) return res.status(401).json({ error: 'API key obrigatória' });

  try {
    const { path = '', body } = req.body || {};
    const endpoint = `https://api.replicate.com/v1/${path}`;

    const upstream = await fetch(endpoint, {
      method: req.method === 'GET' ? 'GET' : 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      ...(req.method !== 'GET' && body ? { body: JSON.stringify(body) } : {})
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
