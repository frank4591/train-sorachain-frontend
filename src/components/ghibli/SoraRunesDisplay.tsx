
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useSoraRunes } from "@/context/SoraRunesContext";
import { DAILY_RUNES_LIMIT } from "@/lib/sora-constants";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function SoraRunesDisplay() {
  const { totalRunes, dailyUsedRunes, isLoading } = useSoraRunes();
  
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-2 w-24" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-lg border border-primary/20">
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 2, 
          repeatType: "loop",
          ease: "easeInOut"
        }}
      >
        <div className="relative flex items-center justify-center h-10 w-10">
          <Star className="h-10 w-10 text-blue-400 absolute" />
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-50"
          />
          <span className="relative text-white font-semibold text-xs">
            {totalRunes}
          </span>
        </div>
      </motion.div>
      
      <div className="flex-1">
        <div className="flex justify-between mb-1 items-center">
          <span className="text-sm font-medium">SoraRunes</span>
          <span className="text-xs font-medium">
            {dailyUsedRunes}/{DAILY_RUNES_LIMIT} used today
          </span>
        </div>
        <Progress 
          value={(dailyUsedRunes / DAILY_RUNES_LIMIT) * 100} 
          className="h-2" 
        />
      </div>
    </div>
  );
}
