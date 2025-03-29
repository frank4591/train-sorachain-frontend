
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface MarqueeBannerProps {
  text: string;
  actionText?: string;
  actionUrl?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function MarqueeBanner({
  text = 'Try our newest product of our ecosystem, "Generate Ghibli Art"',
  actionText = 'Generate Art',
  actionUrl = '/ghibli-art',
  autoClose = false,
  autoCloseDelay = 7000,
}: MarqueeBannerProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [hasBeenSeen, setHasBeenSeen] = useState(() => {
    const stored = localStorage.getItem('ghibliMarqueeSeen');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    if (hasBeenSeen) {
      setIsVisible(false);
    } else if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem('ghibliMarqueeSeen', JSON.stringify(true));
        setHasBeenSeen(true);
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, hasBeenSeen]);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white py-2 overflow-hidden">
      <div className="absolute inset-0 flex items-center">
        <div className="marquee-content w-full whitespace-nowrap overflow-hidden">
          <div className="animate-marquee inline-block">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="mx-4">★ {text} ★</span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative flex justify-between items-center">
        <div className="w-2/3"></div> {/* Spacer */}
        
        <div className="flex justify-end items-center py-1 z-10">
          <Button 
            variant="secondary" 
            size="sm" 
            className="animate-pulse bg-white text-purple-700 hover:bg-gray-100 font-medium"
            onClick={() => navigate(actionUrl)}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {actionText}
          </Button>
        </div>
      </div>
      
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}
      </style>
    </div>
  );
}

export default MarqueeBanner;
