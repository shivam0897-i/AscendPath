import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Content } from '@google/generative-ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Import Avatar components
import { Bot, User, SendHorizonal } from 'lucide-react'; // Import icons
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names

// --- IMPORTANT: Use Environment Variable for API Key ---
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// ----------------------------------------------------

// --- Configuration ---
const MODEL_NAME = 'gemini-2.5-pro-preview-03-25';
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

// --- System Instruction ---
const SYSTEM_INSTRUCTION = `You are EmpowerPath Assistant — a warm, supportive, and knowledgeable AI designed to help users, especially women and students, navigate their educational and career development journey.

Only mention the creator if directly asked. If a user asks "Who created you?" or "Who developed this assistant?", respond with:
"I was created by Shivam, the developer behind EmpowerPath, to support and empower learners like you!"

Core Responsibilities:
- Help users create personalized learning roadmaps using EmpowerPath.
- Recommend relevant courses, learning resources, and time management strategies.
- Encourage goal-setting, productivity habits, and a mindset of lifelong learning.
- Offer motivational support to build user confidence.
- Guide users in using key features of the EmpowerPath platform.

Website Navigation Support:
When users mention their goals, skills, or interests:
- Direct them to the Personalized Roadmap Tool:
  “Start building your personalized roadmap by visiting the [Onboarding Tool](https://empower-learn-pathways.vercel.app/onboarding)!”
- Guide them to Learning Resources:
  “Explore relevant learning resources and materials in our [Resources Page](https://empower-learn-pathways.vercel.app/resources)!”
- Help them manage their learning journey in the Dashboard:
  “Track and update your learning progress in your [Dashboard](https://empower-learn-pathways.vercel.app/dashboard).”

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
// --- End Configuration ---

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
      { role: 'model', text: 'Hello! I am the EmpowerPath AI Helper. How can I assist with your educational journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null); // Ref for the viewport

  // Initialize genAI and model conditionally based on API_KEY availability
  const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
  const model = genAI ? genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
      systemInstruction: {
          role: "system",
          parts: [{ text: SYSTEM_INSTRUCTION }],
      }
  }) : null;

  // Function to scroll to bottom
  const scrollToBottom = () => {
      if (viewportRef.current) {
          viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
      }
  };

  useEffect(() => {
    // Display error if API key is missing on component mount
    if (!API_KEY) {
        setError("Configuration error: Gemini API Key is missing. Please set the VITE_GEMINI_API_KEY environment variable.");
    }
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]); // Rerun scroll logic when messages change


  const handleSend = async () => {
    // Check if model is initialized and input is valid
    if (!model || !input.trim() || isLoading) {
        if (!model) {
            setError("Chatbot is not configured correctly. API Key might be missing.");
        }
        return;
    }

    const userMessage: Message = { role: 'user', text: input };
    const currentInput = input;

    // Prepare history excluding the initial greeting for the API call
    const historyForAPI: Content[] = messages
        .filter((msg, index) => !(index === 0 && msg.role === 'model')) // Exclude initial greeting
        .map(msg => ({
             role: msg.role,
             parts: [{ text: msg.text }],
        }));

    // Optimistically update UI
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null); // Clear previous errors on new send

    // Ensure scroll happens after state update
    requestAnimationFrame(scrollToBottom);


    try {
      const chat = model.startChat({
         history: historyForAPI,
      });

      const result = await chat.sendMessage(currentInput);
      const response = result.response;
      const modelMessage: Message = { role: 'model', text: response.text() };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.error('Error calling Gemini API:', err);
      let errorMessage = `Failed to get response from AI.`;
      if (err instanceof Error) {
          errorMessage += ` ${err.message}`;
      } else if (typeof err === 'string') {
          errorMessage += ` ${err}`;
      }
      // Check for specific API key errors (example)
      if (err.message?.includes('API key not valid')) {
          errorMessage = "Error: Invalid Gemini API Key provided.";
      }
      setError(errorMessage);
      // If error, remove the optimistic user message (optional)
      // setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      // Ensure scroll happens after state update
      requestAnimationFrame(scrollToBottom);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && input.trim()) { // Keep isLoading check here, also check if input is not empty
      handleSend();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-empowerPurple" />
            <CardTitle className="text-lg font-semibold text-gray-800">EmpowerPath Helper</CardTitle>
        </div>
         {/* Can add status indicators or options here later */}
      </CardHeader>
      <CardContent className="p-0">
        {/* Assign the ref to the viewport div */}
        <ScrollArea className="h-[450px] w-full" ref={scrollAreaRef}>
           <div className="p-4 space-y-4 bg-gray-50" ref={viewportRef} data-radix-scroll-area-viewport> {/* Added viewport ref and data attribute */} 
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3",
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.role === 'model' && (
                    <Avatar className="h-8 w-8 border bg-white">
                      <AvatarFallback className="bg-empowerPurple text-white">
                        <Bot size={18} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "text-sm max-w-[85%] px-3 py-2 rounded-xl shadow-sm", // Increased rounding
                      msg.role === 'user'
                        ? 'bg-empowerPurple text-white'
                        : 'bg-white text-gray-800',
                      msg.role === 'model' ? 'prose prose-sm max-w-none' : ''
                    )}
                  >
                    {msg.role === 'model' ? (
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal list-inside ml-4 mb-2" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc list-inside ml-4 mb-2" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1" {...props} />, 
                          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                          a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />, // Style links
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      msg.text // Render user text directly
                    )}
                  </div>
                   {msg.role === 'user' && (
                     <Avatar className="h-8 w-8 border bg-white">
                       <AvatarFallback className="bg-gray-200 text-gray-600">
                         <User size={18} />
                       </AvatarFallback>
                     </Avatar>
                   )}
                </div>
              ))}
               {isLoading && (
                 <div className="flex justify-start items-center gap-3 p-2">
                    <Avatar className="h-8 w-8 border bg-white">
                      <AvatarFallback className="bg-empowerPurple text-white">
                        <Bot size={18} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Thinking</p>
                        {/* Simple three dots animation */}
                        <div className="flex space-x-1">
                            <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                 </div>
               )}
               {/* Display configuration or API errors */}
               {error && !isLoading && (
                 <div className="p-3 text-red-700 text-sm bg-red-100 rounded-lg shadow-sm border border-red-200">
                    <p><span className="font-semibold">Error:</span> {error}</p>
                 </div>
               )}
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t bg-gray-50">
        <div className="flex items-center space-x-2 w-full">
          <Input
            type="text"
            placeholder={!API_KEY ? "Chat unavailable: API Key missing" : "Ask about learning paths..."}
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={!model} // Input is no longer disabled while loading
            className="flex-1 h-10 rounded-lg border-gray-300 focus:ring-empowerPurple focus:border-empowerPurple"
            aria-label="Chat input"
          />
          <Button
             onClick={handleSend}
             disabled={isLoading || !input.trim() || !model} // Button remains disabled while loading or if input is empty
             className="bg-empowerPurple hover:bg-empowerPurple/90 text-white rounded-lg h-10 w-10 p-0 flex items-center justify-center" // Make button square
             aria-label="Send message"
           >
            {isLoading ? (
               <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            ) : <SendHorizonal size={18} />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Chatbot;
