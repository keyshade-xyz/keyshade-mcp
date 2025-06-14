import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z, ZodRawShape } from "zod";
import fetch, { RequestInit } from 'node-fetch';
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
  KeyshadeWorkspaceMembersResponse,
  CreateWorkspaceRequestSchema,
  CreateWorkspaceResponseSchema,
  CreateProjectRequestSchema,
  CreateProjectResponseSchema,
  ForkProjectRequestSchema,
  ForkProjectResponseSchema,
  CreateEnvironmentRequestSchema,
  CreateEnvironmentResponseSchema,
  CreateSecretRequestSchema,
  CreateSecretResponseSchema,
  CreateVariableRequestSchema,
  CreateVariableResponseSchema,
  CreateWorkspaceRoleRequestSchema,
  CreateWorkspaceRoleResponseSchema,
  DeleteEnvironmentRequestSchema,
  DeleteProjectRequestSchema,
  UnlinkForkRequestSchema,
  DeleteSecretRequestSchema,
  DeleteSecretEnvironmentValueRequestSchema,
  DeleteVariableRequestSchema,
  DeleteVariableEnvironmentValueRequestSchema,
  DeleteWorkspaceRequestSchema,
  DeleteWorkspaceRoleRequestSchema,
  LeaveWorkspaceRequestSchema,
  DeleteResponseSchema
} from "./schema.js";

const KEYSHADE_BASE_URL = process.env.KEYSHADE_API_URL || "https://api.keyshade.xyz";
const KEYSHADE_API_KEY = process.env.KEYSHADE_API_KEY;

async function fetchKeyshadeApi(endpoint: string, schema: z.ZodTypeAny, fetchOptions?: RequestInit): Promise<any> {
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
    const defaultOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-keyshade-token': KEYSHADE_API_KEY,
      },
    };
    const options: RequestInit = {
      ...defaultOptions,
      ...fetchOptions,
      headers: {
        ...defaultOptions.headers,
        ...(fetchOptions && fetchOptions.headers),
      },
    };
    const response = await fetch(`${KEYSHADE_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      return {
        content: [{ 
          type: "text", 
          text: `API request failed with status ${response.status}: ${await response.text()}` 
        }],
        isError: true
      };
    }

    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    if (contentLength === '0' || response.status === 204 || !contentType?.includes('application/json')) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: true, 
            message: `Operation completed successfully (HTTP ${response.status})` 
          }, null, 2) 
        }]
      };
    }

    // Try to parse JSON response
    let data;
    try {
      const responseText = await response.text();
      if (!responseText.trim()) {
        // Empty response body
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify({ 
              success: true, 
              message: `Operation completed successfully (HTTP ${response.status})` 
            }, null, 2) 
          }]
        };
      }
      data = JSON.parse(responseText);
    } catch (jsonError) {
      // If JSON parsing fails, return the raw text
      const responseText = await response.text();
      return {
        content: [{ 
          type: "text", 
          text: responseText || `Operation completed successfully (HTTP ${response.status})` 
        }]
      };
    }

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      // If schema validation fails but we have data, return the raw data
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(data, null, 2) 
        }]
      };
    }
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify(parsed.data, null, 2) 
      }]
    };
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `API request error: ${error.message}` }],
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

// Tool for creating a new workspace
server.tool(
  "create_workspace",
  "Creates a new workspace in Keyshade",
  CreateWorkspaceRequestSchema.shape,
  async ({ name, icon }) => {
    return fetchKeyshadeApi(
      "/api/workspace",
      CreateWorkspaceResponseSchema,
      {
        method: "POST",
        body: JSON.stringify({ name, icon }),
      }
    );
  }
);

// Tool for creating a new project in a workspace
server.tool(
  "create_project",
  "Creates a new project in a workspace",
  CreateProjectRequestSchema.extend({ workspaceSlug: z.string() }).shape,
  async ({ workspaceSlug, ...data }) => {
    return fetchKeyshadeApi(
      `/api/project/${workspaceSlug}`,
      CreateProjectResponseSchema,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }
);

// Tool for forking an existing project
server.tool(
  "fork_project",
  "Forks an existing project",
  ForkProjectRequestSchema.extend({ projectSlug: z.string() }).shape,
  async ({ projectSlug, ...data }) => {
    return fetchKeyshadeApi(
      `/api/project/${projectSlug}/fork`,
      ForkProjectResponseSchema,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }
);

// Tool for creating a new environment
server.tool(
  "create_environment",
  "Creates a new environment in a project",
  CreateEnvironmentRequestSchema.extend({ projectSlug: z.string() }).shape,
  async ({ projectSlug, ...data }) => {
    return fetchKeyshadeApi(
      `/api/environment/${projectSlug}`,
      CreateEnvironmentResponseSchema,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }
);

// Tool for creating a new secret
server.tool(
  "create_secret",
  "Creates a new secret in a project",
  CreateSecretRequestSchema.extend({ projectSlug: z.string() }).shape,
  async ({ projectSlug, ...data }) => {
    return fetchKeyshadeApi(
      `/api/secret/${projectSlug}`,
      CreateSecretResponseSchema,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }
);

// Tool for creating a new variable
server.tool(
  "create_variable",
  "Creates a new variable in a project",
  CreateVariableRequestSchema.extend({ projectSlug: z.string() }).shape,
  async ({ projectSlug, ...data }) => {
    return fetchKeyshadeApi(
      `/api/variable/${projectSlug}`,
      CreateVariableResponseSchema,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }
);

// Tool for creating a new workspace role
server.tool(
  "create_workspace_role",
  "Creates a new workspace role",
  CreateWorkspaceRoleRequestSchema.shape,
  async (data) => {
    const { workspaceSlug, ...body } = data;
    return fetchKeyshadeApi(
      `/api/workspace-role/${workspaceSlug}`,
      CreateWorkspaceRoleResponseSchema,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
  }
);

// --- DELETE TOOLS ---

// Tool for deleting an environment
server.tool(
  "delete_environment",
  "Deletes an environment in a project",
  DeleteEnvironmentRequestSchema.shape,
  async ({ environmentSlug }) => {
    return fetchKeyshadeApi(
      `/api/environment/${environmentSlug}`,
      DeleteResponseSchema,
      {
        method: "DELETE",
      }
    );
  }
);

// Tool for deleting a project
server.tool(
  "delete_project",
  "Deletes a project",
  DeleteProjectRequestSchema.shape,
  async ({ projectSlug }) => {
    return fetchKeyshadeApi(
      `/api/project/${projectSlug}`,
      DeleteResponseSchema,
      {
        method: "DELETE",
      }
    );
  }
);

// Tool for unlinking a fork from its parent
server.tool(
  "unlink_fork_parent",
  "Unlinks a forked project from its parent project",
  UnlinkForkRequestSchema.shape,
  async ({ projectSlug }) => {
    return fetchKeyshadeApi(
      `/api/project/${projectSlug}/fork`,
      DeleteResponseSchema,
      {
        method: "DELETE",
      }
    );
  }
);

// Tool for deleting a secret
server.tool(
  "delete_secret",
  "Deletes a secret from a project",
  DeleteSecretRequestSchema.shape,
  async ({ secretSlug }) => {
    return fetchKeyshadeApi(
      `/api/secret/${secretSlug}`,
      DeleteResponseSchema,
      {
        method: "DELETE",
      }
    );
  }
);

// Tool for deleting an environment value of a secret
server.tool(
  "delete_secret_environment_value",
  "Deletes an environment-specific value of a secret",
  DeleteSecretEnvironmentValueRequestSchema.shape,
  async ({ secretSlug, environmentSlug }) => {
    return fetchKeyshadeApi(
      `/api/secret/${secretSlug}/${environmentSlug}`,
      DeleteResponseSchema,
      {
        method: "DELETE",
      }
    );
  }
);

// Tool for deleting a variable
server.tool(
  "delete_variable",
  "Deletes a variable from a project",
  DeleteVariableRequestSchema.shape,
  async ({ variableSlug }) => {
    return fetchKeyshadeApi(
      `/api/variable/${variableSlug}`,
      DeleteResponseSchema,
      {
        method: "DELETE",
      }
    );
  }
);

// Tool for deleting an environment value of a variable
server.tool(
  "delete_variable_environment_value",
  "Deletes an environment-specific value of a variable",
  DeleteVariableEnvironmentValueRequestSchema.shape,
  async ({ variableSlug, environmentSlug }) => {
    return fetchKeyshadeApi(
      `/api/variable/${variableSlug}/${environmentSlug}`,
      DeleteResponseSchema,
      {
        method: "DELETE",
      }
    );
  }
);

// Tool for deleting a workspace
server.tool(
  "delete_workspace",
  "Deletes a workspace",
  DeleteWorkspaceRequestSchema.shape,
  async ({ workspaceSlug }) => {
    return fetchKeyshadeApi(
      `/api/workspace/${workspaceSlug}`,
      DeleteResponseSchema,
      {
        method: "DELETE",
      }
    );
  }
);

// Tool for deleting a workspace role
server.tool(
  "delete_workspace_role",
  "Deletes a workspace role",
  DeleteWorkspaceRoleRequestSchema.shape,
  async ({ workspaceRoleSlug }) => {
    return fetchKeyshadeApi(
      `/api/workspace-role/${workspaceRoleSlug}`,
      DeleteResponseSchema,
      {
        method: "DELETE",
      }
    );
  }
);

// Tool for leaving a workspace
server.tool(
  "leave_workspace",
  "Leaves a workspace",
  LeaveWorkspaceRequestSchema.shape,
  async ({ workspaceSlug }) => {
    return fetchKeyshadeApi(
      `/api/workspace-membership/${workspaceSlug}/leave`,
      DeleteResponseSchema,
      {
        method: "DELETE",
      }
    );
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