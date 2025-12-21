import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.5-flash';

const GENERATION_CONFIG = {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 4096,
};

const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const SYSTEM_PROMPT = `You are an expert career counselor AI. Based on the questionnaire data provided, analyze the person's interests, skills, preferences, and goals to suggest the best matching career paths.

Return ONLY a valid JSON array with 4-6 career suggestions. Each suggestion must have this exact structure:
{
  "title": "Career Title",
  "description": "A brief 1-2 sentence description of the career",
  "matchScore": 85,
  "educationPath": "Required education or training path",
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "category": "Category Name"
}

Rules:
1. matchScore should be between 70-98 (never 100%)
2. Base the matchScore on how well the career matches their interests, skills, and preferences
3. Be specific and personalized - don't give generic suggestions
4. Consider their work preferences (remote, leadership, team vs solo)
5. Factor in their motivations and values
6. Return ONLY the JSON array, no markdown, no explanation, no code blocks`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://ascendpath.xyz').split(',');
    const origin = req.headers?.origin || '';
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    res.setHeader('Access-Control-Allow-Origin', corsOrigin);
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
        const { formData } = req.body;

        if (!formData) {
            return res.status(400).json({ error: 'Form data is required' });
        }

        // Format the questionnaire data into a readable prompt
        const questionnairePrompt = `
Analyze this career questionnaire response and suggest personalized career paths:

**Personal Info:**
- Name: ${formData.personalInfo?.firstName || 'Not provided'} ${formData.personalInfo?.lastName || ''}
- Age: ${formData.personalInfo?.age || 'Not provided'}
- Education Level: ${formData.personalInfo?.educationLevel || 'Not provided'}
- Field of Study: ${formData.personalInfo?.fieldOfStudy || 'Not provided'}
- Work Experience: ${formData.personalInfo?.workExperience || 'Not provided'}

**Interests:**
- Favorite Subjects: ${formData.interests?.subjects?.join(', ') || 'None specified'}
- Hobbies: ${formData.interests?.hobbies?.join(', ') || 'None specified'}
- Industries of Interest: ${formData.interests?.industries?.join(', ') || 'None specified'}
- Preferred Work Type: ${formData.interests?.preferredWorkType?.join(', ') || 'Not specified'}

**Skills:**
- Technical Skills: ${formData.skills?.technicalSkills || 'Not specified'}
- Soft Skills: ${formData.skills?.softSkills || 'Not specified'}
- Strengths: ${formData.skills?.strengths || 'Not specified'}
- Areas to Improve: ${formData.skills?.areasToImprove || 'Not specified'}

**Work Preferences:**
- Preferred Role: ${formData.workPreferences?.role || 'Not specified'}
- Work Environment: ${formData.workPreferences?.environment || 'Not specified'}
- Company Size: ${formData.workPreferences?.companySize || 'Not specified'}
- Work-Life Balance Priority: ${formData.workPreferences?.workLifeBalance || 'Not specified'}
- Motivations: ${formData.workPreferences?.motivation?.join(', ') || 'Not specified'}

**Goals:**
- Careers Considering: ${formData.goals?.consideringCareers?.join(', ') || 'Not specified'}
- Career Priority: ${formData.goals?.careerPriority || 'Not specified'}
- Further Education Interest: ${formData.goals?.furtherEducation || 'Not specified'}

**Additional Info:**
- Limitations/Constraints: ${formData.additionalInfo?.limitations || 'None'}
- Other Info: ${formData.additionalInfo?.otherInfo || 'None'}

Based on all this information, suggest 4-6 personalized career paths that would be the best match.`;

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            generationConfig: GENERATION_CONFIG,
            safetySettings: SAFETY_SETTINGS,
            systemInstruction: {
                role: "system",
                parts: [{ text: SYSTEM_PROMPT }],
            }
        });

        const result = await model.generateContent(questionnairePrompt);
        const responseText = result.response.text();

        // Parse the JSON response
        let suggestions;
        try {
            // Clean up the response - remove any markdown code blocks
            const cleanedResponse = responseText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            suggestions = JSON.parse(cleanedResponse);

            // Validate the response structure
            if (!Array.isArray(suggestions)) {
                throw new Error('Response is not an array');
            }

            // Validate each suggestion has required fields
            suggestions = suggestions.map((s: Record<string, unknown>) => ({
                title: String(s.title || 'Career'),
                description: String(s.description || 'No description available'),
                matchScore: Math.min(98, Math.max(70, Number(s.matchScore) || 75)),
                educationPath: String(s.educationPath || 'Various paths available'),
                skills: Array.isArray(s.skills) ? s.skills.map(String) : ['Problem-solving'],
                category: String(s.category || 'General'),
            }));

        } catch {
            console.error('Failed to parse AI response:', responseText);
            return res.status(500).json({
                error: 'Failed to parse career suggestions',
                rawResponse: responseText.substring(0, 500)
            });
        }

        return res.status(200).json({
            success: true,
            suggestions,
        });

    } catch (error: unknown) {
        const err = error as Error;
        console.error('Career Suggestions API Error:', err);
        return res.status(500).json({
            error: err.message || 'Failed to generate career suggestions'
        });
    }
}
