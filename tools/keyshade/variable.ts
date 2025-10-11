import { z } from "zod";
import { getMcpServer } from "../../mcp-server/index.ts";
import {
  listVariables,
  listVariablesInEnvironment,
} from "../../utils/index.ts";
import {
  PaginationQuerySchema,
  ListVariablesInputSchema,
  ListVariablesInEnvironmentInputSchema,
} from "../../schema/index.ts";

/**
 * Registers variable-related tools with the MCP server.
 */
export function registerVariableTools() {
  const server = getMcpServer();

  // List variables tool
  server.registerTool(
    "list_variables",
    {
      description: "Lists all variables within a specific Keyshade project",
      inputSchema: z
        .object({
          ...ListVariablesInputSchema,
          ...PaginationQuerySchema,
        })
        .shape,
      annotations: {
        title: "List Variables",
      },
    },
    async ({ projectSlug, page, limit, sort, order, search }) => {
      return listVariables(projectSlug, { page, limit, sort, order, search });
    }
  );

  // List variables in environment tool
  server.registerTool(
    "list_variables_in_environment",
    {
      description: "Lists all variables within a specific environment",
      inputSchema: z.object(ListVariablesInEnvironmentInputSchema).shape,
      annotations: {
        title: "List Variables in Environment",
      },
    },
    async ({ projectSlug, environmentSlug }) => {
      return listVariablesInEnvironment(projectSlug, environmentSlug);
    }
  );
}
