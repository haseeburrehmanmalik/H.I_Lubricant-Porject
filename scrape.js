const https = require('https');
const options = {
  hostname: 'www.pexels.com',
  path: '/search/videos/engine%20oil/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  }
};
https.get(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const videoFiles = data.match(/https:\/\/[^\"']+\.(mp4|webm)/gi) || [];
    console.log('Found video links:', videoFiles.slice(0, 5));
    const ids = data.match(/\/video\/[^\"']+-(\d+)\//g) || data.match(/\/video\/(\d+)\//g) || [];
    console.log('Found video IDs:', ids.slice(0, 5));
  });
}).on('error', err => console.error(err));
