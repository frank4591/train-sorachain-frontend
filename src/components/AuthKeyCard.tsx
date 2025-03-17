
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, RefreshCw, Key, Terminal } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AuthKeyCardProps {
  className?: string;
}

export default function AuthKeyCard({ className }: AuthKeyCardProps) {
  const { user, generateAuthKey, updateUserData } = useAuth();
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCommand, setShowCommand] = useState(false);
  
  const authKey = user?.authKey || "";
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(authKey);
    setCopied(true);
    toast.success("Authentication key copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const copyCommand = () => {
    const command = `ai-training-client --auth-key "${authKey}" --user-id "${user?.id}"`;
    navigator.clipboard.writeText(command);
    toast.success("Training command copied to clipboard");
  };
  
  const regenerateKey = () => {
    if (!user) return;
    
    const newKey = generateAuthKey();
    updateUserData({ authKey: newKey });
    toast.success("New authentication key generated");
  };
  
  // Function to mask the auth key
  const maskedKey = authKey.replace(/./g, "•");
  
  return (
    <BlurredCard className={cn("overflow-hidden", className)}>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Key className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-medium">Authentication Key</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Use this key to authenticate with training clients and participate in tasks.
          Keep it secret and secure.
        </p>
        
        <div className="relative mb-4">
          <div
            className={cn(
              "bg-muted/50 rounded-md p-3 font-mono text-sm overflow-x-auto whitespace-nowrap",
              "transition-all duration-300 border border-border"
            )}
          >
            {showKey ? authKey : maskedKey}
          </div>
          
          <div className="absolute top-2 right-2 flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-background/80"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
              <span className="sr-only">{showKey ? "Hide" : "Show"} key</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-background/80"
              onClick={copyToClipboard}
            >
              <Copy className={cn("h-3 w-3", copied && "text-green-500")} />
              <span className="sr-only">Copy key</span>
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => setShowCommand(!showCommand)}
          >
            <Terminal className="h-3 w-3 mr-1" />
            {showCommand ? "Hide CLI Command" : "Show CLI Command"}
          </Button>
        </div>
        
        {showCommand && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <div className="bg-black text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto relative">
              <code>ai-training-client --auth-key "{showKey ? authKey : authKey.replace(/./g, "•")}" --user-id "{user?.id}"</code>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full bg-background/10 absolute top-2 right-2"
                onClick={copyCommand}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Last generated: Today
          </p>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={regenerateKey}
          >
            <RefreshCw className="h-3 w-3 mr-1" /> 
            Regenerate
          </Button>
        </div>
      </div>
    </BlurredCard>
  );
}
