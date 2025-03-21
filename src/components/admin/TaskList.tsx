
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, Users, BarChart, Clock, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurredCard } from "@/components/ui/blurred-card";
import { ConfigFileForm } from "./ConfigFileForm";
import { PlusCircle } from "lucide-react";

interface TaskListProps {
  tasks: any[];
  refreshTasks: () => void;
}

export const TaskList = ({ tasks, refreshTasks }: TaskListProps) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleConfigAction = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  if (tasks.length === 0) {
    return (
      <BlurredCard>
        <div className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Tasks Yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first task to start contributing to the network.
          </p>
          <Button onClick={() => {
            const element = document.querySelector('[data-create-task]');
            if (element) {
              (element as HTMLElement).click();
            }
          }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Task
          </Button>
        </div>
      </BlurredCard>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {tasks.map((task) => (
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
                  onClick={() => handleConfigAction(task.id)}
                >
                  <FileCode className="mr-2 h-4 w-4" />
                  Add Config
                </Button>
              </div>
            )}
          </div>
        </BlurredCard>
      ))}
    </div>
  );
};
