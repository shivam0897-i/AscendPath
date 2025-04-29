import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
async function generateRoadmapWithGemini(profile) {
  console.log(`Generating roadmap for user: ${profile.id}`);
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }
  // Use a suitable Gemini model (e.g., gemini-1.5-flash-latest)
  const model = "gemini-1.5-flash-latest";
  const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  // Construct the detailed prompt for Gemini
  const prompt = `
    You are an expert learning path designer.
    Create a detailed, personalized learning roadmap for a user with the following profile:
    - Name: ${profile.first_name || 'User'}
    - Goals: ${profile.goals?.join('; ') || 'Not specified'}
    - Field/Current Skills: ${profile.skills?.join('; ') || 'Not specified'}
    - Background: ${profile.background || 'Not specified'}
    - Time Available: ${profile.time_available || 'Not specified'}
    - Potential Challenges: ${profile.challenges || 'Not specified'}

    Please structure the roadmap in JSON format with the following exact hierarchy and keys:
    - A root object with a string 'title' (e.g., "Personalized Roadmap for [Name]") and a string 'description'.
    - A 'phases' array. Each phase object must have a string 'title', a string 'description', and an integer 'position' (starting from 1).
    - Each phase must contain a 'milestones' array. Each milestone object must have a string 'title', a string 'description', a string 'estimated_time' (e.g., "1 week", "2 days"), and an integer 'position' (starting from 1 within the phase).
    - Each milestone must contain a 'resources' array. Each resource object must have a string 'title', a string 'type' (e.g., "Course", "Tutorial", "Book", "Article", "Video", "Documentation"), a string 'platform' (e.g., "Coursera", "Udemy", "YouTube", "Official Docs", "Blog Post"), and a string 'url' (use valid-looking placeholders like "https://example.com/resource" if unsure, but NOT just '#'). Optionally include a string 'image_url'.

    Guidelines:
    - The roadmap should be logical, sequential, and directly relevant to the user's goals and experience level implied in their profile.
    - Base the number of phases and milestones on the goal complexity and timeline (if specified).
    - Resource suggestions should be relevant to the milestone.
    - Ensure all required keys are present in the JSON structure.
    - Respond ONLY with the valid JSON object. Do not include any text before or after the JSON object, and do not use markdown formatting (like \`\`\`json).
  `;
  console.log("Sending request to Gemini API...");
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
      })
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API Error Response:', errorBody);
      throw new Error(`Gemini API request failed: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    console.log('Gemini API Raw Result:', JSON.stringify(result)); // Log the raw result for debugging
    // Extract the generated text content - adjust based on actual Gemini response structure
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      console.error("Could not find generated text in Gemini response:", result);
      throw new Error('Could not extract roadmap content from Gemini response.');
    }
    console.log("Extracted text from Gemini:", generatedText);
    // Parse the extracted text string as JSON
    let parsedRoadmap;
    try {
      parsedRoadmap = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response text as JSON:", parseError);
      console.error("Invalid JSON string received:", generatedText);
      throw new Error(`Failed to parse roadmap JSON from Gemini response: ${parseError.message}`);
    }
    // Optional: Add validation here to ensure parsedRoadmap matches GeneratedRoadmap structure
    if (!parsedRoadmap || !parsedRoadmap.title || !Array.isArray(parsedRoadmap.phases)) {
      console.error("Parsed roadmap is missing required top-level fields (title, phases):".parsedRoadmap);
      throw new Error('Generated roadmap JSON is missing required fields.');
    }
    console.log("Successfully parsed generated roadmap.");
    return parsedRoadmap;
  } catch (error) {
    console.error("Error during Gemini API call or processing:", error);
    // Re-throw the error to be caught by the main handler
    throw error;
  }
}
serve(async (req)=>{
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  let supabaseClient; // Define outside try block
  try {
    // 1. Initialize Supabase Client
    supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')
        }
      }
    });
    // 2. Extract userId from request body
    const body = await req.json();
    const userId = body?.userId;
    if (!userId) {
      throw new Error('Missing userId in request body');
    }
    console.log(`Function invoked for userId: ${userId}`);
    // 3. Fetch user profile data
    const { data: profile, error: profileError } = await supabaseClient.from('profiles').select('*') // Fetch all fields needed for the prompt
    .eq('id', userId).single();
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // Handle case where profile might not exist cleanly
      if (profileError.code === 'PGRST116') {
        throw new Error(`Profile not found for userId: ${userId}`);
      }
      throw new Error(`Failed to fetch profile: ${profileError.message}`);
    }
    if (!profile) {
      // Should be caught by PGRST116 above, but as a safeguard
      throw new Error(`Profile data is null for userId: ${userId}`);
    }
    console.log(`Profile fetched for ${userId}`);
    // 4. Generate roadmap using Gemini
    const generatedRoadmap = await generateRoadmapWithGemini(profile);
    console.log(`Roadmap structure generated for ${userId}`);
    // 5. Save the generated roadmap to Supabase using the DB function
    console.log("Calling database function 'create_user_roadmap'...");
    const { data: savedRoadmapResult, error: transactionError } = await supabaseClient.rpc('create_user_roadmap', {
      p_user_id: userId,
      p_roadmap_title: generatedRoadmap.title,
      p_roadmap_description: generatedRoadmap.description,
      // Ensure the structure matches what the SQL function expects (jsonb)
      p_phases: generatedRoadmap.phases
    });
    if (transactionError) {
      console.error('Database function error saving roadmap:', transactionError);
      throw new Error(`Failed to save roadmap via DB function: ${transactionError.message}`);
    }
    const newRoadmapId = savedRoadmapResult; // Assuming the function returns the new roadmap ID directly
    console.log(`Roadmap successfully saved for userId ${userId} with ID: ${newRoadmapId}`);
    // 6. Return success response
    return new Response(JSON.stringify({
      success: true,
      message: 'Roadmap generated and saved successfully.',
      roadmapId: newRoadmapId
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('[generate-roadmap] Error:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      // Use 500 for server-side errors, 4xx for client errors (like missing userId)
      status: error.message.includes('Missing userId') || error.message.includes('Profile not found') ? 400 : 500
    });
  }
});
