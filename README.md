# Kubecost MCP Server

An implementation of Model Context Protocol (MCP) server for Kubecost, enabling AI assistants to interact with your Kubecost cost management platform through natural language. This server allows for seamless integration with Visual Studio Code, Cursor, and other MCP clients through stdio transport protocol.

## Features

* **Transport Protocols**: Supports stdio transport mode for flexible integration with different clients
* **Complete Kubecost API Integration**: Provides comprehensive access to Kubecost resources and operations
* **Budget Management**: Full CRUD operations for budget rules with notifications
* **Cost Analysis**: Access to cost allocation and asset data
* **AI Assistant Ready**: Pre-configured tools for AI assistants to interact with Kubecost in natural language

## Installation

### Prerequisites

* Node.js (v18 or higher recommended)
* pnpm package manager (for development)
* Kubecost instance with API access
* Kubecost API token or username/password

### Usage with Cursor

1. Follow the Cursor documentation for MCP support, and create a `.cursor/mcp.json` file in your project:

```json
{
  "mcpServers": {
    "kubecost-mcp": {
      "command": "npx",
      "args": [
        "kubecost-mcp@latest",
        "stdio"
      ],
      "env": {
        "KUBECOST_BASE_URL": "<kubecost_url>",
        "KUBECOST_API_TOKEN": "<kubecost_token>"
      }
    }
  }
}
```

2. Start a conversation with Agent mode to use the MCP.

### Usage with VSCode

1. Follow the Use MCP servers in VS Code documentation, and create a `.vscode/mcp.json` file in your project:

```json
{
  "servers": {
    "kubecost-mcp-stdio": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "kubecost-mcp@latest",
        "stdio"
      ],
      "env": {
        "KUBECOST_BASE_URL": "<kubecost_url>",
        "KUBECOST_API_TOKEN": "<kubecost_token>"
      }
    }
  }
}
```

2. Start a conversation with an AI assistant in VS Code that supports MCP.

### Usage with Claude Desktop

1. Follow the MCP in Claude Desktop documentation, and create a `claude_desktop_config.json` configuration file:

```json
{
  "mcpServers": {
    "kubecost-mcp": {
      "command": "npx",
      "args": [
        "kubecost-mcp@latest",
        "stdio"
      ],
      "env": {
        "KUBECOST_BASE_URL": "<kubecost_url>",
        "KUBECOST_API_TOKEN": "<kubecost_token>"
      }
    }
  }
}
```

2. Configure Claude Desktop to use this configuration file in settings.

### Authentication Options

You can authenticate with Kubecost using either:

1. **API Token** (recommended):
   ```bash
   export KUBECOST_API_TOKEN="your-api-token"
   ```

2. **Username/Password**:
   ```bash
   export KUBECOST_USERNAME="your-username"
   export KUBECOST_PASSWORD="your-password"
   ```

### Self-signed Certificates

If your Kubecost instance uses self-signed certificates or certificates from a private Certificate Authority (CA), you may need to add the following environment variable to your configuration:

```
"NODE_TLS_REJECT_UNAUTHORIZED": "0"
```

This disables TLS certificate validation for Node.js when connecting to Kubecost instances using self-signed certificates or certificates from private CAs that aren't trusted by your system's certificate store.

> **Warning**: Disabling SSL verification reduces security. Use this setting only in development environments or when you understand the security implications.

## Available Tools

The server provides the following Kubecost management tools:

### Budget Management

* `list_budgets`: List all budget rules
* `get_budget`: Get detailed information about a specific budget rule
* `create_budget`: Create a new budget rule
* `update_budget`: Update an existing budget rule
* `delete_budget`: Delete a budget rule

### Cost Analysis

* `get_cost_allocation`: Get cost allocation data with filtering and aggregation
* `get_assets`: Get asset data with filtering and aggregation
* `health_check`: Check if Kubecost API is healthy and accessible

## Budget API Examples

### Create a Weekly Budget

Create a budget that resets every Wednesday with a budget of $100.00 USD, and will send an alert via email when spending has exceeded 75% of the spend limit:

```json
{
  "name": "budget-rule",
  "values": {
    "cluster": ["test"]
  },
  "kind": "soft",
  "interval": "weekly",
  "intervalDay": 3,
  "spendLimit": 100,
  "actions": [
    {
      "percentage": 75,
      "emails": [
        "admin@company.com"
      ]
    }
  ]
}
```

### Create a Monthly Budget

Create a budget for the `kubecost` namespace which resets on the 1st of every month with a budget of $400.00 USD, and will send alerts via Slack and Microsoft Teams when spending has exceeded $100.00 of the spend limit:

```json
{
  "name": "budget-rule-2",
  "values": {
    "namespace": ["kubecost"]
  },
  "kind": "soft",
  "interval": "monthly",
  "intervalDay": 1,
  "spendLimit": 400,
  "actions": [
    {
      "percentage": 25,
      "slackWebhooks": [
        "<example Slack webhook>"
      ],
      "msTeamsWebhooks": [
        "<example Teams webhook>"
      ]
    }
  ]
}
```

## For Development

1. Clone the repository:

```bash
git clone https://github.com/your-username/kubecost-mcp.git
cd kubecost-mcp
```

2. Install project dependencies:

```bash
pnpm install
```

3. Start the development server with hot reloading enabled:

```bash
pnpm run dev
```

Once the server is running, you can utilize the MCP server within Visual Studio Code or other MCP client.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `KUBECOST_BASE_URL` | Yes | The base URL of your Kubecost instance |
| `KUBECOST_API_TOKEN` | No* | API token for authentication |
| `KUBECOST_USERNAME` | No* | Username for basic authentication |
| `KUBECOST_PASSWORD` | No* | Password for basic authentication |

*Either API token or username/password combination is required.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License

## About

This project provides a Model Context Protocol (MCP) server for Kubecost, enabling AI assistants to interact with cost management data through natural language.

### Topics

kubernetes devops ai cost-management mcp kubecost model-context-protocol mcp-server budget-api cost-analysis 