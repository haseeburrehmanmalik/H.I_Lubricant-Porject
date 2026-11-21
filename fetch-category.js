const https = require('https');

const url = 'https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Videos_of_motor_oil&cmlimit=20&format=json';

const req = https.get(url, {
  headers: {
    'User-Agent': 'HILubricantApp/1.0 (malikimranali42@yahoo.com)'
  }
}, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('Category members:', data.query ? data.query.categorymembers : body);
    } catch (e) {
      console.log('Error:', e, body.slice(0, 200));
    }
  });
});

req.on('error', e => console.error('Request error:', e.message));
