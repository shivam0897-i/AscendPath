import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;

const MODEL_NAME = 'gemini-2.5-flash';
const GENERATION_CONFIG = {
  temperature: 0.4,
  topK: 0,
  topP: 0.85,
  maxOutputTokens: 2048,
};

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const SYSTEM_INSTRUCTION = `You are AscendPath Assistant — a warm, supportive, and knowledgeable AI designed to help users, especially working professionals and students, navigate their educational journey.

Only mention the creator if directly asked. If a user asks "Who created you?" or "Who developed this assistant?", respond with:
"I was created by Shivam, the developer behind AscendPath, to support and empower learners like you!"

Core Responsibilities:
- Help users create personalized learning roadmaps using AscendPath.
- Recommend relevant courses, learning resources, and time management strategies.
- Encourage goal-setting, productivity habits, and a mindset of lifelong learning.
- Offer motivational support to build user confidence.
- Guide users in using key features of the AscendPath platform.

Website Navigation Support:
When users mention their goals, skills, or interests:
- Direct them to the Personalized Roadmap Tool:
  "Start building your personalized roadmap by visiting the [Onboarding Tool](https://ascendpath.xyz/onboarding)!"
- Guide them to Learning Resources:
  "Explore relevant learning resources and materials in our [Resources Page](https://ascendpath.xyz/resources)!"
- Help them manage their learning journey in the Dashboard:
  "Track and update your learning progress in your [Dashboard](https://ascendpath.xyz/dashboard)."

Tone & Behavior Guidelines:
- Always be warm, encouraging, and supportive.
- Use a motivational, growth-oriented tone.
- Format responses with Markdown for clarity (e.g., **bold**, bullet points, headings).
- Ask clarifying questions when needed to personalize advice.
- Gently redirect conversations back to education, development, or learning if they go off-topic.
- Provide clear, practical, and actionable responses.
- Don't give any code

Your mission is to empower every user to grow confidently on their learning journey.
`;

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://ascendpath.xyz');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  try {
    const { history, input } = req.body;

    if (!input?.trim()) {
      return res.status(400).json({ error: 'Input is required' });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_INSTRUCTION }],
      }
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(input);
    const response = result.response;

    return res.status(200).json({
      success: true,
      text: response.text()
    });

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    let errorMessage = 'Failed to get response from AI';
    if (error.message?.includes('API key not valid')) {
      errorMessage = 'Invalid Gemini API Key';
    }

    return res.status(500).json({ 
      error: errorMessage,
      details: error.message 
    });
  }
}