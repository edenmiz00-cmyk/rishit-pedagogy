const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyN-7BCTsdl6ZLlWzczxhJ4-eZXj-yAYO3LujM1NyUBpDzUxF29DtG0OthJXRTM6ORA/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const cls = req.query.class || 'יא';
      const url = `${SCRIPT_URL}?class=${encodeURIComponent(cls)}`;
      const response = await fetch(url, { redirect: 'follow' });
      const text = await response.text();
      // Parse — might be JSONP or plain JSON
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        const match = text.match(/\((\{.*\})\)/s);
        json = match ? JSON.parse(match[1]) : { status: 'error', data: [] };
      }
      return res.status(200).json(json);

    } else if (req.method === 'POST') {
      const body = JSON.stringify(req.body);
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body,
        redirect: 'follow'
      });
      const text = await response.text();
      let json;
      try { json = JSON.parse(text); } catch { json = { status: 'ok' }; }
      return res.status(200).json(json);
    }

  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
