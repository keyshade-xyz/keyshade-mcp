import { z } from "zod";
import { getMcpServer } from "../../mcp-server/index.ts";
import { listProjects, getProject } from "../../utils/index.ts";
import {
  PaginationQuerySchema,
  GetProjectInputSchema,
  ListProjectsInputSchema,
} from "../../schema/index.ts";

/**
 * Registers project-related tools with the MCP server.
 */
export function registerProjectTools() {
  const server = getMcpServer();

  // List projects tool
  server.registerTool(
    "list_projects",
    {
      description: "Lists all projects within a specific Keyshade workspace",
      inputSchema: z
        .object({
          ...ListProjectsInputSchema,
          ...PaginationQuerySchema,
        })
        .shape,
      annotations: {
        title: "List Projects",
      },
    },
    async ({ workspaceSlug, page, limit, sort, order, search }) => {
      return listProjects(workspaceSlug, { page, limit, sort, order, search });
    }
  );

  // Get project tool
  server.registerTool(
    "get_project",
    {
      description: "Gets details for a specific Keyshade project",
      inputSchema: z.object(GetProjectInputSchema).shape,
      annotations: {
        title: "Get Project",
      },
    },
    async ({ projectSlug }) => {
      return getProject(projectSlug);
    }
  );
}
