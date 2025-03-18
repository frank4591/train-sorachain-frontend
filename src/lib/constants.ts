
export type UserRole = "client" | "delegator" | "validator" | "aggregator";

export const ROLES: { id: UserRole; name: string; description: string }[] = [
  {
    id: "client",
    name: "Client",
    description: "Access models and make predictions"
  },
  {
    id: "delegator",
    name: "Delegator",
    description: "Delegate compute resources to the network"
  },
  {
    id: "validator",
    name: "Validator",
    description: "Validate model training and results"
  },
  {
    id: "aggregator",
    name: "Aggregator",
    description: "Aggregate and process model weights"
  }
];

export type TaskStatus = "available" | "in_progress" | "completed" | "failed";

export type TaskRoleMap = {
  [taskId: string]: UserRole;
};

export type CreditEvent = {
  id: string;
  amount: number;
  reason: string;
  timestamp: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  requiredCredits: number;
  creditReward: number;
  status: TaskStatus;
  startDate: string;
  endDate: string;
  availableRoles: UserRole[];
  config?: string;
};

export type UserData = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  credits: number;
  authKey: string;
  tasks: string[]; // IDs of assigned tasks
  stakedTasks: string[]; // IDs of tasks the user has staked for
  taskRoles: TaskRoleMap; // Map of taskId -> role
  dateOfBirth?: string;
  country?: string;
  phoneNumber?: string;
  creditHistory: CreditEvent[];
};

// Mock tasks
export const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Model Training: Sentiment Analysis",
    description: "Train a sentiment analysis model on GitHub issue comments",
    availableRoles: ["validator", "aggregator", "delegator"],
    creditReward: 250,
    requiredCredits: 100,
    status: "available",
    startDate: "2023-10-15",
    endDate: "2023-10-30",
    config: "sentiment-analysis-config.yaml"
  },
  {
    id: "task-2",
    title: "Code Generation Fine-Tuning",
    description: "Fine-tune code generation model with GitHub repositories",
    availableRoles: ["client", "validator", "delegator"],
    creditReward: 400,
    requiredCredits: 150,
    status: "available",
    startDate: "2023-10-20",
    endDate: "2023-11-10",
    config: "code-gen-config.yaml"
  },
  {
    id: "task-3",
    title: "Model Weight Aggregation",
    description: "Aggregate model weights from distributed training",
    availableRoles: ["aggregator", "validator"],
    creditReward: 350,
    requiredCredits: 200,
    status: "in_progress",
    startDate: "2023-10-05",
    endDate: "2023-10-25",
    config: "weight-aggregation-config.yaml"
  },
  {
    id: "task-4",
    title: "Compute Resource Delegation",
    description: "Delegate GPU compute for distributed training",
    availableRoles: ["delegator", "client"],
    creditReward: 300,
    requiredCredits: 100,
    status: "available",
    startDate: "2023-10-25",
    endDate: "2023-11-15",
    config: "gpu-delegation-config.yaml"
  }
];

// Credit actions
export const CREDIT_ACTIONS = [
  {
    id: "social-post",
    name: "Social Media Post",
    description: "Post about the project on social media",
    creditReward: 50,
    verificationType: "manual"
  },
  {
    id: "social-retweet",
    name: "Retweet/Share",
    description: "Retweet or share a post from the official account",
    creditReward: 25,
    verificationType: "link"
  },
  {
    id: "github-star",
    name: "GitHub Star",
    description: "Star the project repository on GitHub",
    creditReward: 30,
    verificationType: "link"
  },
  {
    id: "github-contribution",
    name: "GitHub Contribution",
    description: "Make a valid contribution to the project",
    creditReward: 100,
    verificationType: "manual"
  },
  {
    id: "telegram-join",
    name: "Join Telegram Group",
    description: "Join our official Telegram group",
    creditReward: 20,
    verificationType: "link"
  },
  {
    id: "twitter-follow",
    name: "Follow on Twitter",
    description: "Follow our official Twitter account",
    creditReward: 15,
    verificationType: "link"
  },
  {
    id: "participate-training",
    name: "Participate in AI Training",
    description: "Complete a training cycle as a trainer node",
    creditReward: 200,
    verificationType: "automatic"
  }
];

// Social verification types
export const VERIFICATION_TOOLS = {
  twitter: {
    name: "Twitter API",
    description: "Verifies follows and retweets"
  },
  telegram: {
    name: "Telegram Bot API",
    description: "Verifies group memberships"
  },
  github: {
    name: "GitHub API",
    description: "Verifies stars and contributions"
  },
  manual: {
    name: "Manual Verification",
    description: "Verified by administrators"
  },
  automatic: {
    name: "On-chain Verification",
    description: "Automatically verified through blockchain"
  }
};

// Navigation links
export const NAVIGATION_LINKS = [
  {
    name: "Home",
    path: "/",
    external: false
  },
  {
    name: "Explore",
    path: "/explore",
    external: false
  },
  {
    name: "Stake to Earn",
    path: "/stake-earn",
    external: false
  },
  {
    name: "Stake to Develop",
    path: "/stake-develop",
    external: false
  },
  {
    name: "Docs",
    path: "https://docs.sorachain.ai",
    external: true
  }
];
