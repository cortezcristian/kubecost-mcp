#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { KubecostClient } from './client/kubecost-client.js';
import { KubecostConfig } from './types/kubecost.js';
import { z } from 'zod';

type ServerInfo = {
  kubecostBaseUrl: string;
  kubecostApiToken?: string;
  kubecostUsername?: string;
  kubecostPassword?: string;
};

export class Server extends McpServer {
  private kubecostClient: KubecostClient;

  constructor(serverInfo: ServerInfo) {
    super({
      name: 'kubecost-mcp',
      version: '0.1.0'
    });

    const config: KubecostConfig = {
      baseUrl: serverInfo.kubecostBaseUrl,
      apiToken: serverInfo.kubecostApiToken,
      username: serverInfo.kubecostUsername,
      password: serverInfo.kubecostPassword,
    };

    this.kubecostClient = new KubecostClient(config);

    // Register budget tools
    this.tool(
      'list_budgets',
      'List all budget rules in Kubecost',
      {},
      async () => {
        try {
          const result = await this.kubecostClient.listBudgets();
          return {
            isError: false,
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          return {
            isError: true,
            content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }]
          };
        }
      }
    );

    this.tool(
      'get_budget',
      'Get detailed information about a specific budget rule',
      { budgetId: z.string() },
      async ({ budgetId }) => {
        try {
          const result = await this.kubecostClient.getBudget(budgetId);
          return {
            isError: false,
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          return {
            isError: true,
            content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }]
          };
        }
      }
    );

    this.tool(
      'create_budget',
      'Create a new budget rule in Kubecost',
      {
        name: z.string(),
        values: z.object({
          cluster: z.array(z.string()).optional(),
          namespace: z.array(z.string()).optional(),
          label: z.record(z.array(z.string())).optional(),
        }),
        kind: z.enum(['soft', 'hard']),
        interval: z.enum(['weekly', 'monthly']),
        intervalDay: z.number(),
        spendLimit: z.number(),
        actions: z.array(z.object({
          percentage: z.number(),
          emails: z.array(z.string()).optional(),
          slackWebhooks: z.array(z.string()).optional(),
          msTeamsWebhooks: z.array(z.string()).optional(),
        })),
      },
      async (budgetData) => {
        try {
          const result = await this.kubecostClient.createOrUpdateBudget(budgetData);
          return {
            isError: false,
            content: [{ type: 'text', text: `Budget created successfully: ${JSON.stringify(result, null, 2)}` }]
          };
        } catch (error) {
          return {
            isError: true,
            content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }]
          };
        }
      }
    );

    this.tool(
      'update_budget',
      'Update an existing budget rule in Kubecost',
      {
        budgetId: z.string(),
        name: z.string(),
        values: z.object({
          cluster: z.array(z.string()).optional(),
          namespace: z.array(z.string()).optional(),
          label: z.record(z.array(z.string())).optional(),
        }),
        kind: z.enum(['soft', 'hard']),
        interval: z.enum(['weekly', 'monthly']),
        intervalDay: z.number(),
        spendLimit: z.number(),
        actions: z.array(z.object({
          percentage: z.number(),
          emails: z.array(z.string()).optional(),
          slackWebhooks: z.array(z.string()).optional(),
          msTeamsWebhooks: z.array(z.string()).optional(),
        })),
      },
      async ({ budgetId, ...budgetData }) => {
        try {
          const result = await this.kubecostClient.createOrUpdateBudget({
            ...budgetData,
            id: budgetId,
          });
          return {
            isError: false,
            content: [{ type: 'text', text: `Budget updated successfully: ${JSON.stringify(result, null, 2)}` }]
          };
        } catch (error) {
          return {
            isError: true,
            content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }]
          };
        }
      }
    );

    this.tool(
      'delete_budget',
      'Delete a budget rule from Kubecost',
      { budgetId: z.string() },
      async ({ budgetId }) => {
        try {
          await this.kubecostClient.deleteBudget(budgetId);
          return {
            isError: false,
            content: [{ type: 'text', text: `Budget with ID ${budgetId} deleted successfully` }]
          };
        } catch (error) {
          return {
            isError: true,
            content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }]
          };
        }
      }
    );

    // Register cost analysis tools
    this.tool(
      'get_cost_allocation',
      'Get cost allocation data from Kubecost',
      {
        window: z.string(),
        aggregate: z.string().optional(),
        accumulate: z.boolean().optional(),
        filters: z.record(z.string()).optional(),
      },
      async (params) => {
        try {
          const result = await this.kubecostClient.getCostAllocation(params);
          return {
            isError: false,
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          return {
            isError: true,
            content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }]
          };
        }
      }
    );

    this.tool(
      'get_assets',
      'Get asset data from Kubecost',
      {
        window: z.string(),
        aggregate: z.string().optional(),
        filters: z.record(z.string()).optional(),
      },
      async (params) => {
        try {
          const result = await this.kubecostClient.getAssets(params);
          return {
            isError: false,
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          return {
            isError: true,
            content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }]
          };
        }
      }
    );

    this.tool(
      'health_check',
      'Check if Kubecost API is healthy and accessible',
      {},
      async () => {
        try {
          const isHealthy = await this.kubecostClient.healthCheck();
          return {
            isError: false,
            content: [{ 
              type: 'text', 
              text: isHealthy 
                ? 'Kubecost API is healthy and accessible'
                : 'Kubecost API is not accessible'
            }]
          };
        } catch (error) {
          return {
            isError: true,
            content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }]
          };
        }
      }
    );
  }
}

export const createServer = (serverInfo: ServerInfo) => {
  return new Server(serverInfo);
};

async function main() {
  // Get configuration from environment variables
  const serverInfo: ServerInfo = {
    kubecostBaseUrl: process.env.KUBECOST_BASE_URL || 'http://localhost:9090',
    kubecostApiToken: process.env.KUBECOST_API_TOKEN,
    kubecostUsername: process.env.KUBECOST_USERNAME,
    kubecostPassword: process.env.KUBECOST_PASSWORD,
  };

  // Validate required configuration
  if (!serverInfo.kubecostBaseUrl) {
    throw new Error('KUBECOST_BASE_URL environment variable is required');
  }

  if (!serverInfo.kubecostApiToken && (!serverInfo.kubecostUsername || !serverInfo.kubecostPassword)) {
    throw new Error('Either KUBECOST_API_TOKEN or both KUBECOST_USERNAME and KUBECOST_PASSWORD are required');
  }

  const server = createServer(serverInfo);
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error('Kubecost MCP server started');
}

main().catch((error) => {
  console.error('Failed to start Kubecost MCP server:', error);
  process.exit(1);
}); 