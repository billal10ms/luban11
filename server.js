import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname, { index: false }));

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf-8');
    if (process.env.VITE_GA_ID) {
      html = html.replace(/%VITE_GA_ID%/g, process.env.VITE_GA_ID);
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});
