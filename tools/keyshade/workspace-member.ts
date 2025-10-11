import { z } from "zod";
import { getMcpServer } from "../../mcp-server/index.ts";
import { listWorkspaceMembers } from "../../utils/index.ts";
import {
  PaginationQuerySchema,
  ListWorkspaceMembersInputSchema,
} from "../../schema/index.ts";

/**
 * Registers workspace member-related tools with the MCP server.
 */
export function registerWorkspaceMemberTools() {
  const server = getMcpServer();

  // List workspace members tool
  server.registerTool(
    "list_workspace_members",
    {
      description: "Lists all members of a specific workspace",
      inputSchema: z
        .object({
          ...ListWorkspaceMembersInputSchema,
          ...PaginationQuerySchema,
        })
        .shape,
      annotations: {
        title: "List Workspace Members",
      },
    },
    async ({ workspaceSlug, page, limit, sort, order, search }) => {
      return listWorkspaceMembers(workspaceSlug, {
        page,
        limit,
        sort,
        order,
        search,
      });
    }
  );
}
