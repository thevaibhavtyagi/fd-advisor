```markdown
# 🏦 FD Advisor - AI-Powered Fixed Deposit Assistant

Your trusted, intelligent guide to Fixed Deposits.

Live Demo: https://fd-advisor.vercel.app
(Note: The Express backend is hosted on Render. We utilize a cron-job to prevent cold starts, ensuring instant AI responses).

## 📖 Overview

FD Advisor is a multilingual, AI-powered Fintech lead-generation funnel built for the modern Indian user. It transforms complex banking jargon and raw Fixed Deposit (FD) offers into simple, actionable insights.

Instead of filling out long forms, users can simply paste an FD offer they received via SMS or WhatsApp (e.g., "SBI 7.5% p.a. 12 months"). The embedded Google Gemini 2.5 Flash AI parses the text, calculates the maturity returns, explains difficult financial terms in the user's preferred language, and smoothly guides them through a secure KYC lead-capture form.

## ✨ Core Features

* **🧠 Advanced AI Parsing (Gemini 2.5 Flash):** Extracts exact financial data (Bank Name, Interest Rate, Tenure) from natural language using strict JSON-schema system prompts.
* **🌍 Seamless Multilingual Support:** Chat, read explanations, and view UI elements in English (EN), Hindi (HI), and Marathi (MR) using react-i18next.
* **🔍 Dynamic Jargon Highlighting:** The AI automatically identifies complex financial terms (like p.a., Tenure). The frontend uses an advanced case-insensitive regex engine to highlight these terms dynamically, making them clickable to open a "Jargon Drawer" with simple definitions.
* **🧮 Interactive Profit Calculator:** Real-time maturity calculator utilizing a compound interest algorithm, complete with fluid visual sliders.
* **🛡️ Secure Lead Generation:** In-chat KYC form capturing the user's Full Name and PAN. Includes strict frontend Regex validation (e.g., ABCDE1234F) and backend Mongoose schema validation before saving to the database.
* **💾 Persistent State:** Chat history and user preferences are saved locally using zustand/middleware/persist so users never lose their conversational context.
* **🎨 Premium UI/UX:** Built with Tailwind CSS and Framer Motion for buttery-smooth animations, bouncy chat bubbles, and a highly responsive, mobile-first aesthetic.

## 🛠️ Tech Stack

### Frontend (Deployed on Vercel)

* **Framework:** Next.js (React)
* **Styling:** Tailwind CSS
* **State Management:** Zustand (with LocalStorage persistence)
* **Animations:** Framer Motion & Canvas-Confetti
* **Localization:** React-i18next

### Backend (Deployed on Render)

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **AI Engine:** @google/generative-ai (Gemini 2.5 Flash API)
* **Security & Utils:** cors (Strict Origin Policy), dotenv

## 🏗️ Architecture & Engineering Highlights

* **Strict JSON Prompt Engineering:** Gemini 2.5 Flash is constrained via system instructions to only return a highly specific JSON schema. The backend automatically sanitizes markdown code blocks before parsing to prevent crash loops.
* **The "Anti-Sleep" Cron Architecture:** To combat serverless free-tier inactivity cycles, an external Cron Job (cron-job.org) pings the server's /health endpoint every 14 minutes. This ensures the Express server never spins down, providing zero-latency AI responses to the end user.
* **Robust CORS & Security:** The Express backend is locked down to strictly allow API requests only from the deployed Vercel domain and the local development environment, rejecting unauthorized payload attempts.

## 🚀 Local Development Setup

Want to run this project locally? Follow these steps:

### 1. Prerequisites

* Node.js (v18+)
* MongoDB Atlas Account (or local MongoDB)
* Google Gemini API Key

### 2. Clone the Repository

```bash
git clone [https://github.com/thevaibhavtyagi/fd-advisor.git](https://github.com/thevaibhavtyagi/fd-advisor.git)
cd fd-advisor
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend server:

```bash
npm start
```

You should see `[MongoDB] Connected successfully` and `[Server] Running on port 5000`.

### 4. Frontend Setup

Open a new terminal and stay in the root `fd-advisor` folder:

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

Open `http://localhost:3000` in your browser.

## 📱 Screenshots & Demo

(Add your Blostem Hackathon demo video link here!)

Demo Video: [Link to YouTube/Loom Video]

## 👤 Author

Developed with ❤️ by Vaibhav Tyagi for the Blostem Hackathon.

Portfolio: vaibhavtyagi.me

GitHub: @thevaibhavtyagi
```