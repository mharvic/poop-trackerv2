# Poop Tracker

Poop Tracker is a web-based app for health and wellbeing that enables users to monitor and assess their digestive health. By documenting daily bowel movements including essential factors (by using the Bristol Stool Scale), frequency, and related symptoms. Users can get meaningful insights about their gastrointestinal health.

## Installation
1. Clone the repository in github [Poop Tracker](https://github.com/mharvic/poop-trackerv2).
2. Go to the project directory within the terminal to install the dependencies:

```bash
1. cd server
2. npm install
3. cd ..
4. cd client
5. npm install
```

## Deployment

```bash
6. Open a terminal type npm run dev.
7. Open another terminal type cd client then npm run dev.
```

# Poop Tracker

Poop Tracker is a web-based app for health and wellbeing that enables users to monitor and assess their digestive health. By documenting daily bowel movements including essential factors (by using the Bristol Stool Scale), frequency, and related symptoms. Users can get meaningful insights about their gastrointestinal health.

## Installation
1. Clone the repository in github [Poop Tracker](https://github.com/mharvic/poop-trackerv2).
2. Go to the project directory within the terminal to install the dependencies:

```bash
I. cd server
II. npm install
III. cd ..
IV. cd client
V. npm install
```

## Deployment

```bash
VI. Open a terminal type npm run dev.
VIII. Open another terminal type cd client then type npm run dev.
```

## Setting up SSL
For this project, we choose to utilize OpenSSL for generating a self-signed certificate instead of implementing Let's Encrypt. Our choice was mainly based on the application being in the local development phase. Let's Encrypt offers free, automatic certificates but, it needs a live, accessible domain name for ownership verification.

3. Installing Self-signed Certificate

```bash

VIII. Cd server
IX. Mkdir certs
X. cd certs
XI. choco install openssl -y (Windows) || brew install openssl (Apple/Mac)
XII. openssl genrsa -out private-key.pem 2048
XIII. openssl req -new -x509 -key private-key.pem -out certificate.pem -days 365
```

## Setting up HTTP headers
For this project, we configured SSL using a self-signed certificate generated with OpenSSL. Since the application is currently in the local development phase, a self-signed certificate was sufficient for testing HTTPS functionality. We found it was highly important to remember to place our private key and certificate files stored securely in a separate folder and excluded from version control using .gitignore to prevent accidental exposure. We implemented HTTPS by creating a secure server using Node’s https module and linking it with our Express application. We also used the Helmet middleware to improve security by automatically setting important HTTP headers, which includes HSTS enforcing secure connections, as well as protections against common web vulnerabilities. Configuring SSL and adding security headers helped us better understand how to protect web applications during development and prepared us for implementing stronger security practices in production environments.

## Setting up cache 
For this project, we chose to implement caching strategies directly within our Express server to improve performance while maintaining security. For static files such as JavaScript, CSS, and images from the React build, we enabled long-term caching using a one-year max-age policy. This improves loading speed, and as we disabled caching using a no-store policy, we ensured that dynamic data is always fresh and not stored by the browser. No-cache policy is also applied to our index.html so the browser checks for updates when the application changes. Overall, this approach improves performance for static content while ensuring security and updated data for dynamic routes.
