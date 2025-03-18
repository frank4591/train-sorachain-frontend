
import { useState } from "react";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Users, Wallet, CreditCard } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Mock data for trainer nodes
const trainerNodes = [
  {
    id: "TN-001",
    wallet: "TrainerAlpha",
    description: "High-performance trainer node specialized in image recognition tasks with 99.7% accuracy.",
    delegatorAPY: "8.4%",
    rewardSharingRatio: "70/30",
    totalStake: "24,500",
    growthQ: "+12.3%"
  },
  {
    id: "TN-002",
    wallet: "NeuralNode",
    description: "Focused on NLP models with specialized hardware for transformer architecture acceleration.",
    delegatorAPY: "7.9%",
    rewardSharingRatio: "65/35",
    totalStake: "18,750",
    growthQ: "+8.7%"
  },
  {
    id: "TN-003",
    wallet: "QuantumTrainer",
    description: "Experimental node with quantum-inspired algorithms for complex optimization problems.",
    delegatorAPY: "9.1%",
    rewardSharingRatio: "75/25",
    totalStake: "32,100",
    growthQ: "+15.2%"
  },
  {
    id: "TN-004",
    wallet: "AILearner",
    description: "General-purpose node with balanced resources for various AI training tasks.",
    delegatorAPY: "6.8%",
    rewardSharingRatio: "60/40",
    totalStake: "12,300",
    growthQ: "+5.9%"
  },
  {
    id: "TN-005",
    wallet: "DeepMindNode",
    description: "Specialized in deep reinforcement learning with custom FPGA acceleration.",
    delegatorAPY: "8.7%",
    rewardSharingRatio: "72/28",
    totalStake: "27,800",
    growthQ: "+11.5%"
  },
  {
    id: "TN-006",
    wallet: "TensorForge",
    description: "Enterprise-grade AI training node with redundant systems and 99.99% uptime guarantee.",
    delegatorAPY: "7.5%",
    rewardSharingRatio: "68/32",
    totalStake: "41,200",
    growthQ: "+9.8%"
  },
  {
    id: "TN-007",
    wallet: "CognitiveEngine",
    description: "Specializes in multimodal learning models combining vision and language understanding.",
    delegatorAPY: "8.2%",
    rewardSharingRatio: "71/29",
    totalStake: "29,600",
    growthQ: "+13.1%"
  },
  {
    id: "TN-008",
    wallet: "SynthNode",
    description: "Focused on synthetic data generation and augmentation for training data-hungry models.",
    delegatorAPY: "8.9%",
    rewardSharingRatio: "73/27",
    totalStake: "22,100",
    growthQ: "+14.7%"
  },
];

// Mock data for my delegations
const myDelegations = [
  {
    id: "TN-002",
    wallet: "NeuralNode",
    stakedAmount: "2,500",
    dateStaked: "2023-11-15",
    projectedReward: "197.5",
    status: "active"
  },
  {
    id: "TN-005",
    wallet: "DeepMindNode",
    stakedAmount: "1,800",
    dateStaked: "2023-12-03",
    projectedReward: "156.6",
    status: "active"
  },
  {
    id: "TN-007",
    wallet: "CognitiveEngine",
    stakedAmount: "3,200",
    dateStaked: "2024-01-20",
    projectedReward: "262.4",
    status: "active"
  }
];

export default function StakeToEarn() {
  const { user, addCredits } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [stakeDialogOpen, setStakeDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const nodesPerPage = 5;

  const filteredNodes = trainerNodes.filter(node => 
    node.wallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastNode = currentPage * nodesPerPage;
  const indexOfFirstNode = indexOfLastNode - nodesPerPage;
  const currentNodes = filteredNodes.slice(indexOfFirstNode, indexOfLastNode);
  const totalPages = Math.ceil(filteredNodes.length / nodesPerPage);

  const handleStake = (node: any) => {
    setSelectedNode(node);
    setStakeDialogOpen(true);
  };

  const handleSubmitStake = () => {
    if (!selectedNode || !stakeAmount) return;
    
    const amount = parseInt(stakeAmount, 10);
    if (isNaN(amount) || amount <= 0 || amount > (user?.credits || 0)) {
      alert("Please enter a valid stake amount");
      return;
    }
    
    // In a real application, this would be an API call
    addCredits(-amount, `Staked ${amount} credits to ${selectedNode.wallet}`);
    
    setStakeDialogOpen(false);
    setStakeAmount("");
    // We would update myDelegations here in a real app
  };

  return (
    <div className="min-h-screen bg-background pt-6 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Stake to Earn</h1>
          <p className="text-muted-foreground">
            Stake SoraChain tokens to earn rewards by delegating to trainer nodes
          </p>
        </div>

        <div className="mb-8">
          <BlurredCard>
            <div className="p-6 border-b border-border">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-medium">Trainer Nodes</h2>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search nodes..."
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
                      <TableHead>Wallet/Account</TableHead>
                      <TableHead>Delegator APY</TableHead>
                      <TableHead>Reward-Sharing Ratio</TableHead>
                      <TableHead>Total Stake</TableHead>
                      <TableHead>Quarterly Delegation Growth</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentNodes.map((node) => (
                      <TableRow key={node.id}>
                        <TableCell>{node.id}</TableCell>
                        <TableCell className="font-medium">
                          <div className="group relative">
                            {node.wallet}
                            <span className="absolute left-0 bottom-full mb-2 w-64 bg-background border border-border rounded p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              {node.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-green-600">{node.delegatorAPY}</TableCell>
                        <TableCell>{node.rewardSharingRatio}</TableCell>
                        <TableCell>{node.totalStake}</TableCell>
                        <TableCell className="text-green-600">{node.growthQ}</TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => handleStake(node)}>
                            Stake
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </BlurredCard>
        </div>

        <div>
          <BlurredCard>
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-medium">My Delegations</h2>
              </div>
            </div>
            
            <div className="p-6">
              {myDelegations.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Wallet/Account</TableHead>
                        <TableHead>Staked Amount</TableHead>
                        <TableHead>Date Staked</TableHead>
                        <TableHead>Projected Rewards</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myDelegations.map((delegation) => (
                        <TableRow key={delegation.id}>
                          <TableCell>{delegation.id}</TableCell>
                          <TableCell className="font-medium">{delegation.wallet}</TableCell>
                          <TableCell>{delegation.stakedAmount}</TableCell>
                          <TableCell>{delegation.dateStaked}</TableCell>
                          <TableCell className="text-green-600">{delegation.projectedReward}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {delegation.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>You haven't delegated any stakes yet</p>
                  <p className="text-sm">Stake with a trainer node to start earning rewards</p>
                </div>
              )}
            </div>
          </BlurredCard>
        </div>
      </div>

      {/* Stake Dialog */}
      <Dialog open={stakeDialogOpen} onOpenChange={setStakeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Stake to {selectedNode?.wallet}</DialogTitle>
            <DialogDescription>
              Delegate your tokens to this node and earn rewards based on performance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Reward-Sharing Ratio:</div>
              <div>{selectedNode?.rewardSharingRatio}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Delegator APY:</div>
              <div className="text-green-600">{selectedNode?.delegatorAPY}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Your Credits:</div>
              <div>{user?.credits || 0}</div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount to Stake
              </label>
              <Input
                id="amount"
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
            <Button onClick={handleSubmitStake}>Stake Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
