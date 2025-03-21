
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./TaskForm";
import { ConfigFileForm } from "./ConfigFileForm";

interface AdminHeaderProps {
  refreshData: () => void;
  tasks: any[];
}

export const AdminHeader = ({ refreshData, tasks }: AdminHeaderProps) => {
  return (
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
        <span data-create-task>
          <TaskForm onTaskCreated={refreshData} />
        </span>
        <span data-add-config>
          <ConfigFileForm 
            tasks={tasks} 
            onConfigCreated={refreshData} 
          />
        </span>
      </div>
    </motion.div>
  );
};
