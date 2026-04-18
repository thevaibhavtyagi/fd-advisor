/**
 * AI Controller - Gemini Integration for FD Analysis
 * Production Version - Strict Environment Variable Loading
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// 1. Force environment variables to load FIRST
dotenv.config();

const SYSTEM_INSTRUCTION = `You are an expert Fixed Deposit (FD) advisor for Indian customers. Your role is to:
1. Parse FD offers from banks (e.g., "SBI 7.5% p.a. 12 months")
2. Explain financial terms in simple, friendly language
3. Identify jargon terms that need explanation

CRITICAL: You MUST respond ONLY with valid JSON in this exact schema:
{
  "bankName": "Name of the bank",
  "interestRate": 7.5,
  "tenureMonths": 12,
  "botMessage": "Your friendly explanation in the user's language",
  "jargonTerms": [
    {"term": "p.a.", "definition": "Per annum means per year. This is the yearly interest rate."},
    {"term": "tenor", "definition": "The duration for which your money stays in the FD."}
  ]
}

Rules:
- botMessage should be warm, conversational, and in the user's preferred language
- For Hindi/Marathi, use Devanagari script naturally mixed with English banking terms
- Always explain what the customer will earn in simple terms
- Identify 2-4 jargon terms maximum from the offer
- If no valid FD offer is found, set bankName to null and explain politely
- Interest rate should be a number (e.g., 7.5, not "7.5%")
- tenureMonths should be in months (e.g., 12 for 1 year, 24 for 2 years)`;

const LANGUAGE_PROMPTS = {
  en: 'Respond in simple English that anyone can understand.',
  hi: 'Respond in Hindi (हिंदी) using Devanagari script. Mix English for banking terms like FD, interest, etc.',
  mr: 'Respond in Marathi (मराठी) using Devanagari script. Mix English for banking terms like FD, interest, etc.',
};

export async function analyzeOffer(req, res) {
  try {
    const { userMessage, language = 'en' } = req.body;

    if (!userMessage) {
      return res.status(400).json({ success: false, error: 'userMessage is required' });
    }

    // 2. Initialize Gemini dynamically so it always catches the .env key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[CRITICAL] GEMINI_API_KEY is missing from .env file!');
      return res.status(500).json({ success: false, error: 'Backend AI Configuration Missing.' });
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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let parsed;
    try {
      const jsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('[AI] Failed to parse JSON:', responseText);
      return res.status(500).json({ success: false, error: 'Failed to parse AI response' });
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
    console.error('[AI Controller] Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to analyze offer via Gemini.' });
  }
}

export default { analyzeOffer };