import { z } from "zod";
import { getMcpServer } from "../../mcp-server/index.ts";
import { listEnvironments, getEnvironment } from "../../utils/index.ts";
import {
  PaginationQuerySchema,
  GetEnvironmentInputSchema,
  ListEnvironmentsInputSchema,
} from "../../schema/index.ts";

/**
 * Registers environment-related tools with the MCP server.
 */
export function registerEnvironmentTools() {
  const server = getMcpServer();

  // List environments tool
  server.registerTool(
    "list_environments",
    {
      description: "Lists all environments within a specific Keyshade project",
      inputSchema: z
        .object({
          ...ListEnvironmentsInputSchema,
          ...PaginationQuerySchema,
        })
        .shape,
      annotations: {
        title: "List Environments",
      },
    },
    async ({ projectSlug, page, limit, sort, order, search }) => {
      return listEnvironments(projectSlug, { page, limit, sort, order, search });
    }
  );

  // Get environment tool
  server.registerTool(
    "get_environment",
    {
      description: "Gets details for a specific Keyshade environment",
      inputSchema: z.object(GetEnvironmentInputSchema).shape,
      annotations: {
        title: "Get Environment",
      },
    },
    async ({ environmentSlug }) => {
      return getEnvironment(environmentSlug);
    }
  );
}
