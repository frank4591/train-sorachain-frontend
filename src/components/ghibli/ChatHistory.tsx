
import React from 'react';
import { format } from 'date-fns';
import { MessageSquare, User as UserIcon, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  inputImage?: string;
  outputImage?: string;
}

interface ChatHistoryProps {
  messages: Message[];
  isLoading?: boolean;
  onDownload?: (imageUrl: string) => void;
}

const MessageBubble = ({ 
  message, 
  isLoading, 
  showTimestamp = true,
  onDownload
}: { 
  message: Message; 
  isLoading?: boolean; 
  showTimestamp?: boolean;
  onDownload?: (imageUrl: string) => void;
}) => {
  const isUser = message.role === 'user';
  const bubbleClasses = isUser 
    ? 'bg-primary/10 text-primary-foreground'
    : 'bg-muted text-muted-foreground';
  
  return (
    <div className={cn(
      'flex w-full mb-4 animate-fade-in',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'flex items-start max-w-[80%]',
        isUser && 'flex-row-reverse'
      )}>
        <div className={cn(
          'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-primary text-primary-foreground ml-2' : 'bg-muted text-foreground mr-2'
        )}>
          {isUser ? <UserIcon className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
        </div>
        
        <div className="flex flex-col">
          <div className={cn(
            'rounded-xl p-3 text-sm',
            bubbleClasses,
            (message.inputImage || message.outputImage) && 'max-w-sm'
          )}>
            <p className="mb-2">{message.content}</p>
            
            {message.inputImage && (
              <div className="mt-2">
                <img 
                  src={message.inputImage} 
                  alt="User uploaded" 
                  className="rounded-md max-h-60 max-w-full object-contain"
                />
              </div>
            )}
            
            {message.outputImage && (
              <div className="mt-2 relative group">
                <img 
                  src={message.outputImage} 
                  alt="Generated art" 
                  className="rounded-md max-h-60 max-w-full object-contain"
                />
                
                {onDownload && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => onDownload(message.outputImage!)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {showTimestamp && (
            <span className={cn(
              'text-xs mt-1 text-muted-foreground', 
              isUser ? 'text-right' : 'text-left'
            )}>
              {format(message.timestamp, 'HH:mm')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const LoadingIndicator = () => (
  <div className="flex w-full mb-4 mt-2 animate-fade-in justify-start">
    <div className="flex items-start">
      <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-muted text-foreground mr-2">
        <MessageSquare className="h-4 w-4" />
      </div>
      
      <div className="flex flex-col">
        <div className="rounded-xl p-3 text-sm bg-muted flex space-x-2">
          <div className="animate-pulse-subtle h-2 w-2 bg-muted-foreground rounded-full"></div>
          <div className="animate-pulse-subtle h-2 w-2 bg-muted-foreground rounded-full animation-delay-200"></div>
          <div className="animate-pulse-subtle h-2 w-2 bg-muted-foreground rounded-full animation-delay-400"></div>
        </div>
        
        <span className="text-xs mt-1 text-muted-foreground text-left">
          now
        </span>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <div className="rounded-full bg-primary/10 p-4 mb-4">
      <MessageSquare className="h-8 w-8 text-primary-foreground" />
    </div>
    <h3 className="font-medium text-lg">Start a new generation</h3>
    <p className="text-muted-foreground mt-1 max-w-md">
      Upload an image below with a description to transform it into a Ghibli-style artwork.
    </p>
  </div>
);

export default function ChatHistory({ messages, isLoading, onDownload }: ChatHistoryProps) {
  return (
    <ScrollArea className="flex-1 p-4 overflow-y-auto">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              onDownload={onDownload}
            />
          ))}
          
          {isLoading && <LoadingIndicator />}
        </div>
      )}
    </ScrollArea>
  );
}
