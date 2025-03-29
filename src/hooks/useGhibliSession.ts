
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message } from "@/components/ghibli/ChatHistory";

export const useGhibliSession = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const fetchSessionMessages = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('image_submissions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newMessages: Message[] = [
          {
            id: uuidv4(),
            role: 'user',
            content: data.input_description || 'Transform this image in Ghibli style',
            timestamp: new Date(data.created_at),
            inputImage: data.input_image
          }
        ];
        
        if (data.output_image) {
          newMessages.push({
            id: uuidv4(),
            role: 'assistant',
            content: 'Here is your Ghibli-style art:',
            timestamp: new Date(data.created_at),
            outputImage: data.output_image
          });
        }
        
        setMessages(newMessages);
        setActiveSessionId(sessionId);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      toast.error('Failed to load session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    activeSessionId,
    setActiveSessionId,
    fetchSessionMessages
  };
};
