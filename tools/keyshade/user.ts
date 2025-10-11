import { z } from "zod";
import { getMcpServer } from "../../mcp-server/index.ts";
import { checkHealth, getCurrentUser } from "../../utils/index.ts";

/**
 * Registers user-related tools with the MCP server.
 */
export function registerUserTools() {
  const server = getMcpServer();

  // Health check tool
  server.registerTool(
    "health_check",
    {
      description: "Check if the Keyshade API is healthy",
      inputSchema: {},
      annotations: {
        title: "Health Check",
      },
    },
    checkHealth
  );

  // Get current user tool
  server.registerTool(
    "get_user",
    {
      description: "Get current user information",
      inputSchema: {},
      annotations: {
        title: "Get Current User",
      },
    },
    getCurrentUser
  );
}
