
// Azure Vision API Integration
import { toast } from "sonner";

interface AzureVisionOptions {
  apiKey: string;
  endpoint: string;
}

interface ImageGenerationRequest {
  prompt: string;
  num_images?: number;
  size?: string;
  init_image?: string;
}

interface ImageGenerationResponse {
  created?: number;
  data?: {
    url?: string;
    revised_prompt?: string;
  }[];
  error?: {
    message: string;
    code: string;
  };
}

export class AzureVisionClient {
  private apiKey: string;
  private endpoint: string;

  constructor(options: AzureVisionOptions) {
    this.apiKey = options.apiKey;
    this.endpoint = options.endpoint;
  }

  async generateImage(prompt: string, imageBase64?: string): Promise<string | null> {
    try {
      if (!this.apiKey || !this.endpoint) {
        console.error('Azure API key or endpoint not configured');
        toast.error('Azure credentials are not properly configured');
        return null;
      }

      console.log('Calling Azure Stable Diffusion API with prompt:', prompt);
      
      // Prepare request body
      const requestBody: ImageGenerationRequest = {
        prompt,
        num_images: 1,
        size: "1024x1024"
      };
      
      // Add the image if provided (base64 format)
      if (imageBase64) {
        console.log('Including reference image in request');
        // Extract the base64 data from the dataURL format
        const base64Data = imageBase64.split(',')[1];
        if (base64Data) {
          requestBody.init_image = base64Data;
        }
      }

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Azure API error: ${response.status} - ${errorText}`);
        toast.error(`Failed to generate image: ${response.statusText}`);
        throw new Error(`Azure API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as ImageGenerationResponse;
      
      if (data.error) {
        console.error(`Azure API error: ${data.error.code} - ${data.error.message}`);
        toast.error(`Azure API error: ${data.error.message}`);
        throw new Error(`Azure API error: ${data.error.code} - ${data.error.message}`);
      }
      
      // Extract the URL from the response format
      const imageUrl = data.data?.[0]?.url;
      
      if (!imageUrl) {
        toast.error('No image URL in response');
        return null;
      }
      
      toast.success('Image successfully generated!');
      return imageUrl;
    } catch (error) {
      console.error('Error calling Azure Stable Diffusion API:', error);
      toast.error('Failed to generate image: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return null;
    }
  }
}

// Create a factory function to get the Azure client
export function getAzureVisionClient(apiKey?: string, endpoint?: string): AzureVisionClient | null {
  if (!apiKey || !endpoint) {
    console.warn('Azure Vision client not initialized: missing API key or endpoint');
    return null;
  }
  
  return new AzureVisionClient({
    apiKey,
    endpoint
  });
}
