import { CallToolRequest, CallToolResult } from '@modelcontextprotocol/sdk';
import { KubecostClient } from '../client/kubecost-client.js';

export interface CostTools {
  kubecostClient: KubecostClient;
}

export const costTools = {
  get_cost_allocation: {
    description: 'Get cost allocation data from Kubecost',
    inputSchema: {
      type: 'object',
      properties: {
        window: {
          type: 'string',
          description: 'Time window for cost data (e.g., "7d", "30d", "1d")',
        },
        aggregate: {
          type: 'string',
          description: 'Aggregation level (e.g., "cluster", "namespace", "pod", "container")',
        },
        accumulate: {
          type: 'boolean',
          description: 'Whether to accumulate costs over time',
        },
        filters: {
          type: 'object',
          description: 'Filters to apply to the cost data',
        },
      },
      required: ['window'],
    },
  },

  get_assets: {
    description: 'Get asset data from Kubecost',
    inputSchema: {
      type: 'object',
      properties: {
        window: {
          type: 'string',
          description: 'Time window for asset data (e.g., "7d", "30d", "1d")',
        },
        aggregate: {
          type: 'string',
          description: 'Aggregation level (e.g., "cluster", "namespace", "type")',
        },
        filters: {
          type: 'object',
          description: 'Filters to apply to the asset data',
        },
      },
      required: ['window'],
    },
  },

  health_check: {
    description: 'Check if Kubecost API is healthy and accessible',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
};

export async function handleCostToolCall(
  request: CallToolRequest,
  { kubecostClient }: CostTools,
): Promise<CallToolResult> {
  const { name, arguments: args } = request;

  try {
    switch (name) {
      case 'get_cost_allocation': {
        const { window, aggregate, accumulate, filters } = args as {
          window: string;
          aggregate?: string;
          accumulate?: boolean;
          filters?: Record<string, string>;
        };
        
        const costData = await kubecostClient.getCostAllocation({
          window,
          aggregate,
          accumulate,
          filters,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(costData, null, 2),
            },
          ],
        };
      }

      case 'get_assets': {
        const { window, aggregate, filters } = args as {
          window: string;
          aggregate?: string;
          filters?: Record<string, string>;
        };
        
        const assetData = await kubecostClient.getAssets({
          window,
          aggregate,
          filters,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(assetData, null, 2),
            },
          ],
        };
      }

      case 'health_check': {
        const isHealthy = await kubecostClient.healthCheck();
        return {
          content: [
            {
              type: 'text',
              text: isHealthy 
                ? 'Kubecost API is healthy and accessible'
                : 'Kubecost API is not accessible',
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
} 