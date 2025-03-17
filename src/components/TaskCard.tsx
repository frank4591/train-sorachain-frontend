
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Task, UserRole } from "@/lib/constants";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, CheckCircle, Clock, AlertCircle, Download, Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskCardProps {
  task: Task;
  className?: string;
}

export default function TaskCard({ task, className }: TaskCardProps) {
  const { user, updateUserData } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    user?.taskRoles[task.id] || null
  );
  
  const isStaked = user?.stakedTasks.includes(task.id) || false;
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
  
  const handleStake = () => {
    if (!user) return;
    
    if (!selectedRole) {
      toast.error("Please select a role for this task");
      return;
    }
    
    if (!hasEnoughCredits) {
      toast.error(`Not enough credits. Required: ${task.requiredCredits}`);
      return;
    }
    
    const newCredits = user.credits - task.requiredCredits;
    const newStakedTasks = [...user.stakedTasks, task.id];
    const newTaskRoles = { ...user.taskRoles, [task.id]: selectedRole };
    
    updateUserData({
      credits: newCredits,
      stakedTasks: newStakedTasks,
      taskRoles: newTaskRoles
    });
    
    toast.success(`Successfully staked for task as ${selectedRole}`);
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
            {isStaked && (
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
              <div className="flex-1 mr-3">
                <Select 
                  value={selectedRole || undefined} 
                  onValueChange={(value) => setSelectedRole(value as UserRole)}
                >
                  <SelectTrigger className="w-full text-xs h-9">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {task.availableRoles.map((role) => (
                      <SelectItem key={role} value={role} className="capitalize">
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Staked on {new Date().toLocaleDateString()}</span>
              </div>
            )}
            
            <Button 
              size="sm"
              disabled={isStaked || !hasEnoughCredits || !selectedRole}
              onClick={handleStake}
            >
              {isStaked ? "Staked" : "Stake Credits"}
            </Button>
          </div>
        </div>
      </BlurredCard>
    </motion.div>
  );
}
