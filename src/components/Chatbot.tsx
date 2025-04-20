import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Content } from '@google/generative-ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

// --- IMPORTANT: Use Environment Variable for API Key ---
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// ----------------------------------------------------

// --- Configuration ---
const MODEL_NAME = 'gemini-2.0-flash';
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
const SYSTEM_INSTRUCTION = `You are the EmpowerLearn AI Helper. You are a helpful, supportive, and knowledgeable assistant for the EmpowerLearn platform. Your primary purpose is to assist users—especially women and students—with their educational and career development needs. Provide personalized guidance on learning roadmaps, recommend learning resources, suggest effective time management techniques, and offer goal-setting advice. Help users discover relevant courses, engage with community features, and navigate their journey toward academic or professional success.

Always maintain a friendly, encouraging, and motivational tone. Format your responses using Markdown to improve readability—use bullet points, bold text, and headings where appropriate.

If users ask about topics that are unrelated to education, personal development, or the EmpowerLearn platform, gently redirect the conversation back to relevant themes with kindness and understanding.

Focus areas include:

Personalized educational pathways

Learning resources and tools

Time management strategies for students

Goal-setting and motivation tips

Course and program recommendations

Community engagement within EmpowerLearn

Career guidance and lifelong learning advice

Your responses should empower users to take control of their educational journey and feel confident in their learning potential.`;
// --- End Configuration ---

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
      { role: 'model', text: 'Hello! I am the EmpowerLearn AI Helper. How can I assist with your educational journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Display error if API key is missing on component mount
    if (!API_KEY) {
        setError("Configuration error: Gemini API Key is missing. Please set the VITE_GEMINI_API_KEY environment variable.");
    }
    // Scroll logic
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector<HTMLDivElement>('[data-radix-scroll-area-viewport]');
      if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
      }
    }
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

    const messagesForHistory = [...messages];

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null); // Clear previous errors on new send

    try {
       const historyForAPI: Content[] = messagesForHistory
         .filter((msg, index) => !(index === 0 && msg.role === 'model'))
         .map(msg => ({
           role: msg.role,
           parts: [{ text: msg.text }],
         }));

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle>EmpowerPath Helper</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4 mb-4 border rounded-md p-2 bg-white" ref={scrollAreaRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 p-2 rounded-lg flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`text-sm max-w-[85%] px-3 py-1.5 rounded-lg ${msg.role === 'user' ? 'bg-empowerPurple text-white' : 'bg-gray-100 text-gray-800'} ${msg.role === 'model' ? 'prose prose-sm max-w-none' : ''}`}>
                    {msg.role === 'model' ? (
                        <ReactMarkdown
                           components={{
                                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />, 
                                ol: ({node, ...props}) => <ol className="list-decimal list-inside ml-4 mb-2" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-inside ml-4 mb-2" {...props} />,
                                li: ({node, ...props}) => <li className="mb-1" {...props} />, 
                                strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                            }}
                        >
                            {msg.text}
                        </ReactMarkdown>
                    ) : (
                        msg.text
                    )}
                 </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center p-2">
                <p className="text-sm text-gray-500">Thinking...</p>
                <div className="ml-2 h-4 w-4 border-t-2 border-b-2 border-empowerPurple rounded-full animate-spin"></div>
            </div>
           )}
           {/* Display configuration or API errors */}
           {error && !isLoading && (
            <div className="p-2 text-red-600 text-sm bg-red-50 rounded-md">
                <p>{error}</p>
            </div>
           )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder={!API_KEY ? "Chat unavailable: API Key missing" : "Ask about learning paths..."}
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading || !model} // Disable input if model isn't initialized
          className="flex-1"
        />
        <Button
           onClick={handleSend}
           disabled={isLoading || !input.trim() || !model} // Disable button if model isn't initialized
           className="bg-empowerPurple hover:bg-empowerPurple-dark px-4 py-2"
         >
          {isLoading ? (
             <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
          ) : 'Send'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Chatbot;
