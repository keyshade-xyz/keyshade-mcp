import { z } from "zod";
import { getMcpServer } from "../../mcp-server/index.ts";
import { listSecrets, listSecretsInEnvironment } from "../../utils/index.ts";
import {
  PaginationQuerySchema,
  ListSecretsInputSchema,
  ListSecretsInEnvironmentInputSchema,
} from "../../schema/index.ts";

/**
 * Registers secret-related tools with the MCP server.
 */
export function registerSecretTools() {
  const server = getMcpServer();

  // List secrets tool
  server.registerTool(
    "list_secrets",
    {
      description: "Lists all secrets within a specific Keyshade project",
      inputSchema: z
        .object({
          ...ListSecretsInputSchema,
          ...PaginationQuerySchema,
        })
        .shape,
      annotations: {
        title: "List Secrets",
      },
    },
    async ({
      projectSlug,
      decryptValue,
      page,
      limit,
      sort,
      order,
      search,
    }) => {
      return listSecrets(projectSlug, {
        decryptValue,
        page,
        limit,
        sort,
        order,
        search,
      });
    }
  );

  // List secrets in environment tool
  server.registerTool(
    "list_secrets_in_environment",
    {
      description: "Lists all secrets within a specific environment",
      inputSchema: z.object(ListSecretsInEnvironmentInputSchema).shape,
      annotations: {
        title: "List Secrets in Environment",
      },
    },
    async ({ projectSlug, environmentSlug }) => {
      return listSecretsInEnvironment(projectSlug, environmentSlug);
    }
  );
}
