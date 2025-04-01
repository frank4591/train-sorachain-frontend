
// Azure Vision API Integration
import { toast } from "sonner";

interface AzureVisionOptions {
  apiKey: string;
  endpoint: string;
}

// This client is kept as a stub for future AI vision capabilities,
// but we're removing the image generation functionality as requested
export class AzureVisionClient {
  private apiKey: string;
  private endpoint: string;

  constructor(options: AzureVisionOptions) {
    this.apiKey = options.apiKey;
    this.endpoint = options.endpoint;
  }

  // Placeholder for any future vision API capabilities
  // Current image generation functionality has been removed
}

// Factory function maintained for backward compatibility
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
