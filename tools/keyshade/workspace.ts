import { z } from "zod";
import { getMcpServer } from "../../mcp-server/index.ts";
import { listWorkspaces, getWorkspace } from "../../utils/index.ts";
import {
  PaginationQuerySchema,
  GetWorkspaceInputSchema,
} from "../../schema/index.ts";

/**
 * Registers workspace-related tools with the MCP server.
 */
export function registerWorkspaceTools() {
  const server = getMcpServer();

  // List workspaces tool
  server.registerTool(
    "list_workspaces",
    {
      description:
        "Lists all accessible Keyshade workspaces with pagination support",
      inputSchema: z.object(PaginationQuerySchema).shape,
      annotations: {
        title: "List Workspaces",
      },
    },
    async ({ page, limit, sort, order, search }) => {
      return listWorkspaces({ page, limit, sort, order, search });
    }
  );

  // Get workspace tool
  server.registerTool(
    "get_workspace",
    {
      description: "Gets details for a specific Keyshade workspace",
      inputSchema: z.object(GetWorkspaceInputSchema).shape,
      annotations: {
        title: "Get Workspace",
      },
    },
    async ({ workspaceSlug }) => {
      return getWorkspace(workspaceSlug);
    }
  );
}
