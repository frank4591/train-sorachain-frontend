
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Progress } from "@/components/ui/progress";
import { CREDIT_ACTIONS } from "@/lib/constants";
import { ArrowRight, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface CreditDisplayProps {
  className?: string;
}

export default function CreditDisplay({ className }: CreditDisplayProps) {
  const { user, updateUserData } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const credits = user?.credits || 0;
  
  // Animation for credit count
  const [displayedCredits, setDisplayedCredits] = useState(credits);
  
  useEffect(() => {
    let start = displayedCredits;
    const end = credits;
    const duration = 1000; // 1 second
    const startTime = Date.now();
    
    const updateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = Math.floor(start + (end - start) * progress);
      setDisplayedCredits(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    updateCount();
  }, [credits]);
  
  const claimCredits = (action: typeof CREDIT_ACTIONS[number]) => {
    if (!user) return;
    
    // In a real app, this would verify the action was completed
    updateUserData({ credits: user.credits + action.creditReward });
    toast.success(`Earned ${action.creditReward} credits for ${action.name}`);
  };
  
  return (
    <div className={className}>
      <BlurredCard className="overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-medium">Credit Balance</h3>
              <p className="text-3xl font-bold mt-1">{displayedCredits}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(!showActions)}
              className="text-xs"
            >
              {showActions ? "Hide ways to earn" : "Ways to earn"}
              <ArrowRight className={cn(
                "ml-1 h-3 w-3 transition-transform duration-300",
                showActions && "rotate-90"
              )} />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
              <Progress value={(credits / 1000) * 100} className="h-2" />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{credits} credits available</span>
              <span>1000 credits total</span>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-border"
            >
              <div className="p-4 space-y-3">
                <h4 className="text-sm font-medium mb-2">Earn more credits</h4>
                {CREDIT_ACTIONS.map((action) => (
                  <div key={action.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">{action.name}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => claimCredits(action)}>
                      <Plus className="h-3 w-3 mr-1" />
                      {action.creditReward}
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </BlurredCard>
    </div>
  );
}
