import { z } from "zod";
import { getMcpServer } from "../../mcp-server/index.ts";
import { listApiKeys, getApiKey } from "../../utils/index.ts";
import {
  PaginationQuerySchema,
  GetApiKeyInputSchema,
} from "../../schema/index.ts";

/**
 * Registers API key-related tools with the MCP server.
 */
export function registerApiKeyTools() {
  const server = getMcpServer();

  // List API keys tool
  server.registerTool(
    "list_api_keys",
    {
      description: "Lists all API keys for the current user",
      inputSchema: z.object(PaginationQuerySchema).shape,
      annotations: {
        title: "List API Keys",
      },
    },
    async ({ page, limit, sort, order, search }) => {
      return listApiKeys({ page, limit, sort, order, search });
    }
  );

  // Get API key tool
  server.registerTool(
    "get_api_key",
    {
      description: "Gets details for a specific API key",
      inputSchema: z.object(GetApiKeyInputSchema).shape,
      annotations: {
        title: "Get API Key",
      },
    },
    async ({ apiKeySlug }) => {
      return getApiKey(apiKeySlug);
    }
  );
}
