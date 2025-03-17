
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
    creditReward: 50
  },
  {
    id: "social-retweet",
    name: "Retweet/Share",
    description: "Retweet or share a post from the official account",
    creditReward: 25
  },
  {
    id: "github-star",
    name: "GitHub Star",
    description: "Star the project repository on GitHub",
    creditReward: 30
  },
  {
    id: "github-contribution",
    name: "GitHub Contribution",
    description: "Make a valid contribution to the project",
    creditReward: 100
  }
];
