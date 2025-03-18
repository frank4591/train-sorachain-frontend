
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, ChartLineUp, ListFilter, Table, Users } from "lucide-react";

export default function Explore() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter" | "year">("month");
  
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
              Explore
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Discover activity on the SoraChain network
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 space-y-6"
            >
              <BlurredCard>
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <ChartLineUp className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-medium">Network Activity</h2>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant={timeframe === "week" ? "default" : "outline"}
                        onClick={() => setTimeframe("week")}
                      >
                        Week
                      </Button>
                      <Button 
                        size="sm" 
                        variant={timeframe === "month" ? "default" : "outline"}
                        onClick={() => setTimeframe("month")}
                      >
                        Month
                      </Button>
                      <Button 
                        size="sm" 
                        variant={timeframe === "quarter" ? "default" : "outline"}
                        onClick={() => setTimeframe("quarter")}
                      >
                        Quarter
                      </Button>
                      <Button 
                        size="sm" 
                        variant={timeframe === "year" ? "default" : "outline"}
                        onClick={() => setTimeframe("year")}
                      >
                        Year
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-center text-muted-foreground mb-16">
                    Charts and graphs of network activity will be displayed here
                  </p>
                  
                  <div className="flex flex-col items-center justify-center py-8">
                    <ChartLineUp className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Network Activity Coming Soon</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      We're building out the data visualization features. Check back soon
                      to see detailed analytics for training and validation submissions.
                    </p>
                  </div>
                </div>
              </BlurredCard>
              
              <BlurredCard>
                <div className="p-6 border-b border-border">
                  <Tabs defaultValue="training">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-medium">Network Participants</h2>
                      <TabsList>
                        <TabsTrigger value="training">Training Nodes</TabsTrigger>
                        <TabsTrigger value="validation">Validator Nodes</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="training">
                      <div className="overflow-x-auto">
                        <div className="flex items-center justify-end mb-4">
                          <Button size="sm" variant="outline">
                            <ListFilter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                        </div>
                        
                        <div className="border rounded-md">
                          <Table className="w-full">
                            <p className="text-center text-muted-foreground py-16">
                              Training node data will be loaded here
                            </p>
                          </Table>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="validation">
                      <div className="overflow-x-auto">
                        <div className="flex items-center justify-end mb-4">
                          <Button size="sm" variant="outline">
                            <ListFilter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                        </div>
                        
                        <div className="border rounded-md">
                          <Table className="w-full">
                            <p className="text-center text-muted-foreground py-16">
                              Validator node data will be loaded here
                            </p>
                          </Table>
                        </div>
                      </div>
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
              <BlurredCard>
                <div className="p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-medium">Upcoming Tasks</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-center">
                      Upcoming tasks will be listed here
                    </p>
                  </div>
                </div>
              </BlurredCard>
              
              <BlurredCard>
                <div className="p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-medium">Network Stats</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Staked</p>
                      <p className="text-2xl font-bold">N/A</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Avg. Training Yield</p>
                      <p className="text-2xl font-bold">N/A</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Avg. Validator Yield</p>
                      <p className="text-2xl font-bold">N/A</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Max Delegator Yield</p>
                      <p className="text-2xl font-bold">N/A</p>
                    </div>
                  </div>
                </div>
              </BlurredCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
