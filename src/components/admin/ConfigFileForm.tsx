
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save, FileCode } from "lucide-react";
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

// Validation schema for configuration file
const configFileSchema = z.object({
  fileName: z.string().min(1, "Filename is required"),
  fileContent: z.string().min(1, "File content is required"),
  cliCommand: z.string().optional(),
  taskId: z.string().min(1, "Task ID is required"),
});

export type ConfigFileFormValues = z.infer<typeof configFileSchema>;

interface ConfigFileFormProps {
  tasks: any[];
  onConfigCreated: () => void;
}

export const ConfigFileForm = ({ tasks, onConfigCreated }: ConfigFileFormProps) => {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [isCreatingConfig, setIsCreatingConfig] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const configForm = useForm<ConfigFileFormValues>({
    resolver: zodResolver(configFileSchema),
    defaultValues: {
      fileName: "",
      fileContent: "",
      cliCommand: "",
      taskId: "",
    }
  });

  // Handle config file creation
  const onSubmitConfigFile = async (values: ConfigFileFormValues) => {
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
        onConfigCreated();
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

  return (
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
  );
};
