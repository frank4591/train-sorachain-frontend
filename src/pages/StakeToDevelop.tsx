
import { useState } from "react";
import { motion } from "framer-motion";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Database, 
  Shield, 
  Server, 
  Settings, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

// Mock tasks data
const tasks = [
  {
    id: "TSK-001",
    name: "Image Recognition Model",
    category: "Computer Vision",
    status: "Submission",
    startDate: "2023-10-15",
    rewardsPool: "12%",
    stakeRatio: "2:1",
    description: "Train an image recognition model for identifying objects in everyday scenes. The model should achieve at least 85% accuracy on the test dataset."
  },
  {
    id: "TSK-002",
    name: "Natural Language Processor",
    category: "NLP",
    status: "Finalized",
    startDate: "2023-09-20",
    rewardsPool: "15%",
    stakeRatio: "3:1",
    description: "Build a natural language processing model capable of summarizing news articles. The model should generate concise, accurate summaries that capture the key points of the original text."
  },
  {
    id: "TSK-003",
    name: "Recommendation Engine",
    category: "Recommendation Systems",
    status: "N/A",
    startDate: "2023-11-05",
    rewardsPool: "10%",
    stakeRatio: "1:1",
    description: "Develop a recommendation engine for a streaming platform. The system should suggest content based on user viewing history, ratings, and demographic information."
  },
  {
    id: "TSK-004",
    name: "Anomaly Detection System",
    category: "Security",
    status: "Submission",
    startDate: "2023-10-30",
    rewardsPool: "8%",
    stakeRatio: "2:1",
    description: "Create an anomaly detection system for identifying unusual patterns in network traffic that might indicate security breaches or system failures."
  },
  {
    id: "TSK-005",
    name: "Sentiment Analysis Tool",
    category: "NLP",
    status: "N/A",
    startDate: "2023-11-15",
    rewardsPool: "7%",
    stakeRatio: "1:1",
    description: "Build a sentiment analysis tool for analyzing customer feedback. The model should classify text as positive, negative, or neutral with high accuracy."
  },
];

export default function StakeToDevelop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("training");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [stakeDialogOpen, setStakeDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [rewardSharingRatio, setRewardSharingRatio] = useState<number[]>([70]);
  const [delegationDialogOpen, setDelegationDialogOpen] = useState(false);

  const filteredTasks = tasks.filter(task => 
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTaskExpand = (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
    }
  };

  const handleStake = (task: any, role: string) => {
    setSelectedTask({...task, role});
    setStakeDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pt-6 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Stake to Develop</h1>
          <p className="text-muted-foreground">
            Participate in the SoraChain network by staking to training, validation, and aggregation tasks
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="training" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="training">Training Node</TabsTrigger>
              <TabsTrigger value="validator">Validator</TabsTrigger>
              <TabsTrigger value="aggregator">Aggregator</TabsTrigger>
              <TabsTrigger value="delegation">Accept Delegation</TabsTrigger>
            </TabsList>
            
            {/* Training Node Tab */}
            <TabsContent value="training">
              <BlurredCard>
                <div className="p-6 border-b border-border">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Database className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-medium">Available Training Tasks</h2>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input
                          placeholder="Search tasks..."
                          className="pl-9 w-64"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button size="sm" variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Task Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>Rewards Pool</TableHead>
                          <TableHead>Stake Ratio</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTasks.map((task) => (
                          <>
                            <TableRow key={task.id} className="group">
                              <TableCell>{task.id}</TableCell>
                              <TableCell className="font-medium">{task.name}</TableCell>
                              <TableCell>{task.category}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  task.status === "Submission" ? "bg-blue-100 text-blue-800" :
                                  task.status === "Finalized" ? "bg-green-100 text-green-800" :
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  {task.status}
                                </span>
                              </TableCell>
                              <TableCell>{task.startDate}</TableCell>
                              <TableCell>{task.rewardsPool}</TableCell>
                              <TableCell>{task.stakeRatio}</TableCell>
                              <TableCell>
                                <Button 
                                  size="sm"
                                  onClick={() => handleStake(task, "trainer")}
                                  disabled={task.status === "Finalized"}
                                >
                                  Stake as Trainer
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleTaskExpand(task.id)}
                                >
                                  {expandedTaskId === task.id ? 
                                    <ChevronUp className="h-4 w-4" /> : 
                                    <ChevronDown className="h-4 w-4" />
                                  }
                                </Button>
                              </TableCell>
                            </TableRow>
                            {expandedTaskId === task.id && (
                              <TableRow>
                                <TableCell colSpan={9} className="bg-muted/30">
                                  <div className="p-4">
                                    <h3 className="font-medium mb-2">Task Description</h3>
                                    <p className="text-muted-foreground">{task.description}</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </BlurredCard>
            </TabsContent>
            
            {/* Validator Tab */}
            <TabsContent value="validator">
              <BlurredCard>
                <div className="p-6 border-b border-border">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-medium">Available Validation Tasks</h2>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input
                          placeholder="Search tasks..."
                          className="pl-9 w-64"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button size="sm" variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Task Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>Rewards Pool</TableHead>
                          <TableHead>Stake Ratio</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTasks.map((task) => (
                          <>
                            <TableRow key={`val-${task.id}`} className="group">
                              <TableCell>{task.id}</TableCell>
                              <TableCell className="font-medium">{task.name}</TableCell>
                              <TableCell>{task.category}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  task.status === "Submission" ? "bg-blue-100 text-blue-800" :
                                  task.status === "Finalized" ? "bg-green-100 text-green-800" :
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  {task.status}
                                </span>
                              </TableCell>
                              <TableCell>{task.startDate}</TableCell>
                              <TableCell>{task.rewardsPool}</TableCell>
                              <TableCell>{task.stakeRatio}</TableCell>
                              <TableCell>
                                <Button 
                                  size="sm"
                                  onClick={() => handleStake(task, "validator")}
                                  disabled={task.status === "Finalized"}
                                >
                                  Stake as Validator
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleTaskExpand(`val-${task.id}`)}
                                >
                                  {expandedTaskId === `val-${task.id}` ? 
                                    <ChevronUp className="h-4 w-4" /> : 
                                    <ChevronDown className="h-4 w-4" />
                                  }
                                </Button>
                              </TableCell>
                            </TableRow>
                            {expandedTaskId === `val-${task.id}` && (
                              <TableRow>
                                <TableCell colSpan={9} className="bg-muted/30">
                                  <div className="p-4">
                                    <h3 className="font-medium mb-2">Task Description</h3>
                                    <p className="text-muted-foreground">{task.description}</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </BlurredCard>
            </TabsContent>
            
            {/* Aggregator Tab */}
            <TabsContent value="aggregator">
              <BlurredCard>
                <div className="p-6 border-b border-border">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Server className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-medium">Available Aggregation Tasks</h2>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                        <Input
                          placeholder="Search tasks..."
                          className="pl-9 w-64"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button size="sm" variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Task Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>Rewards Pool</TableHead>
                          <TableHead>Stake Ratio</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTasks.map((task) => (
                          <>
                            <TableRow key={`agg-${task.id}`} className="group">
                              <TableCell>{task.id}</TableCell>
                              <TableCell className="font-medium">{task.name}</TableCell>
                              <TableCell>{task.category}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  task.status === "Submission" ? "bg-blue-100 text-blue-800" :
                                  task.status === "Finalized" ? "bg-green-100 text-green-800" :
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  {task.status}
                                </span>
                              </TableCell>
                              <TableCell>{task.startDate}</TableCell>
                              <TableCell>{task.rewardsPool}</TableCell>
                              <TableCell>{task.stakeRatio}</TableCell>
                              <TableCell>
                                <Button 
                                  size="sm"
                                  onClick={() => handleStake(task, "aggregator")}
                                  disabled={task.status === "Finalized"}
                                >
                                  Stake as Aggregator
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleTaskExpand(`agg-${task.id}`)}
                                >
                                  {expandedTaskId === `agg-${task.id}` ? 
                                    <ChevronUp className="h-4 w-4" /> : 
                                    <ChevronDown className="h-4 w-4" />
                                  }
                                </Button>
                              </TableCell>
                            </TableRow>
                            {expandedTaskId === `agg-${task.id}` && (
                              <TableRow>
                                <TableCell colSpan={9} className="bg-muted/30">
                                  <div className="p-4">
                                    <h3 className="font-medium mb-2">Task Description</h3>
                                    <p className="text-muted-foreground">{task.description}</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </BlurredCard>
            </TabsContent>
            
            {/* Accept Delegation Tab */}
            <TabsContent value="delegation">
              <BlurredCard className="p-8">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-medium">Delegation Settings</h2>
                  </div>
                  
                  <div className="bg-muted/50 p-6 rounded-lg mb-8">
                    <h3 className="text-lg font-medium mb-4">Your current Reward-Sharing Ratio is {rewardSharingRatio[0]}%</h3>
                    <p className="text-muted-foreground mb-6">
                      You can set your own reward-sharing ratio. It is a percentage of total rewards (reward on total stake) 
                      that will be shared with delegators based on the relative staking ratio between you and your delegators.
                    </p>
                    <p className="text-muted-foreground mb-6">
                      The reward-sharing ratio incentivizes users to delegate their tokens to you, increasing the number of 
                      SoraChain token you can use to stake.
                    </p>
                    <p className="text-sm text-amber-600 mb-6">
                      The ratio can only be changed once every 10 days.
                    </p>
                    
                    <div className="mb-8">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Delegator Share: {rewardSharingRatio[0]}%</span>
                        <span>Your Share: {100 - rewardSharingRatio[0]}%</span>
                      </div>
                      <Slider 
                        value={rewardSharingRatio} 
                        onValueChange={setRewardSharingRatio}
                        max={95}
                        min={5}
                        step={5}
                      />
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        size="lg"
                        onClick={() => setDelegationDialogOpen(true)}
                      >
                        Create Delegation Contract
                      </Button>
                    </div>
                  </div>
                </div>
              </BlurredCard>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Stake Dialog */}
      <Dialog open={stakeDialogOpen} onOpenChange={setStakeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Stake as {selectedTask?.role}</DialogTitle>
            <DialogDescription>
              Stake your tokens to participate in the "{selectedTask?.name}" task.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Task Category:</div>
              <div>{selectedTask?.category}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Task Status:</div>
              <div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedTask?.status === "Submission" ? "bg-blue-100 text-blue-800" :
                  selectedTask?.status === "Finalized" ? "bg-green-100 text-green-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {selectedTask?.status}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Rewards Pool:</div>
              <div>{selectedTask?.rewardsPool}</div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="stake-amount" className="text-sm font-medium">
                Amount to Stake
              </label>
              <Input
                id="stake-amount"
                placeholder="Enter amount"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setStakeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Stake Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delegation Dialog */}
      <Dialog open={delegationDialogOpen} onOpenChange={setDelegationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Delegation Contract</DialogTitle>
            <DialogDescription>
              Confirm your delegation settings to enable other users to delegate tokens to you.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Reward-Sharing Ratio:</div>
              <div>{rewardSharingRatio[0]}%</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Your Share:</div>
              <div>{100 - rewardSharingRatio[0]}%</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Lock Period:</div>
              <div>10 days</div>
            </div>
            
            <div className="text-sm text-amber-600 mt-2">
              Note: Once created, you won't be able to change the reward-sharing ratio for 10 days.
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDelegationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Confirm & Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
