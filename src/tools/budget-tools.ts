import { CallToolRequest, CallToolResult } from '@modelcontextprotocol/sdk';
import { KubecostClient } from '../client/kubecost-client.js';
import { BudgetRule } from '../types/kubecost.js';

export interface BudgetTools {
  kubecostClient: KubecostClient;
}

export const budgetTools = {
  list_budgets: {
    description: 'List all budget rules in Kubecost',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },

  get_budget: {
    description: 'Get detailed information about a specific budget rule',
    inputSchema: {
      type: 'object',
      properties: {
        budgetId: {
          type: 'string',
          description: 'The ID of the budget rule to retrieve',
        },
      },
      required: ['budgetId'],
    },
  },

  create_budget: {
    description: 'Create a new budget rule in Kubecost',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the budget rule',
        },
        values: {
          type: 'object',
          description: 'Budget scope values (cluster, namespace, labels)',
          properties: {
            cluster: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of cluster names to apply budget to',
            },
            namespace: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of namespace names to apply budget to',
            },
            label: {
              type: 'object',
              description: 'Label filters for budget scope',
            },
          },
        },
        kind: {
          type: 'string',
          enum: ['soft', 'hard'],
          description: 'Budget type - soft (warnings) or hard (enforcement)',
        },
        interval: {
          type: 'string',
          enum: ['weekly', 'monthly'],
          description: 'Budget reset interval',
        },
        intervalDay: {
          type: 'number',
          description: 'Day of week (1-7) or month (1-31) for budget reset',
        },
        spendLimit: {
          type: 'number',
          description: 'Budget limit in USD',
        },
        actions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              percentage: {
                type: 'number',
                description: 'Percentage threshold for action',
              },
              emails: {
                type: 'array',
                items: { type: 'string' },
                description: 'Email addresses for notifications',
              },
              slackWebhooks: {
                type: 'array',
                items: { type: 'string' },
                description: 'Slack webhook URLs for notifications',
              },
              msTeamsWebhooks: {
                type: 'array',
                items: { type: 'string' },
                description: 'Microsoft Teams webhook URLs for notifications',
              },
            },
          },
          description: 'List of actions to take when budget thresholds are reached',
        },
      },
      required: ['name', 'values', 'kind', 'interval', 'intervalDay', 'spendLimit', 'actions'],
    },
  },

  update_budget: {
    description: 'Update an existing budget rule in Kubecost',
    inputSchema: {
      type: 'object',
      properties: {
        budgetId: {
          type: 'string',
          description: 'The ID of the budget rule to update',
        },
        name: {
          type: 'string',
          description: 'Name of the budget rule',
        },
        values: {
          type: 'object',
          description: 'Budget scope values (cluster, namespace, labels)',
          properties: {
            cluster: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of cluster names to apply budget to',
            },
            namespace: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of namespace names to apply budget to',
            },
            label: {
              type: 'object',
              description: 'Label filters for budget scope',
            },
          },
        },
        kind: {
          type: 'string',
          enum: ['soft', 'hard'],
          description: 'Budget type - soft (warnings) or hard (enforcement)',
        },
        interval: {
          type: 'string',
          enum: ['weekly', 'monthly'],
          description: 'Budget reset interval',
        },
        intervalDay: {
          type: 'number',
          description: 'Day of week (1-7) or month (1-31) for budget reset',
        },
        spendLimit: {
          type: 'number',
          description: 'Budget limit in USD',
        },
        actions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              percentage: {
                type: 'number',
                description: 'Percentage threshold for action',
              },
              emails: {
                type: 'array',
                items: { type: 'string' },
                description: 'Email addresses for notifications',
              },
              slackWebhooks: {
                type: 'array',
                items: { type: 'string' },
                description: 'Slack webhook URLs for notifications',
              },
              msTeamsWebhooks: {
                type: 'array',
                items: { type: 'string' },
                description: 'Microsoft Teams webhook URLs for notifications',
              },
            },
          },
          description: 'List of actions to take when budget thresholds are reached',
        },
      },
      required: ['budgetId'],
    },
  },

  delete_budget: {
    description: 'Delete a budget rule from Kubecost',
    inputSchema: {
      type: 'object',
      properties: {
        budgetId: {
          type: 'string',
          description: 'The ID of the budget rule to delete',
        },
      },
      required: ['budgetId'],
    },
  },
};

export async function handleBudgetToolCall(
  request: CallToolRequest,
  { kubecostClient }: BudgetTools,
): Promise<CallToolResult> {
  const { name, arguments: args } = request;

  try {
    switch (name) {
      case 'list_budgets': {
        const budgets = await kubecostClient.listBudgets();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(budgets, null, 2),
            },
          ],
        };
      }

      case 'get_budget': {
        const { budgetId } = args as { budgetId: string };
        const budget = await kubecostClient.getBudget(budgetId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(budget, null, 2),
            },
          ],
        };
      }

      case 'create_budget': {
        const budgetData = args as BudgetRule;
        const budget = await kubecostClient.createOrUpdateBudget(budgetData);
        return {
          content: [
            {
              type: 'text',
              text: `Budget created successfully: ${JSON.stringify(budget, null, 2)}`,
            },
          ],
        };
      }

      case 'update_budget': {
        const { budgetId, ...budgetData } = args as BudgetRule & { budgetId: string };
        const budget = await kubecostClient.createOrUpdateBudget({
          ...budgetData,
          id: budgetId,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Budget updated successfully: ${JSON.stringify(budget, null, 2)}`,
            },
          ],
        };
      }

      case 'delete_budget': {
        const { budgetId } = args as { budgetId: string };
        await kubecostClient.deleteBudget(budgetId);
        return {
          content: [
            {
              type: 'text',
              text: `Budget with ID ${budgetId} deleted successfully`,
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