const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const helmet = require('helmet');

const path = require('path');
const app = express();
const PORT_HTTP = 3000;
const PORT_HTTPS = 3443;

// Use Helmet (includes HSTS automatically)
app.use(
  helmet({
    hsts: {
      maxAge: 31536000,      // 1 year
      includeSubDomains: true,
      preload: true
    }
  })
);

// Routes
app.get('/', (req, res) => {
    res.send('Hello from HTTP!');
});

app.get('/secure', (req, res) => {
    res.send('Test!'); // TESTING
});

// Create HTTP server
http.createServer(app).listen(PORT_HTTP, () => {
    console.log(`HTTP Server running at http://localhost:${PORT_HTTP}`);
});

const options = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'private-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'certificate.pem')),
};

// Create HTTPS server
https.createServer(options, app).listen(PORT_HTTPS, () => {
    console.log(`HTTPS Server running at https://localhost:${PORT_HTTPS}`);
});