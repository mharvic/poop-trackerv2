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

// Security Middleware
app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

app.use(express.json());

// React build folder
const distPath = path.join(__dirname, "..", "client", "dist");

// Serve static files
app.use(
  express.static(distPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".js") || filePath.endsWith(".css")) {
        res.setHeader("Cache-Control", "public, max-age=86400");
      }

      if (
        filePath.endsWith(".png") ||
        filePath.endsWith(".jpg") ||
        filePath.endsWith(".svg") ||
        filePath.endsWith(".jpeg")
      ) {
        res.setHeader("Cache-Control", "public, max-age=2592000");
      }
    },
  })
);

// API route
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from the server!",
    timestamp: new Date().toISOString(),
  });
});

// Sample in-memory posts
const posts = [
  { id: 1, title: "Morning Log", content: "Felt good today." },
  { id: 2, title: "Evening Log", content: "Tracked wellness stats." }
];

// GET /posts — cache for 5 minutes + stale-while-revalidate
app.get("/posts", (req, res) => {
  res.set(
    "Cache-Control",
    "public, max-age=300, stale-while-revalidate=60"
  );

  res.json(posts);
});

// GET /posts/
app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.set("Cache-Control", "public, max-age=300");

  res.json(post);
});

// Sensitive route — no cache
app.get("/api/user/profile", (req, res) => {
  res.set("Cache-Control", "no-store");

  res.json({
    username: "sample",
    notes: "Sensitive wellness data"
  });
});

// React fallback 
app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start HTTP
http.createServer(app).listen(PORT_HTTP, () => {
  console.log(`HTTP Server running at http://localhost:${PORT_HTTP}`);
});

// Start HTTPS 
const certPath = path.join(__dirname, "certs");

if (
  fs.existsSync(path.join(certPath, "private-key.pem")) &&
  fs.existsSync(path.join(certPath, "certificate.pem"))
) {
  const httpsOptions = {
    key: fs.readFileSync(path.join(certPath, "private-key.pem")),
    cert: fs.readFileSync(path.join(certPath, "certificate.pem")),
  };

  https.createServer(httpsOptions, app).listen(PORT_HTTPS, () => {
    console.log(
      `HTTPS Server running at https://localhost:${PORT_HTTPS}`
    );
  });
} else {
  console.log("HTTPS certificates not found. Running HTTP only.");
}