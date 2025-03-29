
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

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
}

export default function ChatHistory({ messages, isLoading }: ChatHistoryProps) {
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
        <div className="max-w-md">
          <h3 className="text-xl font-semibold mb-2">Welcome to Ghibli SoraNet</h3>
          <p className="text-muted-foreground">
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
            "flex max-w-[80%] flex-col gap-2 rounded-lg p-4",
            message.role === "user"
              ? "ml-auto bg-primary/10 text-foreground"
              : "mr-auto bg-muted text-foreground"
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
              <img
                src={message.outputImage}
                alt="Generated art"
                className="rounded-md w-full object-cover"
              />
            </div>
          )}
          
          <span className="text-xs text-muted-foreground self-end mt-1">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex max-w-[80%] mr-auto bg-muted rounded-lg p-4">
          <Loader className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
          <p className="text-muted-foreground">Generating Ghibli art...</p>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
