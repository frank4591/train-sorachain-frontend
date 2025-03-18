
import { useState } from "react";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Server, 
  Cpu, 
  Shield, 
  Users, 
  ChevronDown, 
  ChevronUp,
  Info 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";

// Mock task data
const tasks = [
  {
    id: "TASK-001",
    name: "Image Recognition Model Training",
    category: "Computer Vision",
    status: "Submission",
    startDate: "2024-01-15",
    dailyRewardsPool: "12%",
    stakeRatio: "60/40",
    description: "Training a state-of-the-art image recognition model using a diverse dataset of labeled images. The model should achieve at least 95% accuracy on the test set.",
  },
  {
    id: "TASK-002",
    name: "NLP Sentiment Analysis",
    category: "Natural Language Processing",
    status: "Finalized",
    startDate: "2023-12-20",
    dailyRewardsPool: "8%",
    stakeRatio: "65/35",
    description: "Developing a sentiment analysis model capable of identifying emotions in text with high accuracy across multiple languages.",
  },
  {
    id: "TASK-003",
    name: "Reinforcement Learning for Game AI",
    category: "Reinforcement Learning",
    status: "N/A",
    startDate: "2024-02-10",
    dailyRewardsPool: "15%",
    stakeRatio: "55/45",
    description: "Training an AI agent to play complex strategy games through reinforcement learning, optimizing for both win rate and strategic depth.",
  },
  {
    id: "TASK-004",
    name: "Multimodal Content Generation",
    category: "Generative AI",
    status: "Submission",
    startDate: "2024-01-25",
    dailyRewardsPool: "18%",
    stakeRatio: "50/50",
    description: "Creating a model that can generate coherent content across text, images, and simple animations based on text prompts.",
  },
  {
    id: "TASK-005",
    name: "Audio Transcription Enhancement",
    category: "Speech Recognition",
    status: "Finalized",
    startDate: "2023-11-30",
    dailyRewardsPool: "7%",
    stakeRatio: "70/30",
    description: "Improving an existing audio transcription model to better handle accents, background noise, and domain-specific terminology.",
  },
  {
    id: "TASK-006",
    name: "Time Series Forecasting",
    category: "Predictive Analytics",
    status: "N/A",
    startDate: "2024-02-28",
    dailyRewardsPool: "10%",
    stakeRatio: "60/40",
    description: "Developing a model for accurate time series forecasting with applications in financial markets, weather prediction, and resource planning.",
  },
];

export default function StakeToDevelop() {
  const { user, addCredits } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [stakeDialogOpen, setStakeDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeRole, setStakeRole] = useState<"trainer" | "validator" | "aggregator">("trainer");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [delegationDialogOpen, setDelegationDialogOpen] = useState(false);
  const [rewardSharingRatio, setRewardSharingRatio] = useState(70);

  const filteredTasks = tasks.filter(task => 
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExpandTask = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleStake = (task: any, role: "trainer" | "validator" | "aggregator") => {
    setSelectedTask(task);
    setStakeRole(role);
    setStakeDialogOpen(true);
  };

  const handleSubmitStake = () => {
    if (!selectedTask || !stakeAmount) return;
    
    const amount = parseInt(stakeAmount, 10);
    if (isNaN(amount) || amount <= 0 || amount > (user?.credits || 0)) {
      alert("Please enter a valid stake amount");
      return;
    }
    
    // In a real application, this would be an API call
    addCredits(-amount, `Staked ${amount} credits to ${selectedTask.name} as ${stakeRole}`);
    
    setStakeDialogOpen(false);
    setStakeAmount("");
  };

  const handleCreateDelegation = () => {
    // In a real application, this would be an API call
    alert(`Created delegation contract with ${rewardSharingRatio}% reward-sharing ratio`);
    setDelegationDialogOpen(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "trainer":
        return <Server className="h-5 w-5" />;
      case "validator":
        return <Shield className="h-5 w-5" />;
      case "aggregator":
        return <Cpu className="h-5 w-5" />;
      default:
        return <Server className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submission":
        return "bg-blue-100 text-blue-800";
      case "Finalized":
        return "bg-green-100 text-green-800";
      case "N/A":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background pt-6 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Stake to Develop</h1>
          <p className="text-muted-foreground">
            Stake your credits as a Trainer Node, Validator, or Aggregator to contribute to the network
          </p>
        </div>

        <Tabs defaultValue="trainer">
          <TabsList className="mb-6">
            <TabsTrigger value="trainer" className="flex items-center">
              <Server className="h-4 w-4 mr-2" />
              Training Node
            </TabsTrigger>
            <TabsTrigger value="validator" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Validator
            </TabsTrigger>
            <TabsTrigger value="aggregator" className="flex items-center">
              <Cpu className="h-4 w-4 mr-2" />
              Aggregator
            </TabsTrigger>
            <TabsTrigger value="delegation" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Accept Delegation
            </TabsTrigger>
          </TabsList>

          {/* Training Node Tab */}
          <TabsContent value="trainer">
            <BlurredCard>
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Server className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-medium">Training Node Tasks</h2>
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
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Task Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Daily Rewards Pool</TableHead>
                        <TableHead>Stake Ratio</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks.map((task) => (
                        <>
                          <TableRow 
                            key={task.id} 
                            className="cursor-pointer"
                            onClick={() => handleExpandTask(task.id)}
                          >
                            <TableCell>
                              {expandedTaskId === task.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </TableCell>
                            <TableCell>{task.id}</TableCell>
                            <TableCell className="font-medium">{task.name}</TableCell>
                            <TableCell>{task.category}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </TableCell>
                            <TableCell>{task.startDate}</TableCell>
                            <TableCell className="text-green-600">{task.dailyRewardsPool}</TableCell>
                            <TableCell>{task.stakeRatio}</TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStake(task, "trainer");
                                }}
                              >
                                Stake as Trainer Node
                              </Button>
                            </TableCell>
                          </TableRow>
                          {expandedTaskId === task.id && (
                            <TableRow>
                              <TableCell colSpan={9} className="bg-muted/30">
                                <div className="p-4">
                                  <h4 className="font-semibold mb-2">Task Description</h4>
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
                    <h2 className="text-xl font-medium">Validator Tasks</h2>
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
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Task Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Daily Rewards Pool</TableHead>
                        <TableHead>Stake Ratio</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks.map((task) => (
                        <>
                          <TableRow 
                            key={task.id} 
                            className="cursor-pointer"
                            onClick={() => handleExpandTask(task.id)}
                          >
                            <TableCell>
                              {expandedTaskId === task.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </TableCell>
                            <TableCell>{task.id}</TableCell>
                            <TableCell className="font-medium">{task.name}</TableCell>
                            <TableCell>{task.category}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </TableCell>
                            <TableCell>{task.startDate}</TableCell>
                            <TableCell className="text-green-600">{task.dailyRewardsPool}</TableCell>
                            <TableCell>{task.stakeRatio}</TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStake(task, "validator");
                                }}
                              >
                                Stake as Validator
                              </Button>
                            </TableCell>
                          </TableRow>
                          {expandedTaskId === task.id && (
                            <TableRow>
                              <TableCell colSpan={9} className="bg-muted/30">
                                <div className="p-4">
                                  <h4 className="font-semibold mb-2">Task Description</h4>
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
                      <Cpu className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-medium">Aggregator Tasks</h2>
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
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Task Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Daily Rewards Pool</TableHead>
                        <TableHead>Stake Ratio</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks.map((task) => (
                        <>
                          <TableRow 
                            key={task.id} 
                            className="cursor-pointer"
                            onClick={() => handleExpandTask(task.id)}
                          >
                            <TableCell>
                              {expandedTaskId === task.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </TableCell>
                            <TableCell>{task.id}</TableCell>
                            <TableCell className="font-medium">{task.name}</TableCell>
                            <TableCell>{task.category}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </TableCell>
                            <TableCell>{task.startDate}</TableCell>
                            <TableCell className="text-green-600">{task.dailyRewardsPool}</TableCell>
                            <TableCell>{task.stakeRatio}</TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStake(task, "aggregator");
                                }}
                              >
                                Stake as Aggregator
                              </Button>
                            </TableCell>
                          </TableRow>
                          {expandedTaskId === task.id && (
                            <TableRow>
                              <TableCell colSpan={9} className="bg-muted/30">
                                <div className="p-4">
                                  <h4 className="font-semibold mb-2">Task Description</h4>
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
            <BlurredCard>
              <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-medium">Accept Delegation</h2>
                </div>
              </div>
              
              <div className="p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-lg font-medium mb-6">Your current Reward-Sharing Ratio is</h3>
                  
                  <div className="text-4xl font-bold text-primary mb-8">{rewardSharingRatio}%</div>
                  
                  <p className="text-muted-foreground mb-8">
                    You can set your own reward-sharing ratio. It is a percentage of total rewards (reward on total stake) 
                    that will be shared with delegators based on the relative staking ratio between you and your delegators.
                  </p>
                  
                  <p className="text-muted-foreground mb-8">
                    The reward-sharing ratio incentivizes users to delegate their tokens to you, increasing the number of 
                    SoraChain token you can use to stake.
                  </p>
                  
                  <p className="text-muted-foreground mb-12">
                    The ratio can only be changed once every 10 days.
                  </p>
                  
                  <div className="flex justify-center items-center space-x-12 mb-12">
                    <div className="text-lg font-medium">0%</div>
                    <div className="w-full max-w-md">
                      <Slider
                        value={[rewardSharingRatio]}
                        onValueChange={(vals) => setRewardSharingRatio(vals[0])}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="text-lg font-medium">100%</div>
                  </div>

                  <div className="flex justify-center">
                    <Button size="lg" onClick={() => setDelegationDialogOpen(true)}>
                      Create Delegation Contract
                    </Button>
                  </div>
                </div>
              </div>
            </BlurredCard>
          </TabsContent>
        </Tabs>
      </div>

      {/* Stake Dialog */}
      <Dialog open={stakeDialogOpen} onOpenChange={setStakeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Stake as {stakeRole === "trainer" ? "Trainer Node" : stakeRole === "validator" ? "Validator" : "Aggregator"}
            </DialogTitle>
            <DialogDescription>
              {selectedTask?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Task Status:</div>
              <div>
                <span className={`px-2 py-1 text-xs rounded-full ${selectedTask && getStatusColor(selectedTask.status)}`}>
                  {selectedTask?.status}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Daily Rewards Pool:</div>
              <div className="text-green-600">{selectedTask?.dailyRewardsPool}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Your Credits:</div>
              <div>{user?.credits || 0}</div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="stake-amount" className="text-sm font-medium">
                Amount to Stake
              </label>
              <Input
                id="stake-amount"
                type="number"
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
            <Button onClick={handleSubmitStake}>
              Stake Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delegation Dialog */}
      <Dialog open={delegationDialogOpen} onOpenChange={setDelegationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Delegation Contract</DialogTitle>
            <DialogDescription>
              You are about to create a delegation contract with {rewardSharingRatio}% reward-sharing ratio.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Reward-Sharing Ratio:</div>
              <div className="text-primary font-medium">{rewardSharingRatio}%</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Change Cooldown:</div>
              <div>10 days</div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-md flex items-start mt-2">
              <Info className="h-4 w-4 text-muted-foreground mr-2 mt-1 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                By creating a delegation contract, you allow other users to delegate their tokens to you. 
                You will share {rewardSharingRatio}% of your rewards with delegators based on their stake ratio.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDelegationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateDelegation}>
              Create Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
