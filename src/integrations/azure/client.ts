
// Azure Vision API Integration
import { toast } from "sonner";

interface AzureVisionOptions {
  apiKey: string;
  endpoint: string;
}

interface ImageGenerationRequest {
  prompt: string;
  image: string; // Base64 encoded image
}

interface ImageGenerationResponse {
  output_url?: string;
  result?: string;
  image_url?: string;
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

  async generateImage(prompt: string, imageBase64: string): Promise<string | null> {
    try {
      if (!this.apiKey || !this.endpoint) {
        console.error('Azure API key or endpoint not configured');
        toast.error('Azure credentials are not properly configured');
        return null;
      }

      // Extract the base64 content without the data URL prefix if present
      const base64Data = imageBase64.includes('base64,') 
        ? imageBase64.split('base64,')[1] 
        : imageBase64;

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify({
          prompt,
          image: base64Data
        } as ImageGenerationRequest)
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
      
      // Return the URL to the generated image (considering different response formats)
      const imageUrl = data.output_url || data.result || data.image_url;
      
      if (!imageUrl) {
        toast.error('No image URL in response');
        return null;
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Error calling Azure Vision API:', error);
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
