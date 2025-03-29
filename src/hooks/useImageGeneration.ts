
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { useSoraRunes } from "@/context/SoraRunesContext";
import { toast } from "sonner";
import { Message } from "@/components/ghibli/ChatHistory";
import { UserData } from "@/context/AuthContext";
import { getAzureVisionClient } from "@/integrations/azure/client";

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

  const handleImageSubmission = async (
    messageText: string,
    imageFile: File | null,
    user: UserData | null,
    isAuthenticated: boolean,
    setAuthDialogOpen: (open: boolean) => void,
    azureEndpoint?: string,
    azureApiKey?: string
  ) => {
    if (!messageText) {
      toast.error('Please enter a description for the image you want to generate');
      return;
    }
    
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }
    
    const canUse = await useRunes(1);
    if (!canUse) {
      toast.error('Not enough SoraRunes. Please earn more by sharing previous generations.');
      return;
    }
    
    const messageId = uuidv4();
    const timestamp = new Date();
    
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: Message = {
        id: messageId,
        role: 'user',
        content: messageText,
        timestamp
      };
      
      // If there's an image file, process it
      if (imageFile) {
        // Read the file as data URL
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        
        reader.onload = async () => {
          const imageUrl = reader.result as string;
          userMessage.inputImage = imageUrl;
          setMessages(prev => [...prev, userMessage]);
          await processGeneration(messageText, imageUrl, user, azureEndpoint, azureApiKey);
        };
        
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
          toast.error('Failed to read image file');
          setIsLoading(false);
        };
      } else {
        // No image file, just process with text prompt
        setMessages(prev => [...prev, userMessage]);
        await processGeneration(messageText, null, user, azureEndpoint, azureApiKey);
      }
      
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('Failed to process your request');
      setIsLoading(false);
    }
  };

  const processGeneration = async (
    messageText: string,
    inputImageUrl: string | null,
    user: UserData | null,
    azureEndpoint?: string,
    azureApiKey?: string
  ) => {
    try {
      toast.info('Generating your Ghibli art...');
      
      // Check if Azure credentials are provided
      const hasAzureCredentials = azureEndpoint && azureApiKey;
      
      if (!hasAzureCredentials) {
        console.warn('Azure credentials not provided. Using demo mode.');
        toast.warning('Running in demo mode. Please configure Azure credentials for real transformations.');
      }
      
      let outputImageUrl;
      
      if (hasAzureCredentials) {
        try {
          // Initialize Azure client
          const azureClient = getAzureVisionClient(azureApiKey, azureEndpoint);
          
          if (azureClient) {
            // Enhance the prompt with Ghibli style if not already mentioned
            let enhancedPrompt = messageText;
            if (!messageText.toLowerCase().includes('ghibli')) {
              enhancedPrompt = `Create a Studio Ghibli style image of: ${messageText}`;
            }
            
            // Call Azure endpoint
            outputImageUrl = await azureClient.generateImage(enhancedPrompt, inputImageUrl || undefined);
          }
          
          if (!outputImageUrl) {
            throw new Error('Azure API failed to generate image');
          }
        } catch (azureError) {
          console.error('Azure API error:', azureError);
          toast.error('Failed to transform image with Azure. Using placeholder image instead.');
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
      if (user?.id) {
        const { error: insertError } = await supabase
          .from('image_submissions')
          .insert({
            user_id: user.id,
            input_image: inputImageUrl || '',
            input_description: messageText,
            output_image: outputImageUrl,
            status: 'approved', // Changed from 'completed' to 'approved' to match the enum type
            is_public: false
          });
        
        if (insertError) {
          console.error('Error saving submission to database:', insertError);
        }
      }
      
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleImageSubmission };
};
