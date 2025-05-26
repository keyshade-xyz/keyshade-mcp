import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z, ZodRawShape } from "zod";
import fetch from 'node-fetch';
import {
  KeyshadeUserSchema,
  KeyshadeWorkspaceSchema,
  KeyshadeWorkspacesResponse,
  KeyshadeProjectSchema,
  KeyshadeProjectsResponse,
  KeyshadeEnvironmentSchema,
  KeyshadeEnvironmentsResponse,
  KeyshadeSecretSchema,
  KeyshadeVariableSchema,
  KeyshadeVariablesResponse,
  KeyshadeApiKeySchema,
  KeyshadeApiKeysResponse,
  KeyshadeEventsResponse,
  KeyshadeWorkspaceRolesResponse,
  KeyshadeWorkspaceMembersResponse
} from "./schema.js";

const KEYSHADE_BASE_URL = process.env.KEYSHADE_API_URL || "https://api.keyshade.xyz";
const KEYSHADE_API_KEY = process.env.KEYSHADE_API_KEY;

async function fetchKeyshadeApi(endpoint: string, schema: z.ZodTypeAny): Promise<any> {
  if (!KEYSHADE_API_KEY) {
    return {
      content: [{ 
        type: "text", 
        text: "Keyshade API key is not configured. Please set the KEYSHADE_API_KEY environment variable." 
      }],
      isError: true
    };
  }

  try {
    const response = await fetch(`${KEYSHADE_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-keyshade-token': KEYSHADE_API_KEY,
      },
    });

    if (!response.ok) {
      return {
        content: [{ 
          type: "text", 
          text: `API request failed with status ${response.status}: ${await response.text()}` 
        }],
        isError: true
      };
    }

    const data = await response.json();
    const parsedData = schema.safeParse(data);

    if (!parsedData.success) {
      return {
        content: [{ 
          type: "text", 
          text: `API response validation failed: ${parsedData.error.message}` 
        }],
        isError: true
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(parsedData.data, null, 2) }],
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: "text", 
        text: `Error fetching from Keyshade API: ${error.message}` 
      }],
      isError: true
    };
  }
}

// Create server instance
const server = new McpServer({
  name: "Keyshade-mcp",
  version: "0.1.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Health check tool
server.tool(
  "health_check",
  "Check if the Keyshade API is healthy",
  {} as ZodRawShape,
  async () => {
    return fetchKeyshadeApi("/api/health", z.any());
  },
);

// User info tool
server.tool(
  "get_user",
  "Get current user information",
  {} as ZodRawShape,
  async () => {
    return fetchKeyshadeApi("/api/user", KeyshadeUserSchema);
  }
);

// Tool to list workspaces (with pagination support)
server.tool(
  "list_workspaces",
  "Lists all accessible Keyshade workspaces with pagination support",
  z.object({
    page: z.number().optional().describe("Page number (0-based)"),
    limit: z.number().optional().describe("Number of items per page"),
    sort: z.string().optional().describe("Sort field"),
    order: z.enum(['asc', 'desc']).optional().describe("Sort order"),
    search: z.string().optional().describe("Search query")
  }).shape,
  async ({ page = 0, limit = 10, sort = 'name', order = 'asc', search = '' }) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      order,
      search
    });
    return fetchKeyshadeApi(`/api/workspace?${queryParams}`, KeyshadeWorkspacesResponse);
  }
);

// Tool to get a specific workspace
server.tool(
  "get_workspace",
  "Gets details for a specific Keyshade workspace",
  z.object({
    workspaceSlug: z.string().describe("The slug of the workspace to retrieve"),
  }).shape,
  async ({ workspaceSlug }) => {
    return fetchKeyshadeApi(`/api/workspace/${workspaceSlug}`, KeyshadeWorkspaceSchema);
  }
);

// Tool to list projects in a workspace
server.tool(
  "list_projects",
  "Lists all projects within a specific Keyshade workspace",
  z.object({
    workspaceSlug: z.string().describe("The slug of the workspace"),
    page: z.number().optional().describe("Page number (0-based)"),
    limit: z.number().optional().describe("Number of items per page"),
    sort: z.string().optional().describe("Sort field"),
    order: z.enum(['asc', 'desc']).optional().describe("Sort order"),
    search: z.string().optional().describe("Search query")
  }).shape,
  async ({ workspaceSlug, page = 0, limit = 10, sort = 'name', order = 'asc', search = '' }) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      order,
      search
    });
    return fetchKeyshadeApi(`/api/project/all/${workspaceSlug}?${queryParams}`, KeyshadeProjectsResponse);
  }
);

// Tool to get a specific project
server.tool(
  "get_project",
  "Gets details for a specific Keyshade project",
  z.object({
    projectSlug: z.string().describe("The slug of the project to retrieve"),
  }).shape,
  async ({ projectSlug }) => {
    return fetchKeyshadeApi(`/api/project/${projectSlug}`, KeyshadeProjectSchema);
  }
);

// Tool to list environments in a project
server.tool(
  "list_environments",
  "Lists all environments within a specific Keyshade project",
  z.object({
    projectSlug: z.string().describe("The slug of the project"),
    page: z.number().optional().describe("Page number (0-based)"),
    limit: z.number().optional().describe("Number of items per page"),
    sort: z.string().optional().describe("Sort field"),
    order: z.enum(['asc', 'desc']).optional().describe("Sort order"),
    search: z.string().optional().describe("Search query")
  }).shape,
  async ({ projectSlug, page = 0, limit = 10, sort = 'name', order = 'asc', search = '' }) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      order,
      search
    });
    return fetchKeyshadeApi(`/api/environment/all/${projectSlug}?${queryParams}`, KeyshadeEnvironmentsResponse);
  }
);

// Tool to get a specific environment
server.tool(
  "get_environment",
  "Gets details for a specific Keyshade environment",
  z.object({
    environmentSlug: z.string().describe("The slug of the environment to retrieve"),
  }).shape,
  async ({ environmentSlug }) => {
    return fetchKeyshadeApi(`/api/environment/${environmentSlug}`, KeyshadeEnvironmentSchema);
  }
);

// Tool to list secrets in a project
server.tool(
  "list_secrets",
  "Lists all secrets within a specific Keyshade project",
  z.object({
    projectSlug: z.string().describe("The slug of the project"),
    decryptValue: z.boolean().optional().describe("Whether to decrypt secret values"),
    page: z.number().optional().describe("Page number (0-based)"),
    limit: z.number().optional().describe("Number of items per page"),
    sort: z.string().optional().describe("Sort field"),
    order: z.enum(['asc', 'desc']).optional().describe("Sort order"),
    search: z.string().optional().describe("Search query")
  }).shape,
  async ({ projectSlug, decryptValue = false, page = 0, limit = 10, sort = 'name', order = 'asc', search = '' }) => {
    const queryParams = new URLSearchParams({
      decryptValue: decryptValue.toString(),
      page: page.toString(),
      limit: limit.toString(),
      sort,
      order,
      search
    });
    return fetchKeyshadeApi(`/api/secret/${projectSlug}?${queryParams}`, z.any());
  }
);

// Tool to list secrets in an environment
server.tool(
  "list_secrets_in_environment",
  "Lists all secrets within a specific environment",
  z.object({
    projectSlug: z.string().describe("The slug of the project"),
    environmentSlug: z.string().describe("The slug of the environment"),
  }).shape,
  async ({ projectSlug, environmentSlug }) => {
    return fetchKeyshadeApi(`/api/secret/${projectSlug}/${environmentSlug}`, z.array(z.object({
      name: z.string(),
      value: z.string(),
      isPlaintext: z.boolean()
    })));
  }
);

// Tool to list variables in a project
server.tool(
  "list_variables",
  "Lists all variables within a specific Keyshade project",
  z.object({
    projectSlug: z.string().describe("The slug of the project"),
    page: z.number().optional().describe("Page number (0-based)"),
    limit: z.number().optional().describe("Number of items per page"),
    sort: z.string().optional().describe("Sort field"),
    order: z.enum(['asc', 'desc']).optional().describe("Sort order"),
    search: z.string().optional().describe("Search query")
  }).shape,
  async ({ projectSlug, page = 0, limit = 10, sort = 'name', order = 'asc', search = '' }) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      order,
      search
    });
    return fetchKeyshadeApi(`/api/variable/${projectSlug}?${queryParams}`, KeyshadeVariablesResponse);
  }
);

// Tool to list variables in an environment
server.tool(
  "list_variables_in_environment",
  "Lists all variables within a specific environment",
  z.object({
    projectSlug: z.string().describe("The slug of the project"),
    environmentSlug: z.string().describe("The slug of the environment"),
  }).shape,
  async ({ projectSlug, environmentSlug }) => {
    return fetchKeyshadeApi(`/api/variable/${projectSlug}/${environmentSlug}`, z.array(z.object({
      name: z.string(),
      value: z.string(),
      isPlaintext: z.boolean()
    })));
  }
);

// Tool to list API keys
server.tool(
  "list_api_keys",
  "Lists all API keys for the current user",
  z.object({
    page: z.number().optional().describe("Page number (0-based)"),
    limit: z.number().optional().describe("Number of items per page"),
    sort: z.string().optional().describe("Sort field"),
    order: z.enum(['asc', 'desc']).optional().describe("Sort order"),
    search: z.string().optional().describe("Search query")
  }).shape,
  async ({ page = 0, limit = 10, sort = 'name', order = 'asc', search = '' }) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      order,
      search
    });
    return fetchKeyshadeApi(`/api/api-key?${queryParams}`, KeyshadeApiKeysResponse);
  }
);

// Tool to get a specific API key
server.tool(
  "get_api_key",
  "Gets details for a specific API key",
  z.object({
    apiKeySlug: z.string().describe("The slug of the API key to retrieve"),
  }).shape,
  async ({ apiKeySlug }) => {
    return fetchKeyshadeApi(`/api/api-key/${apiKeySlug}`, KeyshadeApiKeySchema);
  }
);

// Tool to get workspace events
server.tool(
  "get_workspace_events",
  "Gets events for a specific workspace",
  z.object({
    workspaceSlug: z.string().describe("The slug of the workspace"),
    source: z.enum(['SECRET', 'VARIABLE', 'ENVIRONMENT', 'PROJECT', 'WORKSPACE', 'WORKSPACE_ROLE', 'INTEGRATION']).optional().describe("Filter by event source"),
    page: z.number().optional().describe("Page number (0-based)"),
    limit: z.number().optional().describe("Number of items per page"),
    search: z.string().optional().describe("Search query")
  }).shape,
  async ({ workspaceSlug, source, page = 0, limit = 10, search = '' }) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search
    });
    if (source) {
      queryParams.append('source', source);
    }
    return fetchKeyshadeApi(`/api/event/${workspaceSlug}?${queryParams}`, KeyshadeEventsResponse);
  }
);

// Tool to list workspace roles
server.tool(
  "list_workspace_roles",
  "Lists all roles within a specific workspace",
  z.object({
    workspaceSlug: z.string().describe("The slug of the workspace"),
    page: z.number().optional().describe("Page number (0-based)"),
    limit: z.number().optional().describe("Number of items per page"),
    sort: z.string().optional().describe("Sort field"),
    order: z.enum(['asc', 'desc']).optional().describe("Sort order"),
    search: z.string().optional().describe("Search query")
  }).shape,
  async ({ workspaceSlug, page = 0, limit = 10, sort = 'name', order = 'asc', search = '' }) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      order,
      search
    });
    return fetchKeyshadeApi(`/api/workspace-role/${workspaceSlug}/all?${queryParams}`, KeyshadeWorkspaceRolesResponse);
  }
);

// Tool to list workspace members
server.tool(
  "list_workspace_members",
  "Lists all members of a specific workspace",
  z.object({
    workspaceSlug: z.string().describe("The slug of the workspace"),
    page: z.number().optional().describe("Page number (0-based)"),
    limit: z.number().optional().describe("Number of items per page"),
    sort: z.string().optional().describe("Sort field"),
    order: z.enum(['asc', 'desc']).optional().describe("Sort order"),
    search: z.string().optional().describe("Search query")
  }).shape,
  async ({ workspaceSlug, page = 0, limit = 10, sort = 'name', order = 'asc', search = '' }) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      order,
      search
    });
    return fetchKeyshadeApi(`/api/workspace-membership/${workspaceSlug}/members?${queryParams}`, KeyshadeWorkspaceMembersResponse);
  }
);

// Tool for global search within a workspace
server.tool(
  "global_search",
  "Performs a global search within a workspace",
  z.object({
    workspaceSlug: z.string().describe("The slug of the workspace"),
    search: z.string().describe("Search query")
  }).shape,
  async ({ workspaceSlug, search }) => {
    return fetchKeyshadeApi(`/api/workspace/${workspaceSlug}/global-search/${encodeURIComponent(search)}`, z.object({
      projects: z.array(KeyshadeProjectSchema),
      environments: z.array(KeyshadeEnvironmentSchema),
      secrets: z.array(KeyshadeSecretSchema),
      variables: z.array(KeyshadeVariableSchema)
    }));
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Keyshade-mcp Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});