
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Admin components
import { AccessDenied } from "@/components/admin/AccessDenied";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TaskList } from "@/components/admin/TaskList";
import { ConfigFileList } from "@/components/admin/ConfigFileList";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [configFiles, setConfigFiles] = useState<any[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Load tasks when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Fetch all data
  const fetchData = async () => {
    await Promise.all([
      fetchTasks(),
      fetchConfigFiles()
    ]);
  };

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

  // If the user is not an admin, redirect or show access denied
  if (user && user.role !== 'admin') {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <AdminHeader 
          refreshData={fetchData} 
          tasks={tasks} 
        />
        
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="configs">Config Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks">
            <TaskList 
              tasks={tasks} 
              refreshTasks={fetchTasks} 
            />
          </TabsContent>
          
          <TabsContent value="configs">
            <ConfigFileList 
              configFiles={configFiles} 
              tasks={tasks} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
