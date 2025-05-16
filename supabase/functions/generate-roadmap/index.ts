import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import axios from 'https://cdn.skypack.dev/axios';

async function checkIfUrlWorks(url) {
  try {
    const response = await axios.head(url, { timeout: 5000 });
    return response.status >= 200 && response.status < 400;
  } catch {
    return false;
  }
}

async function askGeminiForAlternative(resource, GEMINI_API_KEY) {
  const model = "gemini-1.5-pro-latest";
  const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `
A learning resource was found to be broken.
You can use live search (Google Search) if you need to find real working links or current alternatives. Only choose links that you have verified from search results.


Please suggest a real, currently working alternative based on the following:
- Title: "${resource.title}"
- Type: ${resource.type}
- Platform (if known): ${resource.platform}
- Topic: Same as original
- Trustworthy platforms: geekforgeeks , Coursera, edX, YouTube, freeCodeCamp, MDN, LeetCode, Fast.ai, etc.

Respond with ONLY a JSON object like:
{
  "title": "...",
  "type": "...",
  "platform": "...",
  "url": "https://...",
  "image_url": "..."
}
If no good alternative exists, respond with: null
  `;

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
        // ,tools: [{ type: "retrieval" }] // This enables Google Search grounding
      })
    });

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text || text === 'null') return null;

    const cleaned = text.replace(/^```json\n?|\n?```$/g, '').trim();
    const generated = JSON.parse(cleaned);
    const isValid = await checkIfUrlWorks(generated.url);
    return isValid ? generated : null;
  } catch (error) {
    console.error("Gemini fallback error:", error);
    return null;
  }
}

async function validateResource(resource, GEMINI_API_KEY) {
  if (await checkIfUrlWorks(resource.url)) return resource;

  console.warn(`Broken resource detected: ${resource.url}`);

  // Try alternatives first
  if (resource.alternative_resources?.length > 0) {
    for (const alt of resource.alternative_resources) {
      if (alt.url && await checkIfUrlWorks(alt.url)) {
        console.log(`Replaced with working alternative: ${alt.url}`);
        return alt;
      }
    }
  }

  // Ask Gemini for a new alternative
  const geminiReplacement = await askGeminiForAlternative(resource, GEMINI_API_KEY);
  if (geminiReplacement) {
    console.log(`Gemini provided new alternative: ${geminiReplacement.url}`);
    return geminiReplacement;
  }

  // If all fail
  return { ...resource, url: 'Unavailable (link broken)' };
}

async function validateAndReplaceResourceUrls(roadmap) {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");

  for (const phase of roadmap.phases) {
    for (const milestone of phase.milestones) {
      const validatedResources = await Promise.all(
        milestone.resources.map(resource =>
          validateResource(resource, GEMINI_API_KEY)
        )
      );
      milestone.resources = validatedResources;
    }
  }

  return roadmap;
}


async function generateRoadmapWithGemini(profile) {
  console.log(`Generating roadmap for user: ${profile.id}`);
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }

  const model = "gemini-2.5-pro-preview-05-06";
  const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `You are an expert learning path designer and resource researcher.

Create a highly detailed, fully personalized learning roadmap for a user based on the following profile:
- Name: ${profile.first_name || 'User'}
- Goals: ${profile.goals?.join('; ') || 'Not specified'}
- Field/Current Skills: ${profile.skills?.join('; ') || 'Not specified'}
- Background (education, work, relevant experience): ${profile.background || 'Not specified'}
- Time Available (daily/weekly): ${profile.time_available || 'Not specified'}
- Preferred Learning Style (e.g., videos, articles, projects) if known: ${profile.learning_style || 'Not specified'}
- Potential Challenges or Limitations: ${profile.challenges || 'Not specified'}

The roadmap must be realistic, motivating, actionable, and customized to the user's profile.

--- 

**STRICT GUIDELINES:**

- **Resources** must be real, verifiable, working, and come from well-known, trusted platforms.
- **Never invent links** or use fake placeholders. If no good resource is available, skip rather than invent.
- **You can use live search (Google Search) if you need to find real working links or current alternatives. Only choose links that you have verified from search results.

- **Match platforms to topics**:
  - Coding/Software Development: LeetCode, HackerRank, Codeforces, FreeCodeCamp, GitHub.
  - Web Development: MDN Web Docs, W3Schools, freeCodeCamp.
  - Data Science/Machine Learning: Fast.ai, DeepLearning.AI, TensorFlow.org, Kaggle, edX.
  - Research Papers: ArXiv, ResearchGate, Semantic Scholar.
  - Certifications: Coursera, edX, official vendor sites (AWS, Google Cloud, etc.).
  - Tutorials & Blogs: Medium, Dev.to, Official Company Blogs.
  - General Learning: Coursera, edX, Udemy, Khan Academy, YouTube.
- Prefer resources that are:
  - Free or offer free tiers where possible.
  - Highly rated (e.g., above 4.5★ if rating exists).
  - Recently updated (ideally within the last 1–2 years).
- **Match resource type to learning style** if available (e.g., prefer videos if user likes videos).
- Include **practical projects, real-world exercises, or challenges** in appropriate milestones.
- If multiple excellent resources exist, list one main resource + optionally up to two alternatives.
- If the user's goal involves certifications, prioritize certification-aligned resources where available.

--- 

**OUTPUT FORMAT:** (Strict JSON, no extra text, no markdown)

Root object:
- 'title': string (e.g., "Personalized Roadmap for [Name]")
- 'description': string (brief overview of the approach)
- 'phases': array of objects:
  - Each phase must have:
    - 'title': string
    - 'description': string
    - 'position': integer (starting from 1)
    - 'milestones': array of objects:
      - Each milestone must have:
        - 'title': string
        - 'description': string
        - 'estimated_time': string (e.g., "1 week", "2 days")
        - 'position': integer (starting from 1 within the phase)
        - 'resources': array of objects:
          - Each resource must have:
            - 'title': string
            - 'type': string (Course, Tutorial, Book, Article, Video, Documentation)
            - 'platform': string (e.g., Coursera, Udemy, YouTube, MDN, LeetCode, etc.)
            - 'url': string (must be a real, verified, accessible link)
            - 'image_url': string (MUST be a direct, valid URL to a relevant image/thumbnail. Find one if possible. DO NOT LEAVE EMPTY OR NULL.)
            - 'description': string (Brief description of the resource) // Added description for context
          - Optional field: 'alternative_resources' (array of up to 2 alternative resource objects with same structure)

--- 

**CRITICAL REMINDERS:**
- All URLs must be real and tested for existence. No broken, fake, or placeholder links are allowed.
- JSON must be clean, valid, and ready for parsing.
- Respond with **only** the JSON object — no introductory or closing text.
`;

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
        // ,tools: [{ type: "retrieval" }] // This enables Google Search grounding
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API Error Response:', errorBody);
      throw new Error(`Gemini API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      throw new Error('Could not extract roadmap content from Gemini response.');
    }

    const cleanedText = generatedText.trim().replace(/^```json\n?|\n?```$/g, '').trim();
    let parsedRoadmap = JSON.parse(cleanedText); 

    parsedRoadmap = await validateAndReplaceResourceUrls(parsedRoadmap);
    return parsedRoadmap;
  } catch (error) {
    console.error("Error during Gemini API call or processing:", error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  let supabaseClient;
  try {
    supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: req.headers.get('Authorization')
          }
        }
      }
    );

    const body = await req.json();
    const userId = body?.userId;
    if (!userId) {
      throw new Error('Missing userId in request body');
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (profileError) {
      throw new Error(`Failed to fetch profile: ${profileError.message}`);
    }

    const generatedRoadmap = await generateRoadmapWithGemini(profile);
    console.log(`Roadmap structure generated for ${userId}`);

    const { data: savedRoadmapResult, error: transactionError } =
      await supabaseClient.rpc('create_user_roadmap', {
        p_user_id: userId,
        p_roadmap_title: generatedRoadmap.title,
        p_roadmap_description: generatedRoadmap.description,
        p_phases: generatedRoadmap.phases
      });

    if (transactionError) {
      throw new Error(`Failed to save roadmap via DB function: ${transactionError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Roadmap generated and saved successfully.',
        roadmapId: savedRoadmapResult
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );
  } catch (error) {
    console.error('[generate-roadmap] Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});
