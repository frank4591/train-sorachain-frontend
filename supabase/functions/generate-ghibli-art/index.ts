
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { prompt, imageUrl } = await req.json();

    if (!prompt || !imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: prompt and imageUrl are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log("Generating Ghibli style image with prompt:", prompt);
    
    // Simulate a delay for demo purposes
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, you would call the OpenAI API here
    // This is a placeholder that returns a random image
    const randomId = Math.floor(Math.random() * 1000);
    const outputImage = `https://picsum.photos/800/600?random=${randomId}`;

    return new Response(
      JSON.stringify({ 
        outputImage,
        message: "Successfully generated Ghibli-style image"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-ghibli-art function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
