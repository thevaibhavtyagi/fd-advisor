# 🏦 FD Advisor
**An AI-Powered Fixed Deposit Assistant for the Modern Indian User.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-0D9488?style=for-the-badge&logo=vercel)](https://fd-advisor.vercel.app)
[![Demo Video](https://img.shields.io/badge/Watch-Demo_Video-FF0000?style=for-the-badge&logo=youtube)](https://drive.google.com/file/d/1UfHlUAnBtbJ_9pCQyf_2IbOYck2Vzw4Q/view?usp=sharing)
[![Tech Stack](https://img.shields.io/badge/Stack-MERN_|_Next.js_|_Gemini-20232A?style=for-the-badge)](#%EF%B8%8F-tech-stack)

> **📱 The Real-World Scenario:** > A user in Gorakhpur receives a WhatsApp message: *"Suryoday Small Finance Bank — 8.50% p.a. — 12M tenor."* They want to save money, but the financial jargon and English-only banking apps are intimidating. They don't know what to do next.

---

## 🛑 The Problem
Financial inclusion in India is growing, but financial *literacy* lags behind. When regional users receive lucrative Fixed Deposit (FD) offers, they often drop off because:
1. The terminology (p.a., tenor, maturity) is confusing.
2. Calculating the actual return requires complex math.
3. Traditional banking apps force them through tedious, English-heavy web forms.

## 💡 The Solution
**FD Advisor** is a multilingual, conversational financial companion designed to make banking frictionless. Instead of filling out forms, the app allows users to simply paste the raw SMS they received. The AI instantly breaks down the offer, explains it in their native language, and guides the user smoothly through the next steps.

**How we solve it:**
* **Language Barriers** ➔ Native chat support in English, Hindi, Marathi, and Bengali.
* **Confusing Jargon** ➔ Dynamic, clickable terms that reveal simple explanations.
* **Complex Math** ➔ An interactive calculator to visualize returns instantly.
* **High Drop-off Rates** ➔ A conversational flow that guides the user through initial KYC.

### 🔄 The User Flow
**Paste Offer ➔ Understand Jargon ➔ Calculate Returns ➔ Convert (KYC)**

*Ultimately, this bridges the financial literacy gap for millions of regional Indians. By simplifying complex terms and capturing intent conversationally, it empowers users to make confident investment decisions.*

---

## 📸 Product Gallery

<p align="center">
  <img src="./assets/start.png" height="400px" alt="Landing Page" />
  <br>
  <em>Fig 1: Starting page of web app</em>
</p>

<p align="center">
  <img src="./assets/homepage.png" height="400px" alt="Welcome Screen" />
  <br>
  <em>Fig 2: Multilingual Onboarding (EN/HI/MR/BN)</em>
</p>

<p align="center">
  <img src="./assets/welcome.png" height="400px" alt="Start Chat" />
  <br>
  <em>Fig 3: --</em>
</p>

<p align="center">
  <img src="./assets/chat.png" height="400px" alt="Calculator Interface" />
  <br>
  <em>Fig 4: Interactive Profit & Maturity Calculator</em>
</p>

<p align="center">
  <img src="./assets/confirm.png" height="400px" alt="Booking Confirmation" />
  <br>
  <em>Fig 5: Secure KYC & Lead Capture Form</em>
</p>
*(Note: The "booking" step in this MVP demonstrates a seamless KYC and intent-capture flow to guide the user toward conversion, rather than executing a live financial transaction).*

---

## ✨ Core Features

* 🌍 **Vernacular First:** Built from the ground up for India. Users can chat, read explanations, and navigate the UI in their preferred language, powered by `react-i18next`.
* 🔍 **Contextual Jargon Buster:** The app automatically flags complex financial terms. A custom regex engine highlights these terms dynamically, making them clickable to reveal simple, bottom-sheet definitions.
* 🧮 **Interactive Maturity Calculator:** A fluid compound interest engine complete with visual sliders so users can explore their potential returns without leaving the chat.
* 🛡️ **Guided Lead Capture:** An in-chat KYC form that captures the user's Full Name and PAN, utilizing strict frontend regex validation (e.g., `ABCDE1234F`) before securely saving to the database.
* 💾 **Local Persistence:** Chat history and language preferences are stored locally via `zustand`, ensuring users never lose their conversational context if they accidentally refresh.
* 🛡️ **Fault-Tolerant Offline Mode:** Hackathon demos often crash due to free-tier API rate limits. If the AI service drops, the app seamlessly switches to a context-aware Regex fallback engine, ensuring the user still gets a localized response, jargon highlights, and access to the calculator without ever seeing an error screen.
---

## 🛠️ Tech Stack

| Frontend | Backend | AI & Deployment |
| :--- | :--- | :--- |
| **Next.js** (React) | **Node.js** | **Gemini 2.5 Flash** API |
| **Tailwind CSS** | **Express.js** | **Vercel** (Frontend) |
| **Zustand** (State Persistence) | **MongoDB Atlas** | **Render** (Backend) |
| **Framer Motion** | **Mongoose** ODM | **cron-job.org** (Anti-sleep) |
| **React-i18next** | **CORS & Dotenv** | |

---

## 🏗️ Architecture & Engineering Highlights

* **Intelligent NLP Parsing:** Google's Gemini 2.5 Flash API handles the heavy lifting of extracting exact financial data (Bank Name, Rate, Tenure) from messy natural language. 
* **Tri-Layer Resilience & Fallback:** To guarantee 100% uptime during API outages (503/429 errors), the backend implements an exponential backoff retry loop. If the LLM completely fails, a custom deterministic regex parser takes over. It intercepts the raw text, extracts the banking metrics, and injects predefined, exact-match jargon terms into localized offline templates, keeping the frontend UI perfectly synchronized.
* **Strict JSON Sanitization:** The AI is constrained via system prompts to return a highly specific JSON schema. To prevent crash loops, the backend middleware automatically strips markdown formatting from the AI's response before parsing the payload.
* **Zero-Latency Keep-Alive:** To combat serverless free-tier inactivity cycles, an external ping hits the server's `/health` endpoint every 14 minutes. This prevents cold starts on Render, guaranteeing instant AI responses for end users and evaluators without delay.
* **Robust CORS Policy:** The backend is locked down to explicitly accept API requests *only* from the deployed Vercel production domain and the local dev environment, rejecting unauthorized cross-origin attempts.

---

## 🚀 Local Development

### 1. Clone & Install
```bash
git clone [https://github.com/thevaibhavtyagi/fd-advisor.git](https://github.com/thevaibhavtyagi/fd-advisor.git)
cd fd-advisor
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
```
Start the server:
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal in the root `fd-advisor` directory:
```bash
npm install
```
Create a `.env.local` file in the root folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Start the development server:
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

---

## 👤 Author

Designed and engineered by **Vaibhav Tyagi** for the Blostem Hackathon.

* **Portfolio:** [vaibhavtyagi.me](https://vaibhavtyagi.me)
* **GitHub:** [@thevaibhavtyagi](https://github.com/thevaibhavtyagi)
```
