
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  inputImage?: string;
  outputImage?: string;
}

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
  onDownload?: (imageUrl: string) => void;
}

export default function ChatHistory({ messages, isLoading, onDownload }: ChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current && (!hasScrolledToBottom || messages.length <= 1)) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setHasScrolledToBottom(true);
    }
  }, [messages, hasScrolledToBottom]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md animate-fade-in">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full opacity-80 flex items-center justify-center">
            <img 
              src="/placeholder.svg" 
              alt="Upload" 
              className="w-16 h-16 opacity-70" 
            />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-violet-200">Welcome to Ghibli SoraNet</h3>
          <p className="text-violet-300/70">
            Upload an image and add a description to transform it into a Ghibli-style masterpiece.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex max-w-[80%] flex-col gap-2 rounded-lg p-4 animate-fade-in",
            message.role === "user"
              ? "ml-auto bg-violet-900/30 text-violet-100 border border-violet-800/30"
              : "mr-auto bg-gradient-to-br from-[#1a1d2d] to-[#252a40] text-violet-100 border border-violet-800/20"
          )}
        >
          {message.inputImage && (
            <div className="mb-2">
              <img
                src={message.inputImage}
                alt="User uploaded"
                className="rounded-md max-h-56 object-cover"
              />
              <p className="text-sm mt-1">{message.content}</p>
            </div>
          )}
          
          {!message.inputImage && !message.outputImage && (
            <p>{message.content}</p>
          )}
          
          {message.outputImage && (
            <div>
              <p className="mb-2">{message.content}</p>
              <div className="relative group">
                <img
                  src={message.outputImage}
                  alt="Generated art"
                  className="rounded-md w-full object-cover"
                />
                {onDownload && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 border border-violet-400/30 text-violet-200"
                    onClick={() => onDownload(message.outputImage!)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
          
          <span className="text-xs text-violet-400/70 self-end mt-1">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex max-w-[80%] mr-auto bg-gradient-to-br from-[#1a1d2d] to-[#252a40] border border-violet-800/20 rounded-lg p-4 animate-pulse">
          <Loader className="h-5 w-5 animate-spin text-violet-400 mr-2" />
          <p className="text-violet-300">Generating Ghibli art...</p>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
