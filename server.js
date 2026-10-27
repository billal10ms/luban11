import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip/deflate compression for all text/html/css/js responses
app.use(compression());

// Serve static assets with 7-day browser caching and etags
const staticOptions = { index: false, maxAge: '7d', etag: true };
app.use(express.static(path.join(__dirname, 'public'), staticOptions));
app.use(express.static(__dirname, staticOptions));

// Pre-read and cache index.html in memory once at startup
const indexPath = path.join(__dirname, 'index.html');
let cachedHtml = '';
if (fs.existsSync(indexPath)) {
  cachedHtml = fs.readFileSync(indexPath, 'utf-8');
  if (process.env.VITE_GA_ID) {
    cachedHtml = cachedHtml.replace(/%VITE_GA_ID%/g, process.env.VITE_GA_ID);
  }
}

// Catch-all route: return 404 for missing static assets with extensions, serve cached HTML for app routes
app.get('*', (req, res) => {
  // If request URL has a file extension (e.g. .png, .jpg, .css, .js), it is a missing asset
  if (path.extname(req.path)) {
    return res.status(404).type('text').send('Not Found');
  }

  if (cachedHtml) {
    res.type('html').send(cachedHtml);
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});
