
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RUNES_PER_SUBMISSION } from "@/lib/sora-constants";
import { Message } from "@/components/ghibli/ChatHistory";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: () => void;
  generatedImageUrl: string | null;
  messages: Message[];
}

export default function ShareDialog({ open, onOpenChange, onShare, generatedImageUrl, messages }: ShareDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
            className="border-violet-700 text-violet-200 hover:bg-violet-800/30"
          >
            No Thanks
          </Button>
          <Button 
            onClick={onShare}
            className="bg-violet-700 hover:bg-violet-600 text-white"
          >
            Yes, Share & Earn SoraRunes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
