
import { useState } from "react";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Task } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode, Download, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface ConfigCardProps {
  tasks: Task[];
  className?: string;
}

export default function ConfigCard({ tasks, className }: ConfigCardProps) {
  const { user } = useAuth();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  const tasksWithConfig = tasks.filter(task => task.config);
  
  const toggleExpand = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };
  
  const downloadConfig = (task: Task) => {
    if (!task.config) return;
    
    // In a real app this would download the actual file
    toast.success(`Downloading configuration file: ${task.config}`);
  };
  
  if (tasksWithConfig.length === 0) return null;
  
  return (
    <BlurredCard className={className}>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <FileCode className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-medium">Configuration Files</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Download configuration files for your staked tasks
        </p>
        
        <div className="space-y-3">
          {tasksWithConfig.map((task) => (
            <div 
              key={task.id}
              className="border border-border rounded-lg overflow-hidden"
            >
              <div 
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-muted/50"
                onClick={() => toggleExpand(task.id)}
              >
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Role: {user?.taskRoles[task.id]}
                  </p>
                </div>
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedTaskId === task.id && "rotate-180"
                  )} 
                />
              </div>
              
              <AnimatePresence>
                {expandedTaskId === task.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="p-3 bg-muted/30">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-muted-foreground">Configuration file:</span>
                        <span className="font-mono">{task.config}</span>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full text-xs mt-2"
                        onClick={() => downloadConfig(task)}
                      >
                        <Download className="h-3 w-3 mr-1" /> 
                        Download Config
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </BlurredCard>
  );
}
