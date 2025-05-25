import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "Keyshade-mcp",
  version: "0.1.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register a simple hello_world tool
server.tool(
  "hello_world",
  "Returns a simple Hello World message from Keyshade-mcp",
  {}, // No input parameters
  async () => {
    return {
      content: [
        {
          type: "text",
          text: "Hello World from Keyshade-mcp!",
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Keyshade-mcp Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});