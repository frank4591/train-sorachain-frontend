
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader2, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Validation schema for task creation
const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requiredCredits: z.coerce.number().positive("Required credits must be positive"),
  creditReward: z.coerce.number().positive("Credit reward must be positive"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  participationNodeCap: z.coerce.number().positive("Participation cap must be positive"),
  stakingRatio: z.string().min(1, "Staking ratio is required"),
  dailyRewardsPercentage: z.coerce.number().min(0, "Percentage must be non-negative").max(100, "Percentage must be at most 100"),
  category: z.string().min(1, "Category is required"),
  roles: z.array(z.string()).min(1, "At least one role must be selected"),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onTaskCreated: () => void;
}

export const TaskForm = ({ onTaskCreated }: TaskFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      requiredCredits: 100,
      creditReward: 200,
      participationNodeCap: 10,
      stakingRatio: "1:2",
      dailyRewardsPercentage: 5,
      category: "AI Training",
      roles: [],
    }
  });

  // Handle task creation
  const onSubmitTask = async (values: TaskFormValues) => {
    setIsCreatingTask(true);
    
    try {
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      
      if (startDate >= endDate) {
        toast.error("End date must be after start date");
        return;
      }
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("User not authenticated");
        return;
      }
      
      // Insert the task
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: values.title,
          description: values.description,
          required_credits: values.requiredCredits,
          credit_reward: values.creditReward,
          start_date: values.startDate,
          end_date: values.endDate,
          created_by: user.id,
          participation_node_cap: values.participationNodeCap,
          staking_ratio: values.stakingRatio,
          daily_rewards_percentage: values.dailyRewardsPercentage,
          category: values.category
        })
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Insert task roles
        const rolesPromises = values.roles.map(role => 
          supabase
            .from('task_available_roles')
            .insert({
              task_id: data.id,
              role: role as UserRole
            })
        );
        
        await Promise.all(rolesPromises);
        
        toast.success("Task created successfully");
        onTaskCreated();
        setDialogOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setIsCreatingTask(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Create a new task for users to participate in. Fill in all the details to create a complete task.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitTask)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed task description..." 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="requiredCredits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Credits</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Credits required to participate
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="creditReward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Reward</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Credits earned upon completion
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="participationNodeCap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participation Node Cap</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum number of nodes allowed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stakingRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staking Ratio</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1:2" {...field} />
                    </FormControl>
                    <FormDescription>
                      Input:Output ratio (1:2 means double reward)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dailyRewardsPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Rewards Percentage</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Daily rewards as percentage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AI Training">AI Training</SelectItem>
                        <SelectItem value="Model Validation">Model Validation</SelectItem>
                        <SelectItem value="Data Aggregation">Data Aggregation</SelectItem>
                        <SelectItem value="Compute Delegation">Compute Delegation</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Available Roles</FormLabel>
                    <FormDescription>
                      Select which roles can participate in this task
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {['client', 'delegator', 'validator', 'aggregator'].map((role) => (
                      <FormField
                        key={role}
                        control={form.control}
                        name="roles"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={role}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, role])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== role
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal capitalize">
                                {role}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingTask}>
                {isCreatingTask ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Task
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
