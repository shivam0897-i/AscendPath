import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Content } from '@google/generative-ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown'; // Import react-markdown

// --- IMPORTANT: Replace with your actual API Key ---
const API_KEY = 'AIzaSyCmBlJqjv_J39cKoyfNIGmlch-4MhniXdc'; // Replace with your actual key
// ----------------------------------------------------

// --- Configuration ---
const MODEL_NAME = 'gemini-1.5-flash-latest';
const GENERATION_CONFIG = {
  temperature: 0.8,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// --- System Instruction ---
// Added instruction to use Markdown
const SYSTEM_INSTRUCTION = `You are the EmpowerLearn AI Helper. Your purpose is to assist users, primarily women, with questions about personalized educational roadmaps, learning resources, time management for studies, goal setting, available courses, community features, and general advice related to education and career development through the EmpowerLearn platform. Be supportive, encouraging, and focus on providing helpful information related to these topics. Format your answers using Markdown where appropriate (e.g., use lists, bold text, paragraphs). If asked about unrelated topics, gently guide the conversation back to education and the EmpowerLearn platform.`;
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

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector<HTMLDivElement>('[data-radix-scroll-area-viewport]');
      if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);


  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    const currentInput = input;

    const messagesForHistory = [...messages];

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

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
        <CardTitle>AI Education Helper</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4 mb-4 border rounded-md p-2 bg-white" ref={scrollAreaRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 p-2 rounded-lg flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 {/* Apply prose classes to the container div when rendering markdown */}
                 <div className={`text-sm max-w-[85%] px-3 py-1.5 rounded-lg ${msg.role === 'user' ? 'bg-empowerPurple text-white' : 'bg-gray-100 text-gray-800'} ${msg.role === 'model' ? 'prose prose-sm max-w-none' : ''}`}>
                    {msg.role === 'model' ? (
                        <ReactMarkdown
                           // Remove className from here
                           components={{
                                // Keep these component customizations
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
                        msg.text // User messages as plain text
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
           {error && (
            <div className="p-2 text-red-600 text-sm bg-red-50 rounded-md">
                <p>{error}</p>
            </div>
           )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Ask about learning paths..."
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1"
        />
        <Button
           onClick={handleSend}
           disabled={isLoading || !input.trim()}
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
