# Poop Tracker

Poop Tracker is a web-based app for health and wellbeing that enables users to monitor and assess their digestive health. By documenting daily bowel movements including essential factors (by using the Bristol Stool Scale), frequency, and related symptoms. Users can get meaningful insights about their gastrointestinal health.

## Installation
1. Clone the repository in github [Poop Tracker](https://github.com/mharvic/poop-trackerv2).
2. Go to the project directory within the terminal to install the dependencies:

```bash
cd client
npm install
npm run build
cd ../server
npm install
```
The Express server serves static files from the client/dist folder. If the dist folder is not generated, the application will return an internal server error because the compiled frontend files will not exist.

This approach follows standard development practices where build artifacts are not stored in version control but generated locally.


## Setting up SSL
For this project, we choose to utilize OpenSSL for generating a self-signed certificate instead of implementing Let's Encrypt. Our choice was mainly based on the application being in the local development phase. Let's Encrypt offers free, automatic certificates but, it needs a live, accessible domain name for ownership verification.

3. Installing Self-signed Certificate

```bash

Cd server
Mkdir certs
cd certs
choco install openssl -y (Windows) || brew install openssl (Apple/Mac)
openssl genrsa -out private-key.pem 2048
openssl req -new -x509 -key private-key.pem -out certificate.pem -days 365
```

## Setting up HTTP headers
For this project, we configured SSL using a self-signed certificate generated with OpenSSL. Since the application is currently in the local development phase, a self-signed certificate was sufficient for testing HTTPS functionality. We found it was highly important to remember to place our private key and certificate files stored securely in a separate folder and excluded from version control using .gitignore to prevent accidental exposure. We implemented HTTPS by creating a secure server using Node’s https module and linking it with our Express application. We also used the Helmet middleware to improve security by automatically setting important HTTP headers, which includes HSTS enforcing secure connections, as well as protections against common web vulnerabilities. Configuring SSL and adding security headers helped us better understand how to protect web applications during development and prepared us for implementing stronger security practices in production environments.

## Setting up cache 
For this project, we chose to implement caching strategies directly within our Express server to improve performance while maintaining security. For static files such as JavaScript, CSS, and images from the React build, we enabled long-term caching using a one-year max-age policy. This improves loading speed, and as we disabled caching using a no-store policy, we ensured that dynamic data is always fresh and not stored by the browser. No-cache policy is also applied to our index.html so the browser checks for updates when the application changes. Overall, this approach improves performance for static content while ensuring security and updated data for dynamic routes.

## Route Design and Cache Control Implementation

For this part of the assignment, we designed routes that reflect the core functionality of our application and applied different caching strategies depending on whether the data is static, dynamic, or sensitive.

I. GET /posts
Returns all wellness logs. We set:
Cache-Control: public, max-age=300, stale-while-revalidate=60
This caches posts for 5 minutes to improve performance. Only non-sensitive data is cached.

II. GET /posts/:id
Returns a single post by ID. We set:
Cache-Control: public, max-age=300
Each post is cached for 5 minutes to reduce repeated requests. If sensitive data is added in the future, access control would be needed.

III. GET /api/user/profile
Simulates private user health data. We set:
Cache-Control: no-store
This prevents the browser from saving any sensitive information.

IV. Static JavaScript and CSS
JS and CSS files are cached for 24 hours since they don’t change often.

V. Static Images
Images (png, jpg, svg, jpeg) are cached for 30 days to improve loading speed.


## Deployment

After installing dependencies and SSL certificate files, generate the production build and start the server:

```bash
cd server
node index.js
```

Once the server is running, open your browser and visit:

http://localhost:3000
OR
https://localhost:3443


If using HTTPS, you may need to accept the browser warning because the certificate is self-signed.


## Reflection 

We learned that every user needs to install their certificates once they run the project. Because we've used .gitignore to hide it and will not be push to github.

We also, learned how caching improves performance but must be applied carefully. Static assets benefit from long-term caching because they rarely change, while dynamic and sensitive routes require stricter policies.

The main trade-off we considered was balancing speed and security. While longer cache durations reduce server requests and improve load time, they can risk serving outdated data. For sensitive routes like user profile data, we prioritized privacy and disabled caching completely using no-store. Overall, our caching strategy improves application performance without compromising user security.

The hardest part of this project was understanding how the production build works with Express. When the project was cloned, the website did not load properly because the `dist` folder was missing. At first, this was confusing, but we learned that the `dist` folder is not pushed to GitHub because it is in `.gitignore`. We realized we needed to run `npm run build` inside the client folder to generate it before starting the server.

Implementing caching correctly was also challenging. We had to decide which routes could be cached and which ones should not be cached. For example, posts could be cached for a short time, but sensitive user profile data needed `no-store` so it would not be saved in the browser. Testing the Cache-Control headers in Chrome DevTools helped us confirm everything was working correctly.

Overall, this project helped us better understand how the frontend build, backend server, HTTPS, and caching all work together in a real application.
