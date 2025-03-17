
import * as React from "react";
import { cn } from "@/lib/utils";

export interface BlurredCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "light" | "medium" | "heavy";
  hover?: boolean;
  children: React.ReactNode;
}

const BlurredCard = React.forwardRef<HTMLDivElement, BlurredCardProps>(
  ({ className, intensity = "medium", hover = true, children, ...props }, ref) => {
    const intensityStyles = {
      light: "bg-white/60 dark:bg-black/30 backdrop-blur-sm",
      medium: "bg-white/70 dark:bg-black/40 backdrop-blur-md",
      heavy: "bg-white/80 dark:bg-black/60 backdrop-blur-lg",
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          intensityStyles[intensity],
          "rounded-2xl shadow-glass border border-white/20 transition-all duration-300",
          hover && "hover:-translate-y-1 hover:shadow-elevated",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BlurredCard.displayName = "BlurredCard";

export { BlurredCard };
