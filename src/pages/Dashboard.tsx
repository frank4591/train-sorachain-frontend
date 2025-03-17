
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreditDisplay from "@/components/CreditDisplay";
import TaskCard from "@/components/TaskCard";
import AuthKeyCard from "@/components/AuthKeyCard";
import { MOCK_TASKS } from "@/lib/constants";
import {
  BarChart3,
  CircleUser,
  Key,
  List,
  Table,
  LayoutGrid,
  Wallet,
  BrainCircuit,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const getTasks = () => {
    // In a real app, these would be filtered by user role or other criteria
    return MOCK_TASKS;
  };
  
  const tasks = getTasks();
  
  const tasksByRole = tasks.filter(task => task.requiredRole === user?.role);
  const tasksByStaked = user?.stakedTasks
    ? tasks.filter(task => user.stakedTasks.includes(task.id))
    : [];
  
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
      <Navbar />
      
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
                        Your role: <span className="font-medium capitalize">{user?.role}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <Tabs defaultValue="all" className="w-full">
                    <div className="flex items-center justify-between mb-6">
                      <TabsList>
                        <TabsTrigger value="all" className="text-xs">
                          All Tasks
                        </TabsTrigger>
                        <TabsTrigger value="my-role" className="text-xs">
                          For My Role
                        </TabsTrigger>
                        <TabsTrigger value="staked" className="text-xs">
                          Staked
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
                    
                    <TabsContent value="all">
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={
                          viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                            : "space-y-4"
                        }
                      >
                        {tasks.map((task) => (
                          <motion.div key={task.id} variants={itemVariants}>
                            <TaskCard task={task} />
                          </motion.div>
                        ))}
                        
                        {tasks.length === 0 && (
                          <div className="text-center py-12 col-span-full">
                            <p className="text-muted-foreground">No tasks available at the moment</p>
                          </div>
                        )}
                      </motion.div>
                    </TabsContent>
                    
                    <TabsContent value="my-role">
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={
                          viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                            : "space-y-4"
                        }
                      >
                        {tasksByRole.map((task) => (
                          <motion.div key={task.id} variants={itemVariants}>
                            <TaskCard task={task} />
                          </motion.div>
                        ))}
                        
                        {tasksByRole.length === 0 && (
                          <div className="text-center py-12 col-span-full">
                            <p className="text-muted-foreground">No tasks available for your role</p>
                          </div>
                        )}
                      </motion.div>
                    </TabsContent>
                    
                    <TabsContent value="staked">
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={
                          viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                            : "space-y-4"
                        }
                      >
                        {tasksByStaked.map((task) => (
                          <motion.div key={task.id} variants={itemVariants}>
                            <TaskCard task={task} />
                          </motion.div>
                        ))}
                        
                        {tasksByStaked.length === 0 && (
                          <div className="text-center py-12 col-span-full">
                            <p className="text-muted-foreground">You haven't staked for any tasks yet</p>
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
              <AuthKeyCard />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
