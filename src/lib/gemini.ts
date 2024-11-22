import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyAQRMfchYO_3s-rnE_m0CvWPIUu1MAcYqE');

export async function chat(message: string, context: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `
    You are a helpful customer service chatbot for the following business:
    ${context}
    
    Please respond to the following customer message in a professional and helpful manner:
    ${message}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}