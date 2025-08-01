// Kubecost Budget API Types

export interface BudgetRule {
  id?: string;
  name: string;
  values: {
    cluster?: string[];
    namespace?: string[];
    label?: Record<string, string[]>;
  };
  kind: 'soft' | 'hard';
  interval: 'weekly' | 'monthly';
  intervalDay: number;
  spendLimit: number;
  actions: BudgetAction[];
}

export interface BudgetAction {
  percentage: number;
  emails?: string[];
  slackWebhooks?: string[];
  msTeamsWebhooks?: string[];
}

export interface BudgetResponse {
  id: string;
  name: string;
  values: {
    cluster?: string[];
    namespace?: string[];
    label?: Record<string, string[]>;
  };
  kind: 'soft' | 'hard';
  interval: 'weekly' | 'monthly';
  intervalDay: number;
  spendLimit: number;
  actions: BudgetAction[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetListResponse {
  budgets: BudgetResponse[];
}

export interface KubecostConfig {
  baseUrl: string;
  apiToken?: string;
  username?: string;
  password?: string;
}

export interface CostAllocationResponse {
  data: {
    name: string;
    properties: {
      cluster: string;
      namespace: string;
      pod: string;
      container: string;
      node: string;
      provider: string;
      providerId: string;
      labels: Record<string, string>;
    };
    window: {
      start: string;
      end: string;
    };
    totals: {
      cpuCost: number;
      gpuCost: number;
      ramCost: number;
      pvCost: number;
      networkCost: number;
      lbCost: number;
      totalCost: number;
    };
  }[];
}

export interface AssetResponse {
  data: {
    name: string;
    properties: {
      cluster: string;
      type: string;
      provider: string;
      providerId: string;
      account: string;
      project: string;
      service: string;
      category: string;
      labels: Record<string, string>;
    };
    window: {
      start: string;
      end: string;
    };
    totals: {
      cost: number;
      adjustment: number;
      totalCost: number;
    };
  }[];
} 