import { z } from "zod";
import { getMcpServer } from "../../mcp-server/index.ts";
import { getWorkspaceEvents } from "../../utils/index.ts";
import {
  GetWorkspaceEventsInputSchema,
} from "../../schema/index.ts";

/**
 * Registers event-related tools with the MCP server.
 */
export function registerEventTools() {
  const server = getMcpServer();

  // Get workspace events tool
  server.registerTool(
    "get_workspace_events",
    {
      description: "Gets events for a specific workspace",
      inputSchema: z
        .object({
          ...GetWorkspaceEventsInputSchema,
          page: z.number().optional().describe("Page number (0-based)"),
          limit: z.number().optional().describe("Number of items per page"),
          search: z.string().optional().describe("Search query"),
        })
        .shape,
      annotations: {
        title: "Get Workspace Events",
      },
    },
    async ({ workspaceSlug, source, page, limit, search }) => {
      return getWorkspaceEvents(workspaceSlug, { source, page, limit, search });
    }
  );
}
