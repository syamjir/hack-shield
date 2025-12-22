# 🛡️ Hack Shield

Hack Shield is a modern, full‑stack **security‑focused web application** built with **Next.js 15**, **React 19**, and **TypeScript**. It combines authentication, real‑time communication, password security utilities, CAPTCHA protection, and a clean, scalable UI to help protect users and data against common web threats.

---

## ✨ Features

* 🔐 **Authentication & User Management**

  * Powered by **Clerk** for secure, scalable auth

* 🧠 **Password Security**

  * Password hashing with **bcrypt**
  * JWT‑based secure token handling
  * Utilities for password generation & breach checks

* 🛡️ **Bot & Abuse Protection**

  * **Cloudflare Turnstile CAPTCHA** integration

* ⚡ **Real‑Time Communication**

  * WebSocket support using **Socket.IO**
  * Separate socket server with TypeScript build

* 📬 **Email & Notifications**

  * Email delivery via **Nodemailer**
  * Templating using **Pug**

* 💳 **Payments Integration**

  * Razorpay support for handling payments

* 🎨 **Modern UI & Animations**

  * Radix UI + Tailwind CSS
  * Framer Motion animations
  * Theme support with `next-themes`

* 🧪 **Testing Ready**

  * Jest + React Testing Library

---

## 🧱 Tech Stack

### Frontend

* Next.js 15 (App Router + Turbopack)
* React 19
* TypeScript
* Tailwind CSS
* Radix UI
* Framer Motion

### Backend

* Next.js API routes
* MongoDB + Mongoose
* Socket.IO (real‑time server)
* JWT Authentication

### Security & Utilities

* bcrypt
* Zod (schema validation)
* Cloudflare Turnstile

### Tooling

* ESLint
* Jest & ts‑jest
* TypeScript

---

## 📦 Project Structure (Simplified)

```
hack-shield/
├── app/                # Next.js app router
├── components/         # Reusable UI components
├── lib/                # Utilities (auth, db, helpers)
├── models/             # Mongoose models
├── socket-server.ts    # Socket.IO server
├── public/             # Static assets
├── styles/             # Global styles
└── tests/              # Unit & component tests
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/hack-shield.git
cd hack-shield
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env.local` file in the root directory and configure the following:

```env
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
COHERE_API_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
MONGO_URI=
BCRYPT_SALT_ROUNDS=
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN=
JWT_OTP_TOKEN_EXPIRES_IN=
GMAIL_USER=
GMAIL_APP_PASSWORD=
FAST2SMS_API_KEY=
CRYPTO_ENCRYPTION_KEY=
RAZORPAY_TEST_KEY_SECRET=
RAZORPAY_TEST_KEY_ID=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
PREMIUM_AMOUNT=

```

---

## 🧪 Running the App

### Development (Next.js only)

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm run start
```

### Run Socket Server

```bash
npm run socket
```

### Run App + Socket Together

```bash
npm run start-all
```

---

## 🧪 Testing

```bash
npm run test
```

Uses **Jest** and **React Testing Library** for unit and component tests.

---

## 🔒 Security Notes

* Passwords are hashed using **bcrypt**
* Sensitive data is stored securely using environment variables
* CAPTCHA prevents bot abuse
* JWT tokens are signed and verified securely

---

## 📌 Scripts Overview

| Script      | Description                          |
| ----------- | ------------------------------------ |
| `dev`       | Start Next.js dev server (Turbopack) |
| `build`     | Production build                     |
| `start`     | Start production server              |
| `socket`    | Build & start Socket.IO server       |
| `start-all` | Run Next.js + Socket server          |
| `test`      | Run Jest tests                       |

---

## 📄 License

This project is **private** and not licensed for public distribution.

---

## 👨‍💻 Author

**Syamjir**
Full‑Stack / Security‑Focused Developer

---

> ⚠️ Hack Shield is under active development. APIs, features, and structure may evolve.
