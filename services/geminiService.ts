import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export const initializeGemini = () => {
  if (!aiClient && process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
};

export const generateAIResponse = async (
  prompt: string,
  context: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Please configure your environment.";
  }

  if (!aiClient) {
    initializeGemini();
  }

  if (!aiClient) {
    return "Failed to initialize AI client.";
  }

  try {
    const systemInstruction = `
      You are Dadu, a helpful and intelligent AI assistant for a Student Information System.
      Your goal is to assist students, instructors, and administrators.
      
      Context provided about the current user and system state:
      ${context}

      Keep answers concise, professional, and helpful. 
      If asked about specific data not in context, explain you only have access to the provided context.
      Format your response in Markdown.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};
