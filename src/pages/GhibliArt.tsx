
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useSoraRunes } from "@/context/SoraRunesContext";
import { RUNES_PER_SUBMISSION } from "@/lib/sora-constants";
import { toast } from "sonner";
import { 
  PanelLeftOpen, 
  PanelLeftClose,
  LayoutList,
  Users,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatHistory, { Message } from "@/components/ghibli/ChatHistory";
import ChatInput from "@/components/ghibli/ChatInput";
import SessionsList from "@/components/ghibli/SessionsList";
import SoraRunesDisplay from "@/components/ghibli/SoraRunesDisplay";
import LeaderboardPanel from "@/components/ghibli/LeaderboardPanel";
import { Link } from "react-router-dom";

export default function GhibliArt() {
  const { isAuthenticated, user } = useAuth();
  const { useRunes, incrementRunes } = useSoraRunes();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState("sessions");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  
  const fetchSessionMessages = useCallback(async (sessionId: string) => {
    if (!isAuthenticated) return;
    
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
  }, [isAuthenticated]);
  
  const handleSubmit = async (messageText: string, imageFile: File | null) => {
    if (isLoading) return;
    
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
      
      // Upload image to Supabase Storage
      const imagePath = `ghibli-art/${user?.id}/${Date.now()}-${imageFile.name}`;
      
      // For demo purposes, we'll use a direct URL instead of actually uploading
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
          // In a real app, call the OpenAI API via Supabase Edge Function
          // For demo purposes, we'll simulate a delay and return a random image
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const randomId = Math.floor(Math.random() * 1000);
          const outputImageUrl = `https://picsum.photos/800/600?random=${randomId}`;
          
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
  
  const handleShareSubmission = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const { error } = await supabase
        .from('image_submissions')
        .update({ is_public: true })
        .eq('user_id', user.id)
        .eq('output_image', generatedImageUrl);
      
      if (error) throw error;
      
      await incrementRunes(RUNES_PER_SUBMISSION);
      toast.success(`Thank you! You earned ${RUNES_PER_SUBMISSION} SoraRunes`);
      
    } catch (error) {
      console.error('Error sharing submission:', error);
      toast.error('Failed to share submission');
    } finally {
      setShareDialogOpen(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-background z-10">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <div className="mr-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
          </div>
          
          <div className="flex-1">
            <h1 className="text-xl font-bold">Ghibli SoraNet</h1>
            <p className="text-sm text-muted-foreground">
              Transform your images into Ghibli-style masterpieces
            </p>
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileSheetOpen(true)}
            >
              <LayoutList className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeftOpen className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop */}
        {showSidebar && (
          <aside className="hidden md:flex md:w-80 lg:w-96 flex-col border-r bg-muted/40">
            <Tabs
              defaultValue="sessions"
              value={activeSidebarTab}
              onValueChange={setActiveSidebarTab}
              className="flex-1 flex flex-col"
            >
              <div className="border-b px-4 py-2">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="sessions" className="flex gap-1">
                    <LayoutList className="h-4 w-4" />
                    <span>Sessions</span>
                  </TabsTrigger>
                  <TabsTrigger value="leaderboard" className="flex gap-1">
                    <Users className="h-4 w-4" />
                    <span>Leaderboard</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-4">
                <SoraRunesDisplay />
              </div>
              
              <TabsContent value="sessions" className="flex-1 flex flex-col mt-0">
                <SessionsList 
                  onSelectSession={fetchSessionMessages}
                  activeSessionId={activeSessionId}
                />
              </TabsContent>
              
              <TabsContent value="leaderboard" className="flex-1 overflow-auto p-4 mt-0">
                <LeaderboardPanel />
              </TabsContent>
            </Tabs>
          </aside>
        )}
        
        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatHistory messages={messages} isLoading={isLoading} />
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </main>
        
        {/* Mobile Sheet */}
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-col">
            <Tabs
              defaultValue="sessions"
              value={activeSidebarTab}
              onValueChange={setActiveSidebarTab}
              className="flex-1 flex flex-col"
            >
              <div className="border-b px-4 py-2">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="sessions" className="flex gap-1">
                    <LayoutList className="h-4 w-4" />
                    <span>Sessions</span>
                  </TabsTrigger>
                  <TabsTrigger value="leaderboard" className="flex gap-1">
                    <Users className="h-4 w-4" />
                    <span>Leaderboard</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-4">
                <SoraRunesDisplay />
              </div>
              
              <TabsContent value="sessions" className="flex-1 flex flex-col mt-0">
                <SessionsList 
                  onSelectSession={(id) => {
                    fetchSessionMessages(id);
                    setMobileSheetOpen(false);
                  }}
                  activeSessionId={activeSessionId}
                />
              </TabsContent>
              
              <TabsContent value="leaderboard" className="flex-1 overflow-auto p-4 mt-0">
                <LeaderboardPanel />
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contribute to SoraChain</DialogTitle>
            <DialogDescription>
              Would you like to share your image to help train future models?
              Your contribution will earn you {RUNES_PER_SUBMISSION} SoraRunes!
            </DialogDescription>
          </DialogHeader>
          
          {generatedImageUrl && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex flex-col items-center">
                <img 
                  src={messages.find(m => m.inputImage)?.inputImage || ''} 
                  alt="Original" 
                  className="rounded-md max-h-32 object-contain mb-2" 
                />
                <span className="text-xs text-muted-foreground">Original</span>
              </div>
              <div className="flex flex-col items-center">
                <img 
                  src={generatedImageUrl} 
                  alt="Generated" 
                  className="rounded-md max-h-32 object-contain mb-2" 
                />
                <span className="text-xs text-muted-foreground">Generated</span>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              No Thanks
            </Button>
            <Button onClick={handleShareSubmission}>
              Yes, Share & Earn SoraRunes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Auth Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to log in to use this feature and track your SoraRunes.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setAuthDialogOpen(false)}>
              Cancel
            </Button>
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
