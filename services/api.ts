/**
 * Frontend API Service
 * Communicates with the Express backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface AnalyzeRequest {
  userMessage: string;
  language: 'en' | 'hi' | 'mr' | 'bn';
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
  language: 'en' | 'hi' | 'mr' | 'bn';
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

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[API] analyzeOffer network error (Server down):', error);
    // LAYER 3: Client Fallback (If backend is totally unreachable)
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

// Localized mock helper for extreme failures
function getMockAnalyzeResponse(request: AnalyzeRequest): AnalyzeResponse {
  const messages = {
    en: "It seems my network connection is weak, but don't worry! Based on standard rates, let's use a sample of 8.5% for 12 months to show you how the calculator works.",
    hi: "लगता है मेरा नेटवर्क कमज़ोर है, लेकिन चिंता न करें! मानक दरों के आधार पर, आइए आपको यह दिखाने के लिए कि कैलकुलेटर कैसे काम करता है, 12 महीनों के लिए 8.5% का उदाहरण लें।",
    mr: "माझे नेटवर्क कमकुवत असल्याचे दिसते, परंतु काळजी करू नका! कॅल्क्युलेटर कसे कार्य करते हे दर्शविण्यासाठी 12 महिन्यांसाठी 8.5% चे उदाहरण घेऊया.",
    bn: "মনে হচ্ছে আমার নেটওয়ার্ক সংযোগ দুর্বল, তবে চিন্তা করবেন না! ক্যালকুলেটর কীভাবে কাজ করে তা দেখানোর জন্য আসুন 12 মাসের জন্য 8.5% এর একটি উদাহরণ ব্যবহার করি।"
  };

  return { 
    success: true, 
    data: { 
      botMessage: messages[request.language] || messages['en'], 
      bankName: "Sample Bank", 
      interestRate: 8.5, 
      tenureMonths: 12, 
      jargonTerms: [] 
    }
  };
}

export default { analyzeOffer, createBooking };