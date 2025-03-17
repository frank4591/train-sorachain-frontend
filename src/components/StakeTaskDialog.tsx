
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Task, UserRole } from "@/lib/constants";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Coins, Cpu, Server, ShieldCheck, Download } from "lucide-react";

interface StakeTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StakeTaskDialog({ task, open, onOpenChange }: StakeTaskDialogProps) {
  const { user, updateUserData } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const hasEnoughCredits = (user?.credits || 0) >= task.requiredCredits;
  
  const roleIcons = {
    client: <Cpu className="h-5 w-5" />,
    delegator: <Server className="h-5 w-5" />,
    validator: <ShieldCheck className="h-5 w-5" />,
    aggregator: <Coins className="h-5 w-5" />,
  };
  
  const handleStake = async () => {
    if (!user || !selectedRole) return;
    
    if (!hasEnoughCredits) {
      toast.error(`Not enough credits. Required: ${task.requiredCredits}`);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newCredits = user.credits - task.requiredCredits;
      const newStakedTasks = [...user.stakedTasks, task.id];
      const newTaskRoles = { ...user.taskRoles, [task.id]: selectedRole };
      
      updateUserData({
        credits: newCredits,
        stakedTasks: newStakedTasks,
        taskRoles: newTaskRoles
      });
      
      toast.success(`Successfully staked for task as ${selectedRole}`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to stake for task. Please try again.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>
            Select a role for this task and stake your credits
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Required Credits:</span>
              <span className={hasEnoughCredits ? "font-medium" : "text-destructive font-medium"}>
                {task.requiredCredits} credits
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Your Credits:</span>
              <span className="font-medium">{user?.credits || 0} credits</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-base">Choose your role:</Label>
            <RadioGroup
              value={selectedRole || ""}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              className="mt-2 space-y-2"
            >
              {task.availableRoles.map((role) => (
                <div
                  key={role}
                  className="flex items-start space-x-3 border border-border p-3 rounded-md hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedRole(role)}
                >
                  <RadioGroupItem value={role} id={`role-${role}`} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Label htmlFor={`role-${role}`} className="font-medium capitalize cursor-pointer">
                        {role}
                      </Label>
                      <div className="ml-2 text-primary">{roleIcons[role]}</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {role === "client" && "Access models and make predictions"}
                      {role === "delegator" && "Delegate compute resources to the network"}
                      {role === "validator" && "Validate model training and results"}
                      {role === "aggregator" && "Aggregate and process model weights"}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <span>Staking requirement: {task.requiredCredits} credits</span>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleStake}
            disabled={!selectedRole || !hasEnoughCredits || isProcessing}
          >
            {isProcessing ? (
              <>Staking...</>
            ) : (
              <>Stake {task.requiredCredits} Credits</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
