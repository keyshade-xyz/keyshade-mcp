import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Singleton class responsible for managing the instance of {@link McpServer}.
 *
 * Use {@link McpServerInstance.getMcpServerInstance} to access the single instance of the server.
 * The server is initialized with default metadata and capabilities if not already created.
 */
class McpServerInstance {
  private static _instance: McpServer | null = null;

  private constructor() {}

  public static getMcpServerInstance(): McpServer {
    if (!McpServerInstance._instance) {
      McpServerInstance._instance = new McpServer(
        {
          name: "Keyshade-mcp",
          version: "1.0.0",
          description:
            "MCP server for Keyshade - A tool for managing secrets, variables, environments, and projects",
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );
    }
    return McpServerInstance._instance;
  }
}

/**
 * Retrieves the singleton instance of the MCP server.
 *
 * @returns {McpServer} The MCP server instance.
 */
export const getMcpServer = () => McpServerInstance.getMcpServerInstance();
