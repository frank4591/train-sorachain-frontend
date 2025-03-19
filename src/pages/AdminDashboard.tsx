
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, UserRole } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  Calendar,
  Users,
  BarChart,
  Clock,
  Loader2,
  Save,
  X,
  FileCode,
  AlertCircle,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlurredCard } from "@/components/ui/blurred-card";
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

type TaskFormValues = z.infer<typeof taskSchema>;

// Validation schema for configuration file
const configFileSchema = z.object({
  fileName: z.string().min(1, "Filename is required"),
  fileContent: z.string().min(1, "File content is required"),
  cliCommand: z.string().optional(),
  taskId: z.string().min(1, "Task ID is required"),
});

type ConfigFileFormValues = z.infer<typeof configFileSchema>;

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [configFiles, setConfigFiles] = useState<any[]>([]);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isCreatingConfig, setIsCreatingConfig] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  
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

  const configForm = useForm<ConfigFileFormValues>({
    resolver: zodResolver(configFileSchema),
    defaultValues: {
      fileName: "",
      fileContent: "",
      cliCommand: "",
      taskId: "",
    }
  });

  // Load tasks when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchConfigFiles();
    }
  }, [isAuthenticated]);

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_available_roles(role)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    }
  };

  // Fetch config files from Supabase
  const fetchConfigFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('configuration_files')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setConfigFiles(data);
      }
    } catch (error) {
      console.error("Error fetching config files:", error);
      toast.error("Failed to load configuration files");
    }
  };

  // Handle task creation
  const onSubmitTask = async (values: TaskFormValues) => {
    if (!user) return;
    
    setIsCreatingTask(true);
    
    try {
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      
      if (startDate >= endDate) {
        toast.error("End date must be after start date");
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
        fetchTasks();
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

  // Handle config file creation
  const onSubmitConfigFile = async (values: ConfigFileFormValues) => {
    if (!user) return;
    
    setIsCreatingConfig(true);
    
    try {
      // Insert the config file
      const { data, error } = await supabase
        .from('configuration_files')
        .insert({
          task_id: values.taskId,
          file_name: values.fileName,
          file_content: values.fileContent,
          cli_command: values.cliCommand || null
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update the task with the config file reference
      if (data) {
        await supabase
          .from('tasks')
          .update({
            config_file: data.file_name
          })
          .eq('id', values.taskId);
        
        toast.success("Configuration file created successfully");
        fetchConfigFiles();
        setConfigDialogOpen(false);
        configForm.reset();
      }
    } catch (error) {
      console.error("Error creating configuration file:", error);
      toast.error("Failed to create configuration file");
    } finally {
      setIsCreatingConfig(false);
    }
  };

  // If the user is not an admin, redirect or show access denied
  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BlurredCard className="w-full max-w-md">
          <div className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </BlurredCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage tasks, configuration files, and user roles
            </p>
          </div>
          
          <div className="flex space-x-3">
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
            
            <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileCode className="mr-2 h-4 w-4" />
                  Add Config File
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Configuration File</DialogTitle>
                  <DialogDescription>
                    Add a configuration file to a task. This will be available to users who have staked for the task.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...configForm}>
                  <form onSubmit={configForm.handleSubmit(onSubmitConfigFile)} className="space-y-6">
                    <FormField
                      control={configForm.control}
                      name="taskId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedTaskId(value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a task" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tasks.map((task) => (
                                <SelectItem key={task.id} value={task.id}>
                                  {task.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={configForm.control}
                      name="fileName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>File Name</FormLabel>
                          <FormControl>
                            <Input placeholder="config.yaml" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={configForm.control}
                      name="fileContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>File Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="# Configuration content..." 
                              className="min-h-32 font-mono"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={configForm.control}
                      name="cliCommand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CLI Command (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="python run.py --config config.yaml" {...field} />
                          </FormControl>
                          <FormDescription>
                            Command to run with this configuration
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button variant="outline" type="button" onClick={() => setConfigDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isCreatingConfig}>
                        {isCreatingConfig ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Add Configuration
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
        
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="configs">Config Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks">
            <div className="grid grid-cols-1 gap-6">
              {tasks.length === 0 ? (
                <BlurredCard>
                  <div className="p-8 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Tasks Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first task to start contributing to the network.
                    </p>
                    <Button onClick={() => setDialogOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Task
                    </Button>
                  </div>
                </BlurredCard>
              ) : (
                tasks.map((task) => (
                  <BlurredCard key={task.id}>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-medium">{task.title}</h3>
                          <p className="text-muted-foreground">{task.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                            task.status === 'available' 
                              ? 'bg-green-500/10 text-green-500' 
                              : task.status === 'in_progress'
                              ? 'bg-blue-500/10 text-blue-500'
                              : task.status === 'completed'
                              ? 'bg-purple-500/10 text-purple-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="mb-6 line-clamp-2">{task.description}</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Required Credits</p>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{task.required_credits}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Reward</p>
                          <div className="flex items-center">
                            <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{task.credit_reward}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{new Date(task.start_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">End Date</p>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{new Date(task.end_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-muted pt-4">
                        <p className="text-xs text-muted-foreground mb-2">Available Roles</p>
                        <div className="flex flex-wrap gap-2">
                          {task.task_available_roles.map((role: any, index: number) => (
                            <span 
                              key={index}
                              className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs capitalize"
                            >
                              {role.role}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {!task.config_file && (
                        <div className="mt-4 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedTaskId(task.id);
                              configForm.setValue('taskId', task.id);
                              setConfigDialogOpen(true);
                            }}
                          >
                            <FileCode className="mr-2 h-4 w-4" />
                            Add Config
                          </Button>
                        </div>
                      )}
                    </div>
                  </BlurredCard>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="configs">
            <div className="grid grid-cols-1 gap-6">
              {configFiles.length === 0 ? (
                <BlurredCard>
                  <div className="p-8 text-center">
                    <FileCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Configuration Files Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Add configuration files to your tasks to provide participants with necessary setup.
                    </p>
                    <Button onClick={() => setConfigDialogOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Config File
                    </Button>
                  </div>
                </BlurredCard>
              ) : (
                configFiles.map((file) => {
                  const relatedTask = tasks.find(t => t.id === file.task_id);
                  return (
                    <BlurredCard key={file.id}>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-medium">{file.file_name}</h3>
                            <p className="text-muted-foreground">
                              For task: {relatedTask?.title || 'Unknown Task'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 p-4 rounded-md overflow-x-auto mb-4">
                          <pre className="text-sm font-mono whitespace-pre-wrap">{file.file_content}</pre>
                        </div>
                        
                        {file.cli_command && (
                          <div className="mt-4">
                            <p className="text-xs text-muted-foreground mb-2">CLI Command</p>
                            <div className="bg-muted/50 p-3 rounded-md">
                              <code className="text-sm font-mono">{file.cli_command}</code>
                            </div>
                          </div>
                        )}
                      </div>
                    </BlurredCard>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
