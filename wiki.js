const https = require('https');

const query = 'https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=engine%20oil%20filetype:video&srnamespace=6&format=json';

https.get(query, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Results:', json.query.search.map(s => s.title));
    } catch (e) {
      console.error('Parse error:', e.message, data.slice(0, 100));
    }
  });
}).on('error', err => console.error('Req error:', err.message));
