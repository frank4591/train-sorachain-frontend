
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MarqueeBannerProps {
  text: string;
  buttonText: string;
  buttonLink: string;
}

export default function MarqueeBanner({ 
  text, 
  buttonText, 
  buttonLink 
}: MarqueeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    // Pause animation when tab is not visible to improve performance
    const handleVisibilityChange = () => {
      setShouldAnimate(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-primary/10 border-b border-primary/20 relative overflow-hidden py-2 px-4">
      <div className="flex items-center justify-center">
        <div className="overflow-hidden w-full">
          {shouldAnimate ? (
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                x: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              className="whitespace-nowrap flex items-center"
            >
              {Array(5).fill(
                <div className="inline-flex items-center mx-4">
                  <Sparkles className="h-4 w-4 text-primary mr-2 animate-pulse" />
                  <span className="text-sm font-medium">{text}</span>
                  <Sparkles className="h-4 w-4 text-primary ml-2 animate-pulse" />
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-center">
              <span className="text-sm font-medium">{text}</span>
            </div>
          )}
        </div>
        
        <div className="absolute right-16 z-10 flex items-center">
          <Button
            as={Link}
            to={buttonLink}
            size="sm"
            className="animate-pulse hover:animate-none bg-primary/80 hover:bg-primary"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {buttonText}
          </Button>
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-2 text-muted-foreground hover:text-foreground"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
