"use strict";

const path = require("path");
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const hsts = require("hsts");

const app = express();

// Define Ports
const PORT_HTTP = 3000;
const PORT_HTTPS = 3443;

app.use(hsts({
    maxAge: 31536000,        // 1 year in seconds
    includeSubDomains: true, // Apply to all subdomains
    preload: true            // Include in HSTS preload lists
}));

// --- React & API Routes --- //

const distPath = path.join(__dirname, "..", "client", "dist");

app.use(express.static(distPath));

app.use(express.json());

app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from the server!", timestamp: new Date().toISOString() });
});

app.get("/*splat", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

// --- Server Startup --- //

// Start standard HTTP Server
http.createServer(app).listen(PORT_HTTP, () => {
    console.log(`HTTP Server running at http://localhost:${PORT_HTTP}`);
});

// Start secure HTTPS Server
try {
    const httpsOptions = {
        key: fs.readFileSync(path.join(__dirname, "private-key.pem")), 
        cert: fs.readFileSync(path.join(__dirname, "certificate.pem"))
    };

    https.createServer(httpsOptions, app).listen(PORT_HTTPS, () => {
        console.log(`HTTPS Server running at https://localhost:${PORT_HTTPS}`);
    });
} catch (error) {
    console.error("Failed to start HTTPS server. Check your SSL certificate paths!", error.message);
}
