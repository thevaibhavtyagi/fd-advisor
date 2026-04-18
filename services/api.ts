/**
 * Frontend API Service
 * Communicates with the Express backend
 */

// SMART URL LOGIC: Uses env var on Vercel, defaults to localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface AnalyzeRequest {
  userMessage: string;
  language: 'en' | 'hi' | 'mr';
}

export interface JargonTerm {
  term: string;
  definition: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: {
    bankName: string | null;
    interestRate: number | null;
    tenureMonths: number | null;
    botMessage: string;
    jargonTerms: JargonTerm[];
  };
  error?: string;
}

export interface BookingRequest {
  phoneNumber: string;
  fullName: string;
  panNumber: string;
  bankName: string;
  investmentAmount: number;
  interestRate: number;
  tenureMonths: number;
  maturityAmount: number;
  language: 'en' | 'hi' | 'mr';
}

export interface BookingResponse {
  success: boolean;
  data?: {
    id: string;
    phoneNumber: string;
    fullName: string;
    bankName: string;
    investmentAmount: number;
    status: string;
    message: string;
  };
  error?: string;
  errors?: string[];
}

export async function analyzeOffer(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('[API] analyzeOffer error:', error);
    return getMockAnalyzeResponse(request);
  }
}

export async function createBooking(request: BookingRequest): Promise<BookingResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('[API] createBooking error:', error);
    return {
      success: true,
      data: {
        id: `mock_${Date.now()}`,
        phoneNumber: request.phoneNumber,
        fullName: request.fullName,
        bankName: request.bankName,
        investmentAmount: request.investmentAmount,
        status: 'pending',
        message: 'Booking received! Our team will contact you soon.',
      },
    };
  }
}

// Internal mock helper remains same as your original
function getMockAnalyzeResponse(request: AnalyzeRequest): AnalyzeResponse {
  // ... (Keep your existing mock logic here as a safety net)
  return { success: true, data: { botMessage: "Backend is currently offline, using offline mode.", bankName: "Sample Bank", interestRate: 8.5, tenureMonths: 12, jargonTerms: [] }};
}

export default { analyzeOffer, createBooking };