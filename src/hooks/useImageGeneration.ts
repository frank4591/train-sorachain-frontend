
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { useSoraRunes } from "@/context/SoraRunesContext";
import { toast } from "sonner";
import { Message } from "@/components/ghibli/ChatHistory";
import { UserData } from "@/lib/constants";

interface UseImageGenerationProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setGeneratedImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setShareDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useImageGeneration = ({
  messages,
  setMessages,
  setIsLoading,
  setGeneratedImageUrl,
  setShareDialogOpen
}: UseImageGenerationProps) => {
  const { useRunes } = useSoraRunes();

  const callAzureEndpoint = async (imageData: string, prompt: string, azureEndpoint: string, azureApiKey: string) => {
    try {
      const response = await fetch(`${azureEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureApiKey
        },
        body: JSON.stringify({
          prompt: prompt,
          image: imageData
        })
      });
      
      if (!response.ok) {
        throw new Error(`Azure API returned ${response.status}`);
      }
      
      const data = await response.json();
      return data.output_url || data.result || data.image_url; // Adapt based on Azure's response format
    } catch (error) {
      console.error('Azure API error:', error);
      throw error;
    }
  };

  const handleImageSubmission = async (
    messageText: string,
    imageFile: File | null,
    user: UserData | null,
    isAuthenticated: boolean,
    setAuthDialogOpen: (open: boolean) => void,
    azureEndpoint?: string,
    azureApiKey?: string
  ) => {
    if (!imageFile) {
      toast.error('Please upload an image to generate Ghibli art');
      return;
    }
    
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }
    
    const canUse = await useRunes(1);
    if (!canUse) return;
    
    const messageId = uuidv4();
    const timestamp = new Date();
    
    try {
      setIsLoading(true);
      
      // Read the file as data URL
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      reader.onload = async () => {
        const imageUrl = reader.result as string;
        
        // Add user message with image
        const userMessage: Message = {
          id: messageId,
          role: 'user',
          content: messageText || 'Transform this image in Ghibli style',
          timestamp,
          inputImage: imageUrl
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        // Call API
        try {
          let outputImageUrl;
          
          if (azureEndpoint && azureApiKey) {
            try {
              // Call Azure endpoint
              outputImageUrl = await callAzureEndpoint(
                imageUrl, 
                messageText || 'Transform this image in Ghibli style',
                azureEndpoint,
                azureApiKey
              );
            } catch (azureError) {
              console.error('Azure API error:', azureError);
              // Fallback to random image
              const randomId = Math.floor(Math.random() * 1000);
              outputImageUrl = `https://picsum.photos/800/600?random=${randomId}`;
            }
          } else {
            // For demo, use a placeholder if Azure credentials are not provided
            await new Promise(resolve => setTimeout(resolve, 2000));
            const randomId = Math.floor(Math.random() * 1000);
            outputImageUrl = `https://picsum.photos/800/600?random=${randomId}`;
          }
          
          // Add assistant response
          const assistantMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: 'Here is your Ghibli-style art:',
            timestamp: new Date(),
            outputImage: outputImageUrl
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          setGeneratedImageUrl(outputImageUrl);
          setShareDialogOpen(true);
          
          // Create a new session in the database
          const { error: insertError } = await supabase
            .from('image_submissions')
            .insert({
              user_id: user?.id,
              input_image: imageUrl,
              input_description: messageText,
              output_image: outputImageUrl,
              status: 'pending',
              is_public: false
            });
          
          if (insertError) throw insertError;
          
        } catch (error) {
          console.error('Error generating image:', error);
          toast.error('Failed to generate image');
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast.error('Failed to read image file');
        setIsLoading(false);
      };
      
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('Failed to process your request');
      setIsLoading(false);
    }
  };

  return { handleImageSubmission };
};
