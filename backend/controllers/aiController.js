/**
 * AI Controller - Gemini Integration for FD Analysis
 * Upgraded with Tri-Layer Resilience & Guaranteed Jargon Highlighting
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_INSTRUCTION = `You are an expert Fixed Deposit (FD) advisor for Indian customers. Your role is to:
1. Parse FD offers from banks (e.g., "SBI 7.5% p.a. 12 months")
2. Explain financial terms in simple, friendly language
3. Identify jargon terms that need explanation

CRITICAL JSON SCHEMA:
{
  "bankName": "Name of the bank",
  "interestRate": 7.5,
  "tenureMonths": 12,
  "botMessage": "Your friendly explanation in the user's language.",
  "jargonTerms": [
    {"term": "p.a.", "definition": "Per annum means per year. This is the yearly interest rate."},
    {"term": "tenure", "definition": "The duration for which your money stays in the FD."}
  ]
}

STRICT JARGON HIGHLIGHTING RULES (MANDATORY):
- Every single "term" in your jargonTerms array MUST appear EXACTLY as written inside the "botMessage" text. The UI relies on exact string matching.
- If you add "p.a." to jargonTerms, the word "p.a." MUST be in the botMessage.
- If you add "maturity" to jargonTerms, the word "maturity" MUST be in the botMessage.
- For Hindi/Marathi/Bengali, keep the core banking terms (like 'p.a.', 'tenure', 'maturity', 'FD') in English so they match the jargon array perfectly, mixing them naturally with the native script.
- If no valid FD offer is found, set bankName to null and explain politely without generating an offer.
- Interest rate must be a number (e.g., 7.5). tenureMonths must be a number (e.g., 12).`;

const LANGUAGE_PROMPTS = {
  en: 'Respond in simple English that anyone can understand.',
  hi: 'Respond in Hindi (हिंदी) using Devanagari script, but keep terms like "p.a." and "tenure" in English.',
  mr: 'Respond in Marathi (मराठी) using Devanagari script, but keep terms like "p.a." and "tenure" in English.',
  bn: 'Respond in Bengali (বাংলা) using Bengali script, but keep terms like "p.a." and "tenure" in English.',
};

// --- RESILIENCE UTILS ---

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Smart Context-Aware Regex Fallback with Guaranteed Jargon Injection
function generateFallbackResponse(text, lang) {
  const rateMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:%|percent|p\.a)/i);
  const tenureMatch = text.match(/(\d+)\s*(?:months?|M|yrs?|years?)/i);
  const bankMatch = text.match(/(SBI|Axis|HDFC|ICICI|Canara|Suryoday|PNB|BOB|[a-zA-Z]+\sBank)/i);

  // SCENARIO A: General Chat / Greeting (No financial data found)
  if (!rateMatch && !tenureMatch && !bankMatch) {
    const limitedModeMessages = {
      en: "Hello! I am currently operating in a limited offline mode. Please provide a specific bank name, interest rate, and duration (e.g., 'Axis 7% 12 months'), and I will calculate your returns instantly.",
      hi: "नमस्ते! मैं अभी सीमित ऑफ़लाइन मोड में काम कर रहा हूँ। कृपया मुझे एक बैंक का नाम, ब्याज दर और अवधि बताएं (जैसे 'Axis 7% 12 months'), और मैं तुरंत आपके मुनाफे की गणना करूंगा।",
      mr: "नमस्कार! मी सध्या मर्यादित ऑफलाइन मोडमध्ये काम करत आहे. कृपया मला बँकेचे नाव, व्याजदर आणि कालावधी द्या (उदा. 'Axis 7% 12 months'), आणि मी तुमच्या परताव्याची त्वरित गणना करेन.",
      bn: "নমস্কার! আমি বর্তমানে সীমিত অফলাইন মোডে কাজ করছি। অনুগ্রহ করে একটি নির্দিষ্ট ব্যাঙ্কের নাম, সুদের হার এবং সময়কাল দিন (যেমন 'Axis 7% 12 months'), এবং আমি সাথে সাথে আপনার উপার্জনের হিসাব করব।"
    };

    return {
      bankName: null,
      interestRate: null,
      tenureMonths: null,
      botMessage: limitedModeMessages[lang] || limitedModeMessages['en'],
      jargonTerms: []
    };
  }

  // SCENARIO B: FD Offer Detected (Process the fallback calculator)
  const interestRate = rateMatch ? parseFloat(rateMatch[1]) : 7.0;
  let tenureMonths = tenureMatch ? parseInt(tenureMatch[1]) : 12;
  
  if (text.match(/(\d+)\s*(?:yrs?|years?)/i)) {
      tenureMonths = tenureMonths * 12;
  }

  const bankName = bankMatch ? bankMatch[1] : "Your Bank";

  // By explicitly injecting the words "p.a." and "tenure" into these messages, 
  // we guarantee the frontend highlight engine will find and highlight them.
  const fallbackMessages = {
    en: `I found your offer! ${bankName} is offering an interest rate of ${interestRate}% p.a. for a tenure of ${tenureMonths} months. Let me show you what that means for your earnings.`,
    hi: `मुझे आपका ऑफर मिल गया! ${bankName} ${tenureMonths} महीनों की tenure के लिए ${interestRate}% p.a. की पेशकश कर रहा है। आइए देखें कि इससे आपकी कमाई कितनी होगी।`,
    mr: `मला तुमची ऑफर सापडली! ${bankName} ${tenureMonths} महिन्यांच्या tenure साठी ${interestRate}% p.a. देत आहे. तुमच्या कमाईसाठी याचा अर्थ काय ते पाहूया.`,
    bn: `আমি আপনার অফার পেয়েছি! ${bankName} ${tenureMonths} মাসের tenure এর জন্য ${interestRate}% p.a. অফার করছে। আসুন দেখি এটি আপনার উপার্জনের জন্য কী বোঝায়।`
  };

  const fallbackJargon = {
    en: [
      { term: "p.a.", definition: "Per annum means per year. The interest calculated over a year." },
      { term: "tenure", definition: "The duration for which your money stays in the Fixed Deposit." }
    ],
    hi: [
      { term: "p.a.", definition: "p.a. का मतलब है 'प्रति वर्ष' या हर साल। यह एक साल में मिलने वाला ब्याज है।" },
      { term: "tenure", definition: "Tenure (अवधि) का मतलब है कि आपका पैसा कितने समय के लिए एफडी में जमा रहेगा।" }
    ],
    mr: [
      { term: "p.a.", definition: "p.a. म्हणजे 'प्रति वर्ष'. एका वर्षात मिळणारे हे व्याज आहे." },
      { term: "tenure", definition: "Tenure (कालावधी) म्हणजे तुमचे पैसे किती काळासाठी एफडीमध्ये राहतील." }
    ],
    bn: [
      { term: "p.a.", definition: "p.a. মানে 'প্রতি বছর' বা বার্ষিক। এটি এক বছরে প্রাপ্ত সুদ।" },
      { term: "tenure", definition: "Tenure (মেয়াদ) মানে আপনার টাকা কত সময়ের জন্য এফডিতে থাকবে।" }
    ]
  };

  return {
    bankName,
    interestRate,
    tenureMonths,
    botMessage: fallbackMessages[lang] || fallbackMessages['en'],
    jargonTerms: fallbackJargon[lang] || fallbackJargon['en']
  };
}

// --- MAIN CONTROLLER ---

export async function analyzeOffer(req, res) {
  try {
    const { userMessage, language = 'en' } = req.body;

    if (!userMessage) {
      return res.status(400).json({ success: false, error: 'userMessage is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[CRITICAL] GEMINI_API_KEY missing!');
      throw new Error("Missing API Key");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const prompt = `
User's language preference: ${language} (${LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS.en})
User's message: "${userMessage}"
Analyze this message and extract any FD offer details. Respond ONLY with the JSON object.`;

    // LAYER 1: Exponential Backoff Retry (Max 3 attempts: 0s, 1.5s, 3s)
    let responseText = null;
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        break; 
      } catch (geminiError) {
        attempt++;
        console.warn(`[AI Controller] Gemini attempt ${attempt} failed:`, geminiError.message);
        if (attempt >= maxAttempts) {
          console.error('[AI Controller] All Gemini retries exhausted.');
          throw geminiError; 
        }
        await delay(attempt * 1500); 
      }
    }

    let parsed;
    try {
      const jsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('[AI Controller] Failed to parse AI JSON:', responseText);
      throw new Error("JSON Parse Error");
    }

    return res.json({
      success: true,
      data: {
        bankName: parsed.bankName || null,
        interestRate: parsed.interestRate ? Number(parsed.interestRate) : null,
        tenureMonths: parsed.tenureMonths ? Number(parsed.tenureMonths) : null,
        botMessage: parsed.botMessage || 'I found your FD offer!',
        jargonTerms: Array.isArray(parsed.jargonTerms) ? parsed.jargonTerms : [],
      },
    });

  } catch (error) {
    // LAYER 2: Deterministic Mocking (The Safety Net)
    console.error('[AI Controller] Invoking Context-Aware Rescue Fallback.');
    
    const { userMessage, language = 'en' } = req.body;
    const fallbackData = generateFallbackResponse(userMessage, language);

    return res.json({
      success: true,
      data: fallbackData
    });
  }
}

export default { analyzeOffer };