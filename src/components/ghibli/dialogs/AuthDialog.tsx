
import React from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
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
  );
}
