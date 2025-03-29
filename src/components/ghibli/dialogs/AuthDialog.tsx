
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1a243a] border-[#29647c]/50 text-[#CDF683]">
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription className="text-[#CDF683]/70">
            You need to log in to use this feature and track your SoraRunes.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-[#29647c] text-[#CDF683] hover:bg-[#29647c]/30"
          >
            Cancel
          </Button>
          <Button 
            asChild
            className="bg-[#29647c] hover:bg-[#29647c]/80 text-white"
          >
            <Link to="/login" state={{ from: currentPath }}>Sign In</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
