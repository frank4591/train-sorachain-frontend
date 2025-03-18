
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreditDisplay from "@/components/CreditDisplay";
import CreditHistoryCard from "@/components/CreditHistoryCard";
import TaskCard from "@/components/TaskCard";
import AuthKeyCard from "@/components/AuthKeyCard";
import { MOCK_TASKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  List,
  LayoutGrid,
  BrainCircuit,
  FileCode,
} from "lucide-react";
import ConfigCard from "@/components/ConfigCard";

export default function Dashboard() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const refreshTasks = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  const tasks = MOCK_TASKS;
  
  // Memoize filtered tasks to avoid unnecessary re-renders
  const stakedTasks = user?.stakedTasks
    ? tasks.filter(task => user.stakedTasks.includes(task.id))
    : [];
  
  // Filter active tasks (available or in_progress)
  const activeTasks = tasks.filter(task => ["available", "in_progress"].includes(task.status));
  
  // Filter completed tasks
  const completedTasks = tasks.filter(task => task.status === "completed");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold"
            >
              Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Welcome back, {user?.name}
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <BlurredCard className="overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-medium">AI Training Platform</h2>
                      <p className="text-sm text-muted-foreground">
                        Select tasks and roles to participate in training
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <Tabs defaultValue="active" className="w-full">
                    <div className="flex items-center justify-between mb-6">
                      <TabsList>
                        <TabsTrigger value="active" className="text-xs">
                          Active Tasks
                        </TabsTrigger>
                        <TabsTrigger value="staked" className="text-xs">
                          My Staked Tasks
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="text-xs">
                          Completed Tasks
                        </TabsTrigger>
                      </TabsList>
                      
                      <div className="flex space-x-1 bg-muted rounded-md">
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`p-1 rounded-md ${
                            viewMode === "grid" ? "bg-background shadow-sm" : ""
                          }`}
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setViewMode("list")}
                          className={`p-1 rounded-md ${
                            viewMode === "list" ? "bg-background shadow-sm" : ""
                          }`}
                        >
                          <List className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <TabsContent value="active">
                      <motion.div
                        key={`active-${refreshTrigger}`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={
                          viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                            : "space-y-4"
                        }
                      >
                        {activeTasks.map((task) => (
                          <motion.div key={task.id} variants={itemVariants}>
                            <TaskCard 
                              task={task} 
                              onRefresh={refreshTasks}
                            />
                          </motion.div>
                        ))}
                        
                        {activeTasks.length === 0 && (
                          <div className="text-center py-12 col-span-full">
                            <p className="text-muted-foreground">No active tasks available at the moment</p>
                          </div>
                        )}
                      </motion.div>
                    </TabsContent>
                    
                    <TabsContent value="staked">
                      <motion.div
                        key={`staked-${refreshTrigger}`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={
                          viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                            : "space-y-4"
                        }
                      >
                        {stakedTasks.map((task) => (
                          <motion.div key={task.id} variants={itemVariants}>
                            <TaskCard 
                              task={task}
                              onRefresh={refreshTasks}
                            />
                          </motion.div>
                        ))}
                        
                        {stakedTasks.length === 0 && (
                          <div className="text-center py-12 col-span-full">
                            <p className="text-muted-foreground">You haven't staked for any tasks yet</p>
                          </div>
                        )}
                      </motion.div>
                    </TabsContent>
                    
                    <TabsContent value="completed">
                      <motion.div
                        key={`completed-${refreshTrigger}`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={
                          viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                            : "space-y-4"
                        }
                      >
                        {completedTasks.map((task) => (
                          <motion.div key={task.id} variants={itemVariants}>
                            <TaskCard 
                              task={task}
                              onRefresh={refreshTasks}
                            />
                          </motion.div>
                        ))}
                        
                        {completedTasks.length === 0 && (
                          <div className="text-center py-12 col-span-full">
                            <p className="text-muted-foreground">No completed tasks yet</p>
                          </div>
                        )}
                      </motion.div>
                    </TabsContent>
                  </Tabs>
                </div>
              </BlurredCard>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <CreditDisplay />
              
              {user?.creditHistory && user.creditHistory.length > 0 && (
                <CreditHistoryCard creditHistory={user.creditHistory} />
              )}
              
              <AuthKeyCard />
              
              {stakedTasks.length > 0 && (
                <ConfigCard tasks={stakedTasks} />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
