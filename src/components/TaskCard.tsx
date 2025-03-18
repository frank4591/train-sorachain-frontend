
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Task, UserRole } from "@/lib/constants";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, CheckCircle, Clock, AlertCircle, Download, Shield } from "lucide-react";
import StakeTaskDialog from "@/components/StakeTaskDialog";

interface TaskCardProps {
  task: Task;
  className?: string;
  onRefresh?: () => void;
}

export default function TaskCard({ task, className, onRefresh }: TaskCardProps) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [stakeDialogOpen, setStakeDialogOpen] = useState(false);
  const [isStaked, setIsStaked] = useState(false);
  
  useEffect(() => {
    // Check if the task is staked whenever user data changes
    if (user) {
      setIsStaked(user.stakedTasks.includes(task.id));
    }
  }, [user, task.id]);
  
  const hasEnoughCredits = (user?.credits || 0) >= task.requiredCredits;
  
  const statusColors = {
    "available": "text-green-500",
    "in_progress": "text-blue-500",
    "completed": "text-purple-500",
    "failed": "text-red-500"
  };
  
  const statusIcons = {
    "available": <CheckCircle className="h-4 w-4" />,
    "in_progress": <Clock className="h-4 w-4" />,
    "completed": <CheckCircle className="h-4 w-4" />,
    "failed": <AlertCircle className="h-4 w-4" />
  };
  
  const handleStakeSuccess = () => {
    setIsStaked(true);
    // Call the parent refresh callback if provided
    if (onRefresh) {
      onRefresh();
    }
  };
  
  const downloadConfig = () => {
    if (!task.config) {
      toast.error("No configuration file available for this task");
      return;
    }
    
    // In a real app, this would download the actual file
    toast.success(`Downloading configuration: ${task.config}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <BlurredCard 
        className={cn(
          "overflow-hidden transition-all duration-300",
          isStaked && "border-primary/50"
        )}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className={cn("text-xs font-medium", statusColors[task.status])}>
                  {task.status.replace("_", " ").toUpperCase()}
                </span>
                <span className={cn("", statusColors[task.status])}>
                  {statusIcons[task.status]}
                </span>
              </div>
              <h3 className="text-lg font-medium">{task.title}</h3>
            </div>
            {isStaked && user?.taskRoles[task.id] && (
              <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                <span>Staked as {user?.taskRoles[task.id]}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className="text-muted-foreground mr-1">Required:</span>
                <span className="font-medium">{task.requiredCredits} credits</span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-1">Reward:</span>
                <span className="font-medium">{task.creditReward} credits</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className="text-muted-foreground mr-1">Roles:</span>
                <span className="font-medium capitalize">{task.availableRoles.join(", ")}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs -mr-2"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Less details" : "More details"}
                <ArrowRight className={cn(
                  "ml-1 h-3 w-3 transition-transform duration-300",
                  expanded && "rotate-90"
                )} />
              </Button>
            </div>
            
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-2"
              >
                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Start: {task.startDate}</span>
                  <span>End: {task.endDate}</span>
                </div>
                
                {isStaked && task.config && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={downloadConfig}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download Configuration
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-muted/30 border-t border-border">
          <div className="flex justify-between items-center">
            {!isStaked ? (
              <div className="text-xs text-muted-foreground">
                {task.availableRoles.length} roles available
              </div>
            ) : (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Staked on {new Date().toLocaleDateString()}</span>
              </div>
            )}
            
            <Button 
              size="sm"
              onClick={() => setStakeDialogOpen(true)}
              disabled={isStaked || !hasEnoughCredits}
            >
              {isStaked ? "Staked" : "Stake Credits"}
            </Button>
          </div>
        </div>
      </BlurredCard>
      
      <StakeTaskDialog 
        task={task}
        open={stakeDialogOpen}
        onOpenChange={setStakeDialogOpen}
        onStakeSuccess={handleStakeSuccess}
      />
    </motion.div>
  );
}
