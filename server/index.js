"use strict";

const path = require("path");
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const helmet = require("helmet");

const app = express();

// Ports
const PORT_HTTP = 3000;
const PORT_HTTPS = 3443;

// Helmet
app.use(
  helmet({
    hsts: {
      maxAge: 31536000,      // 1 year
      includeSubDomains: true,
      preload: true,
    },
  })
);

// Middleware
app.use(express.json());

// React Build Path
const distPath = path.join(__dirname, "..", "client", "dist");

// Serve React static files
app.use(express.static(distPath));

// api 
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from the server!",
    timestamp: new Date().toISOString(),
  });
});

//from old server.js
app.get('/', (req, res) => {
    res.send('Hello from HTTP!');
});

app.get('/secure', (req, res) => {
    res.send('Test!'); // TESTING
});

//React router 
app.get("/*splat", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});
 
// Error 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start HTTP server
http.createServer(app).listen(PORT_HTTP, () => {
  console.log(`HTTP Server running at http://localhost:${PORT_HTTP}`);
});

// Start HTTPS server
try {
  const httpsOptions = {
    key: fs.readFileSync(
      path.join(__dirname, "certs", "private-key.pem")
    ),
    cert: fs.readFileSync(
      path.join(__dirname, "certs", "certificate.pem")
    ),
  };

  https.createServer(httpsOptions, app).listen(PORT_HTTPS, () => {
    console.log(
      `HTTPS Server running at https://localhost:${PORT_HTTPS}`
    );
  });
} catch (error) {
  console.error(
    "Failed to start HTTPS server. Check your SSL certificate paths!",
    error.message
  );
}