import { z } from "zod";
import { getMcpServer } from "../../mcp-server/index.ts";
import { listWorkspaceRoles } from "../../utils/index.ts";
import {
  PaginationQuerySchema,
  ListWorkspaceRolesInputSchema,
} from "../../schema/index.ts";

/**
 * Registers workspace role-related tools with the MCP server.
 */
export function registerWorkspaceRoleTools() {
  const server = getMcpServer();

  // List workspace roles tool
  server.registerTool(
    "list_workspace_roles",
    {
      description: "Lists all roles within a specific workspace",
      inputSchema: z
        .object({
          ...ListWorkspaceRolesInputSchema,
          ...PaginationQuerySchema,
        })
        .shape,
      annotations: {
        title: "List Workspace Roles",
      },
    },
    async ({ workspaceSlug, page, limit, sort, order, search }) => {
      return listWorkspaceRoles(workspaceSlug, {
        page,
        limit,
        sort,
        order,
        search,
      });
    }
  );
}
