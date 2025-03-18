
import { useState } from "react";
import { motion } from "framer-motion";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, ChartLine, ListFilter, Table, Users, Search } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for training submissions
const trainingSubmissionData = [
  { name: 'Jan', submissions: 65 },
  { name: 'Feb', submissions: 59 },
  { name: 'Mar', submissions: 80 },
  { name: 'Apr', submissions: 81 },
  { name: 'May', submissions: 56 },
  { name: 'Jun', submissions: 55 },
  { name: 'Jul', submissions: 40 },
  { name: 'Aug', submissions: 70 },
  { name: 'Sep', submissions: 90 },
  { name: 'Oct', submissions: 110 },
  { name: 'Nov', submissions: 130 },
  { name: 'Dec', submissions: 150 },
];

// Mock data for validation submissions
const validationSubmissionData = [
  { name: 'Jan', submissions: 40 },
  { name: 'Feb', submissions: 45 },
  { name: 'Mar', submissions: 60 },
  { name: 'Apr', submissions: 70 },
  { name: 'May', submissions: 45 },
  { name: 'Jun', submissions: 50 },
  { name: 'Jul', submissions: 35 },
  { name: 'Aug', submissions: 60 },
  { name: 'Sep', submissions: 75 },
  { name: 'Oct', submissions: 90 },
  { name: 'Nov', submissions: 100 },
  { name: 'Dec', submissions: 120 },
];

// Mock data for training nodes
const trainingNodes = [
  { id: 1, wallet: "NeuralNode", score: 98.5, updateTime: "2023-11-28 14:23:45" },
  { id: 2, wallet: "DeepLearner", score: 96.2, updateTime: "2023-11-28 13:45:21" },
  { id: 3, wallet: "QuantumAI", score: 95.8, updateTime: "2023-11-28 12:32:10" },
  { id: 4, wallet: "NeuroBit", score: 94.1, updateTime: "2023-11-28 11:15:33" },
  { id: 5, wallet: "CognitiveTrain", score: 93.7, updateTime: "2023-11-28 10:05:27" },
];

// Mock data for validator nodes
const validatorNodes = [
  { id: 1, wallet: "ValidatorAlpha", share: 18.5, workingScore: 982.5, updateTime: "2023-11-28 15:10:22" },
  { id: 2, wallet: "TruthNode", share: 15.2, workingScore: 875.3, updateTime: "2023-11-28 14:22:15" },
  { id: 3, wallet: "ValidityCheck", share: 14.7, workingScore: 842.1, updateTime: "2023-11-28 13:45:07" },
  { id: 4, wallet: "AccuracyNet", share: 12.3, workingScore: 756.8, updateTime: "2023-11-28 12:30:19" },
  { id: 5, wallet: "VerifyChain", share: 10.8, workingScore: 698.4, updateTime: "2023-11-28 11:15:42" },
];

// Mock data for network stats
const networkStatsData = [
  { name: "Staked", value: 75 },
  { name: "Available", value: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Explore() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter" | "year">("month");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTrainingNodes = trainingNodes.filter(node => 
    node.wallet.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredValidatorNodes = validatorNodes.filter(node => 
    node.wallet.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-6 pb-16 px-6">
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
                        <ChartLine className="h-5 w-5 text-primary" />
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
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Training Submissions</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={trainingSubmissionData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="submissions"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Validation Submissions</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={validationSubmissionData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="submissions"
                            stroke="#82ca9d"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
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
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
                              <Input
                                placeholder="Search nodes..."
                                className="pl-9 w-64 h-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </div>
                            <Button size="sm" variant="outline">
                              <ListFilter className="h-4 w-4 mr-2" />
                              Filter
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-md">
                          <Table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="p-3 text-left font-medium">Rank</th>
                                <th className="p-3 text-left font-medium">Wallet</th>
                                <th className="p-3 text-left font-medium">Score</th>
                                <th className="p-3 text-left font-medium">Update Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredTrainingNodes.map((node, index) => (
                                <tr key={node.id} className="border-b">
                                  <td className="p-3">{index + 1}</td>
                                  <td className="p-3 font-medium">{node.wallet}</td>
                                  <td className="p-3">{node.score}</td>
                                  <td className="p-3">{node.updateTime}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="validation">
                      <div className="overflow-x-auto">
                        <div className="flex items-center justify-end mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
                              <Input
                                placeholder="Search nodes..."
                                className="pl-9 w-64 h-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </div>
                            <Button size="sm" variant="outline">
                              <ListFilter className="h-4 w-4 mr-2" />
                              Filter
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-md">
                          <Table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="p-3 text-left font-medium">Index</th>
                                <th className="p-3 text-left font-medium">Wallet</th>
                                <th className="p-3 text-left font-medium">
                                  <div className="group relative">
                                    <span>Share in Validator</span>
                                    <div className="absolute left-0 bottom-full mb-2 w-48 bg-background border border-border rounded p-2 text-xs hidden group-hover:block z-10">
                                      Multiple factors define share of validator rewards
                                    </div>
                                  </div>
                                </th>
                                <th className="p-3 text-left font-medium">
                                  <div className="group relative">
                                    <span>Working Score</span>
                                    <div className="absolute left-0 bottom-full mb-2 w-48 bg-background border border-border rounded p-2 text-xs hidden group-hover:block z-10">
                                      Sum of all scores validators have received
                                    </div>
                                  </div>
                                </th>
                                <th className="p-3 text-left font-medium">Update Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredValidatorNodes.map((node, index) => (
                                <tr key={node.id} className="border-b">
                                  <td className="p-3">{index + 1}</td>
                                  <td className="p-3 font-medium">{node.wallet}</td>
                                  <td className="p-3">{node.share}%</td>
                                  <td className="p-3">{node.workingScore}</td>
                                  <td className="p-3">{node.updateTime}</td>
                                </tr>
                              ))}
                            </tbody>
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
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Image Recognition Model</h3>
                          <p className="text-sm text-muted-foreground">Starts on Dec 15, 2023</p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Open for Staking
                        </span>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Language Processing</h3>
                          <p className="text-sm text-muted-foreground">Starts on Dec 20, 2023</p>
                        </div>
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Recommendation Engine</h3>
                          <p className="text-sm text-muted-foreground">Starts on Jan 5, 2024</p>
                        </div>
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                          Coming Soon
                        </span>
                      </div>
                    </div>
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
                  <div className="flex justify-center items-center mb-6">
                    <div className="h-48 w-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={networkStatsData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {networkStatsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Staked</p>
                      <p className="text-2xl font-bold">750,000</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Avg. Training Yield</p>
                      <p className="text-2xl font-bold">8.2%</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Avg. Validator Yield</p>
                      <p className="text-2xl font-bold">6.5%</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Max Delegator Yield</p>
                      <p className="text-2xl font-bold">12.8%</p>
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
