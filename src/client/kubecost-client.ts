import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  BudgetRule,
  BudgetResponse,
  BudgetListResponse,
  KubecostConfig,
  CostAllocationResponse,
  AssetResponse,
} from '../types/kubecost.js';

export class KubecostClient {
  private client: AxiosInstance;
  private config: KubecostConfig;

  constructor(config: KubecostConfig) {
    this.config = config;
    
    const axiosConfig: AxiosRequestConfig = {
      baseURL: config.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add authentication
    if (config.apiToken) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        'Authorization': `Bearer ${config.apiToken}`,
      };
    } else if (config.username && config.password) {
      axiosConfig.auth = {
        username: config.username,
        password: config.password,
      };
    }

    this.client = axios.create(axiosConfig);
  }

  // Budget API Methods
  async createOrUpdateBudget(budget: BudgetRule): Promise<BudgetResponse> {
    const response = await this.client.post('/model/budget', budget);
    return response.data;
  }

  async getBudget(budgetId: string): Promise<BudgetResponse> {
    const response = await this.client.get(`/model/budget/${budgetId}`);
    return response.data;
  }

  async listBudgets(): Promise<BudgetListResponse> {
    const response = await this.client.get('/model/budget');
    return response.data;
  }

  async deleteBudget(budgetId: string): Promise<void> {
    await this.client.delete(`/model/budget/${budgetId}`);
  }

  // Cost Allocation API Methods
  async getCostAllocation(params: {
    window: string;
    aggregate?: string;
    accumulate?: boolean;
    filters?: Record<string, string>;
  }): Promise<CostAllocationResponse> {
    const response = await this.client.get('/model/allocation', { params });
    return response.data;
  }

  // Assets API Methods
  async getAssets(params: {
    window: string;
    aggregate?: string;
    filters?: Record<string, string>;
  }): Promise<AssetResponse> {
    const response = await this.client.get('/model/assets', { params });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/healthz');
      return true;
    } catch (error) {
      return false;
    }
  }
} 