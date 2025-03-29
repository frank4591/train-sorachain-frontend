
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Custom hooks
import { useGhibliSession } from "@/hooks/useGhibliSession";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { useShareSubmission } from "@/hooks/useShareSubmission";

// Components
import ChatHistory from "@/components/ghibli/ChatHistory";
import ChatInput from "@/components/ghibli/ChatInput";
import Header from "@/components/ghibli/Header";
import Sidebar from "@/components/ghibli/Sidebar";
import BackgroundAnimation from "@/components/ghibli/BackgroundAnimation";
import ShareDialog from "@/components/ghibli/dialogs/ShareDialog";
import AuthDialog from "@/components/ghibli/dialogs/AuthDialog";

export default function GhibliArt() {
  // Auth and state
  const { isAuthenticated, user } = useAuth();
  const { 
    messages, 
    setMessages, 
    isLoading, 
    setIsLoading, 
    activeSessionId, 
    setActiveSessionId, 
    fetchSessionMessages 
  } = useGhibliSession();
  
  // UI state
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState("sessions");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  
  // Azure configuration - using the new Stable Diffusion endpoint
  const AZURE_ENDPOINT = "https://Stable-Diffusion-3-5-Large-kmkkg.eastus.models.ai.azure.com/images/generations";
  const AZURE_API_KEY = "Z7ok7Kb59E0sbbZUWgabUKe0G0eDnbBW";
  
  // Custom hooks for image generation and sharing
  const { handleImageSubmission } = useImageGeneration({
    messages,
    setMessages,
    setIsLoading,
    setGeneratedImageUrl,
    setShareDialogOpen
  });
  
  const { handleShareSubmission } = useShareSubmission();

  // Handlers
  const downloadImage = (imageUrl: string) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `sora-art-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Image downloaded successfully!");
  };
  
  const handleSubmit = async (messageText: string, imageFile: File | null) => {
    if (isLoading) return;
    
    await handleImageSubmission(
      messageText, 
      imageFile, 
      user, 
      isAuthenticated, 
      setAuthDialogOpen,
      AZURE_ENDPOINT,
      AZURE_API_KEY
    );
  };
  
  const handleShare = async () => {
    await handleShareSubmission(
      generatedImageUrl, 
      user, 
      isAuthenticated, 
      () => setShareDialogOpen(false)
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <BackgroundAnimation />

      <Header 
        showSidebar={showSidebar} 
        setShowSidebar={setShowSidebar} 
        setMobileSheetOpen={setMobileSheetOpen} 
      />

      <div className="flex-1 flex overflow-hidden relative z-1">
        <Sidebar
          showSidebar={showSidebar}
          mobileSheetOpen={mobileSheetOpen}
          setMobileSheetOpen={setMobileSheetOpen}
          activeSidebarTab={activeSidebarTab}
          setActiveSidebarTab={setActiveSidebarTab}
          fetchSessionMessages={fetchSessionMessages}
          activeSessionId={activeSessionId}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden bg-white">
          <ChatHistory 
            messages={messages} 
            isLoading={isLoading} 
            onDownload={downloadImage}
          />
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </main>
      </div>

      <ShareDialog 
        open={shareDialogOpen} 
        onOpenChange={setShareDialogOpen} 
        onShare={handleShare} 
        generatedImageUrl={generatedImageUrl} 
        messages={messages} 
      />
      
      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen} 
      />
    </div>
  );
}
