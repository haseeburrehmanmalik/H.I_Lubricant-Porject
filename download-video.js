const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Target directory
const publicDir = path.join(__dirname, 'client', 'public', 'assets', 'videos');
const imagesDir = path.join(__dirname, 'client', 'public', 'assets', 'images');
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(imagesDir, { recursive: true });

const targetVideoPath = path.join(publicDir, 'hi-lubricant-hero.mp4');
const targetPosterPath = path.join(imagesDir, 'hero-poster.jpg');

// Free direct automotive engine oil pouring & workshop videos from verified high-speed CDNs
// 1. Pexels free video CDN (engine oil pouring / automotive service)
// 2. High-quality golden fluid / motor oil streaming
const candidates = [
  'https://assets.mixkit.co/videos/preview/mixkit-car-mechanic-pouring-oil-into-an-engine-43093-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-mechanic-pouring-oil-into-the-engine-of-a-car-43094-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-pouring-motor-oil-into-a-car-engine-43095-large.mp4',
  'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd270d9e65d781644f4b67b00508b1&profile_id=164&oauth2_token_id=57447761',
  'https://cdn.pixabay.com/video/2021/04/12/70868-536412792_tiny.mp4'
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const request = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        return resolve(downloadFile(res.headers.location, dest));
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with HTTP status ${res.statusCode}`));
      }

      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(true);
      });

      fileStream.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    });

    request.on('error', (err) => reject(err));
    request.setTimeout(15000, () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

async function run() {
  console.log('Downloading cinematic automotive lubricant hero video...');
  let downloaded = false;

  for (const url of candidates) {
    try {
      console.log(`Trying candidate: ${url}`);
      await downloadFile(url, targetVideoPath);
      const stat = fs.statSync(targetVideoPath);
      if (stat.size > 50000) {
        console.log(`Successfully downloaded authentic hero video! File size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
        downloaded = true;
        break;
      }
    } catch (err) {
      console.log(`Candidate failed: ${err.message}`);
    }
  }

  // Also download a high-res poster image for fallback
  console.log('Downloading high-res engine oil poster image...');
  const posterUrl = 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1920&q=85';
  try {
    await downloadFile(posterUrl, targetPosterPath);
    console.log('Poster image downloaded successfully!');
  } catch (err) {
    console.log('Poster download error:', err.message);
  }

  console.log('Finished assets preparation.');
}

run();
