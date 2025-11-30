import { GoogleGenAI, Type } from "@google/genai";
import { Clip, AnalysisResult } from '../types';

export const analyzeVideo = async (base64Video: string, mimeType: string): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze this video content thoroughly. 
    Identify 3 to 6 distinct video clips that are between 15 seconds and 60 seconds long. 
    These clips should be suitable for short-form viral content like TikTok, Instagram Reels, or YouTube Shorts.
    
    Focus on moments that are:
    1. Funny or entertaining
    2. Educational or insightful
    3. Emotionally resonant
    4. High energy or visually striking

    For each clip, provide:
    - Accurate start and end timestamps (format HH:MM:SS).
    - A catchy title.
    - A brief description of what happens.
    - A virality score from 1 to 10 (10 being extremely viral potential).
    - Reasoning why this clip was chosen.
    
    Also provide a very brief overall summary of the full video.
  `;

  // We use gemini-2.5-flash for its speed and multimodal capabilities
  const modelId = "gemini-2.5-flash";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Video
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        systemInstruction: "You are an expert video editor and social media strategist. You understand the pacing and content style of successful TikToks and Reels.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallSummary: {
              type: Type.STRING,
              description: "A 1-2 sentence summary of the entire video context."
            },
            clips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  startTime: { type: Type.STRING, description: "Start time in HH:MM:SS format" },
                  endTime: { type: Type.STRING, description: "End time in HH:MM:SS format" },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  viralityScore: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING }
                },
                required: ["startTime", "endTime", "title", "description", "viralityScore", "reasoning"]
              }
            }
          },
          required: ["overallSummary", "clips"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    const data = JSON.parse(text) as AnalysisResult;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
