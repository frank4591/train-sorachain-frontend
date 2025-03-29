
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
  Download,
  User,
  Settings,
  LogOut
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatHistory, { Message } from "@/components/ghibli/ChatHistory";
import ChatInput from "@/components/ghibli/ChatInput";
import SessionsList from "@/components/ghibli/SessionsList";
import SoraRunesDisplay from "@/components/ghibli/SoraRunesDisplay";
import LeaderboardPanel from "@/components/ghibli/LeaderboardPanel";
import { Link, useNavigate } from "react-router-dom";

// Azure credentials (in a real app, these would come from environment variables)
const AZURE_ENDPOINT = "YOUR_AZURE_ENDPOINT";
const AZURE_API_KEY = "YOUR_AZURE_API_KEY";

export default function GhibliArt() {
  const { isAuthenticated, user, logout } = useAuth();
  const { useRunes, incrementRunes } = useSoraRunes();
  const navigate = useNavigate();
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

  const downloadImage = (imageUrl: string) => {
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `ghibli-art-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Image downloaded successfully!");
  };
  
  const callAzureEndpoint = async (imageData: string, prompt: string) => {
    try {
      // This is a placeholder for Azure API call
      // In a real app, you'd call your Supabase Edge Function which would handle the Azure API call
      
      const response = await fetch(`${AZURE_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_API_KEY
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
          // For actual implementation, use the Azure API
          // For demo purposes, we'll simulate a delay and return a random image
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          let outputImageUrl;
          
          try {
            // Try to call Azure endpoint (commented out for now)
            // outputImageUrl = await callAzureEndpoint(imageUrl, messageText || 'Transform this image in Ghibli style');
            
            // For demo, use a placeholder
            const randomId = Math.floor(Math.random() * 1000);
            outputImageUrl = `https://picsum.photos/800/600?random=${randomId}`;
          } catch (azureError) {
            console.error('Azure API error:', azureError);
            // Fallback to random image
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
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#121826] to-[#1c1f2e] animate-gradient-y">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="border-b border-violet-800/20 bg-black/20 backdrop-blur-sm z-10">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <div className="flex items-center gap-2 mr-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-violet-200 hover:text-white hover:bg-violet-900/30"
            >
              {showSidebar ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeftOpen className="h-5 w-5" />
              )}
            </Button>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-pink-300">
              Ghibli SoraNet
            </h1>
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-violet-200/70">
              Transform your images into Ghibli-style masterpieces
            </p>
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileSheetOpen(true)}
              className="text-violet-200 hover:text-white hover:bg-violet-900/30"
            >
              <LayoutList className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full h-9 w-9 p-0 border border-violet-700/50 hover:bg-violet-900/30 text-violet-300"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-violet-800 text-violet-200">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#1a1d2d] border-violet-800/50 text-violet-200">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-violet-800/50" />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-violet-800/30 focus:bg-violet-800/30 cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-violet-800/30 focus:bg-violet-800/30 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-violet-800/50" />
                  <DropdownMenuItem 
                    onClick={() => logout()} 
                    className="text-pink-300 hover:bg-violet-800/30 focus:bg-violet-800/30 hover:text-pink-200 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                size="sm" 
                variant="ghost"
                className="text-violet-200 hover:text-white border border-violet-700/50 hover:bg-violet-900/30"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-1">
        {/* Sidebar - Desktop */}
        {showSidebar && (
          <aside className="hidden md:flex md:w-80 lg:w-96 flex-col border-r border-violet-800/20 bg-black/10 backdrop-blur-sm animate-fade-in-right">
            <Tabs
              defaultValue="sessions"
              value={activeSidebarTab}
              onValueChange={setActiveSidebarTab}
              className="flex-1 flex flex-col"
            >
              <div className="border-b border-violet-800/20 px-4 py-2">
                <TabsList className="w-full grid grid-cols-2 bg-violet-900/20">
                  <TabsTrigger value="sessions" className="flex gap-1 data-[state=active]:bg-violet-700/50 text-violet-200">
                    <LayoutList className="h-4 w-4" />
                    <span>Sessions</span>
                  </TabsTrigger>
                  <TabsTrigger value="leaderboard" className="flex gap-1 data-[state=active]:bg-violet-700/50 text-violet-200">
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
        <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-transparent to-black/20">
          <ChatHistory 
            messages={messages} 
            isLoading={isLoading} 
            onDownload={downloadImage}
          />
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </main>
        
        {/* Mobile Sheet */}
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetContent 
            side="left" 
            className="w-full sm:max-w-md p-0 flex flex-col bg-[#121826] border-violet-800/30"
          >
            <Tabs
              defaultValue="sessions"
              value={activeSidebarTab}
              onValueChange={setActiveSidebarTab}
              className="flex-1 flex flex-col"
            >
              <div className="border-b border-violet-800/20 px-4 py-2">
                <TabsList className="w-full grid grid-cols-2 bg-violet-900/20">
                  <TabsTrigger value="sessions" className="flex gap-1 data-[state=active]:bg-violet-700/50 text-violet-200">
                    <LayoutList className="h-4 w-4" />
                    <span>Sessions</span>
                  </TabsTrigger>
                  <TabsTrigger value="leaderboard" className="flex gap-1 data-[state=active]:bg-violet-700/50 text-violet-200">
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
        <DialogContent className="sm:max-w-md bg-[#1a1d2d] border-violet-800/50 text-violet-200">
          <DialogHeader>
            <DialogTitle>Contribute to SoraChain</DialogTitle>
            <DialogDescription className="text-violet-300/70">
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
                <span className="text-xs text-violet-400">Original</span>
              </div>
              <div className="flex flex-col items-center">
                <img 
                  src={generatedImageUrl} 
                  alt="Generated" 
                  className="rounded-md max-h-32 object-contain mb-2" 
                />
                <span className="text-xs text-violet-400">Generated</span>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShareDialogOpen(false)}
              className="border-violet-700 text-violet-200 hover:bg-violet-800/30"
            >
              No Thanks
            </Button>
            <Button 
              onClick={handleShareSubmission}
              className="bg-violet-700 hover:bg-violet-600 text-white"
            >
              Yes, Share & Earn SoraRunes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Auth Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md bg-[#1a1d2d] border-violet-800/50 text-violet-200">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription className="text-violet-300/70">
              You need to log in to use this feature and track your SoraRunes.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setAuthDialogOpen(false)}
              className="border-violet-700 text-violet-200 hover:bg-violet-800/30"
            >
              Cancel
            </Button>
            <Button 
              asChild
              className="bg-violet-700 hover:bg-violet-600 text-white"
            >
              <Link to="/login" state={{ from: "/ghibli-art" }}>Sign In</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stylesheet for animations */}
      <style>
        {`
          @keyframes gradient-y {
            0% { background-position: 50% 0%; }
            50% { background-position: 50% 100%; }
            100% { background-position: 50% 0%; }
          }
          
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          
          @keyframes fade-in-right {
            0% { opacity: 0; transform: translateX(-10px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          
          .animate-blob {
            animation: blob 7s infinite ease-in-out;
          }
          
          .animate-gradient-y {
            animation: gradient-y 15s ease infinite;
            background-size: 100% 200%;
          }
          
          .animate-fade-in-right {
            animation: fade-in-right 0.3s ease-out forwards;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}
      </style>
    </div>
  );
}
