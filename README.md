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
node server.js
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

# Phase 2 Implementing Authentication and Authorization Mechanisms

## Setting up the respository 

As the project entered phase 2, we implemented more security and to run the server there are some dependencies needed to be installed. 

1. Clone the repository in github [Poop Tracker](https://github.com/mharvic/poop-trackerv2).
2. Go to the project directory within the terminal to install the dependencies:

```bash

cd client
npm install argon2 jsonwebtoken passport passport-google-oauth20 express-rate-limit

```

3. Create .env file
5. Once the .env file is completed, open the terminal enter:

```bash

npm start

```

6. You should see:

```bash

HTTP running at http://localhost:3000
MongoDB connected

```

For troubleshooting: 

If npm not found -> Install Node.js on https://nodejs.org/

If "Cannot find module" -> 

```bash

npm install

```
If server will not start -> 
  a) Make sure .env file exists
  b) Check MongoDB connection string
  c) Ensure port 3000 is not in use

## Authentication Mechanisms

We chose a hybrid approach for our authentication system, which incorporated Google Single Sign-On (SSO) and local authentication using Argon2 encrypting and a dual JWT token architecture. To achieve a perfect balance between a seamless user experience and robust backend security. Having spent years creating websites, we witness firsthand the ease with which users become frustrated by complicated password prerequisites or resetting passwords, which typically results in a loss of interest. By offering Google SSO, this barrier is eliminated, allowing immediate access. Nevertheless, to guarantee that the application remains accessible to users who prefer not to link third-party accounts, a secure local logon option is provided. The dual-method approach effectively achieves the expectation that modern web applications should be instantly accessible on the frontend and vault-like behind the scenes. 

## Role-Based Access Control

By specifically adding a user role into the JWT payload, we established strict Role-Based Access Control (RBAC) for our access control system. This enables us to generate two separate, clean landing pages (/dashboard and /admin-dashboard) that are secured through frontend redirect logic.

To enforce these roles securely on the backend, middleware was implemented to validate user authorization before granting access to protected routes. For example, an authorize middleware function was used to check whether the authenticated user’s role matched the required role for a route. If the role matched, the request proceeded; otherwise, a 403 “Access Denied” response was returned. This middleware works alongside JWT verification, where the decoded token attaches the user’s role to req.user. As a result, routes such as /admin-dashboard were protected so that only users with the Admin role could access them.

```bash

const isMatch = await argon2.verify(user.password, password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

```

The incorporation of this system with Google SSO was the primary challenge. Initially, our script confused fresh URL tokens by interpreting obsolete local tokens, which led to infinite routing cycles. We resolved this issue by changing the logic to prioritize the collection and handling of URL parameters.

In the end, although the Google consent screen introduced a minor inconvenience, it proved to be a worthwhile trade-off. It maintained strict access control while providing users with a highly secure and seamless login experience for future visits, effectively balancing security and usability.

User roles: 
Admin-
username: leon
password: leon123

Regular user- 
username: max1 
password: max321


## Phase 3: Implementing Security Best Practices for User Profile Dashboard

## User Dashboard

We created a secure dashboard where users can:

- View profile (username, email, bio)  
- Update profile information  

Data is fetched from /api/auth/me using JWT authentication.


## Profile Update Feature

Users can update:

- Username  
- Email  
- Bio  

Admin Can update:
- Username
- Email

The data is sent to /api/auth/update where validation, sanitization, and encryption are applied before saving.


## Input Validation and Sanitization

We used express-validator:

- Username: 3–50 characters  
- Email: valid format  
- Bio: max 500 characters  

Sanitization used:

.trim().escape()

Example input:

<script>alert("hack")</script>

Becomes:

&lt;script&gt;alert("hack")&lt;/script&gt;

## Reflection Checkpoint

Improper input validation leaves an application highly vulnerable to exploits like Cross-Site Scripting (XSS) and SQL Injection. For example, without proper validation, an attacker can easily insert malicious scripts using characters like < and >. We can significantly lower this risk through strict input sanitization. Furthermore, output encoding prevents XSS by converting these dangerous characters into safe text formats before they are displayed on the screen, ensuring the browser doesn't mistake them for executable code. A major problem we encountered with our AES-256-CBC implementation was dealing with strict cryptographic parameters, specifically the secret key length. Node's crypto module requires the encryption key to be exactly 32 bytes (256 bits). Early on, simple misconfigurations in our .env file and just use random text with the mix of random letters, number and characters and caused fatal server crashes due to 'invalid key length' errors. We resolved this by generating a standardized 32-character secure key and ensuring our environment variables were strictly managed across our development environment.


## XSS Protection

We implemented two layers of protection:

Backend:
- Sanitization using .escape()

Frontend:
- Safe rendering using textContent instead of innerHTML



## XSS Testing

We tested using:

<script>alert("hack")</script>

Result:
- No popup appeared  
- Script displayed as text  
- Application remained secure  

## Dependency Management and Security Automation

To ensure our application remains secure and up to date, we implemented dependency management using `npm audit` and automated security checks with GitHub Actions.

### npm audit

We used the following command to scan for vulnerabilities in third-party libraries:

```bash
npm audit
```

This allowed us to detect high and critical vulnerabilities in our dependencies. To resolve these issues, we ran `npm audit fix` and updated vulnerable packages to more secure versions. After applying the fixes, the vulnerabilities were resolved and the application became more secure.

## GitHub Actions Workflow

We created a GitHub Actions workflow called "Security Check" that runs automatically on every push and pull request. The workflow performs the following steps:

- Checkout code
Uses actions/checkout@v4 to access the repository files.

- Install dependencies
```bash
npm install
```
to install all required project packages.

Run security audit
```bash
npm audit --audit-level=high
```

This step checks for vulnerabilities and fails the workflow if any high or critical issues are found.

Workflow Behavior

Initially, the workflow failed because high-severity vulnerabilities were detected in the dependencies. This was indicated by a red in GitHub Actions.

After running npm audit fix and updating the dependencies, the vulnerabilities were resolved. As a result, the workflow now passes successfully.

This demonstrates how automated security checks can detect and help fix issues early in development.

## Why Dependency Management Matters

Using outdated third-party libraries is risky because they may contain known security vulnerabilities such as:

Cross-Site Scripting (XSS)
Injection attacks
Data exposure risks

Automation with GitHub Actions helps by:

- Continuously scanning for vulnerabilities
- Preventing insecure code from going unnoticed
- Maintaining long-term application security

## Reflection

In this phase, we focused on improving the security of our application by working on the user dashboard, input validation, encoding, encryption, and dependency management.

One of the main challenges was implementing proper input validation. It was not always clear how strict the rules should be, especially for fields like the bio. We solved this by setting clear limits (like max length and allowed characters) and using validation tools to make sure only safe input is accepted.

Another important learning point was understanding how output encoding prevents XSS attacks. At first, we thought sanitizing input was enough, but we learned that encoding output is also necessary. By making sure user data is displayed safely, we prevented scripts from running in the browser.

We also learned the importance of keeping dependencies updated. When we ran `npm audit`, we found vulnerabilities in our project. After fixing them, our GitHub Actions security check passed. This showed us how automated tools can help maintain security over time.

The most challenging vulnerabilities to address were related to XSS and dependency issues. It required careful testing using malicious inputs such as `<script>alert("hack")</script>` to confirm that our protections were working correctly. Testing in the browser and using developer tools helped us verify that scripts were not executed and that the application handled the input safely.

Overall, this phase helped us understand how different security practices work together to protect a web application.


