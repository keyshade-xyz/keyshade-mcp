import { z } from "zod";
import { getMcpServer } from "../../mcp-server/index.ts";
import { globalSearch } from "../../utils/index.ts";
import { GlobalSearchInputSchema } from "../../schema/index.ts";

/**
 * Registers search-related tools with the MCP server.
 */
export function registerSearchTools() {
  const server = getMcpServer();

  // Global search tool
  server.registerTool(
    "global_search",
    {
      description: "Performs a global search within a workspace",
      inputSchema: z.object(GlobalSearchInputSchema).shape,
      annotations: {
        title: "Global Search",
      },
    },
    async ({ workspaceSlug, search }) => {
      return globalSearch(workspaceSlug, search);
    }
  );
}
