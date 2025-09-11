import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, SendHorizonal, Trash } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ApiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const storedMessages = sessionStorage.getItem('chatMessages');
    return storedMessages ? JSON.parse(storedMessages) : [
      { role: 'model', text: 'Hello! I am the AscendPath AI Helper. How can I assist with your educational journey today?' }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) {
      return;
    }

    const userMessage: Message = { role: 'user', text: input };
    const currentInput = input;

    // Convert messages to API format (excluding the initial welcome message)
    const historyForAPI: ApiMessage[] = messages
      .filter((msg, index) => !(index === 0 && msg.role === 'model'))
      .map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    requestAnimationFrame(scrollToBottom);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: historyForAPI,
          input: currentInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      if (data.success && data.text) {
        const modelMessage: Message = { role: 'model', text: data.text };
        setMessages((prev) => [...prev, modelMessage]);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (err: any) {
      console.error('Error calling API:', err);
      let errorMessage = 'Failed to get response from AI.';
      
      if (err.message) {
        errorMessage += ` ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      requestAnimationFrame(scrollToBottom);
    }
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      sessionStorage.removeItem('chatMessages');
      setMessages([
        { role: 'model', text: 'Hello! I am the AscendPath AI Helper. How can I assist with your educational journey today?' }
      ]);
      toast.success("Chat history cleared ✅");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && input.trim()) {
      handleSend();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-empowerPurple" />
          <CardTitle className="text-lg font-semibold text-gray-800">AscendPath Helper</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearChat}
          className="text-gray-500 hover:text-empowerPurple ml-3"
          aria-label="Clear Chat"
        >
          <Trash size={18} />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[450px] w-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-4 bg-gray-50" ref={viewportRef} data-radix-scroll-area-viewport>
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
                    "text-sm max-w-[85%] px-3 py-2 rounded-xl shadow-sm",
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
                        a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
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
                  <div className="flex space-x-1">
                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
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
            placeholder="Ask about learning paths..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1 h-10 rounded-lg border-gray-300 focus:ring-empowerPurple focus:border-empowerPurple"
            aria-label="Chat input"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-empowerPurple hover:bg-empowerPurple/90 text-white rounded-lg h-10 w-10 p-0 flex items-center justify-center"
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
