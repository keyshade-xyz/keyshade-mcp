import { registerUserTools } from "./keyshade/user.ts";
import { registerWorkspaceTools } from "./keyshade/workspace.ts";
import { registerProjectTools } from "./keyshade/project.ts";
import { registerEnvironmentTools } from "./keyshade/environment.ts";
import { registerSecretTools } from "./keyshade/secret.ts";
import { registerVariableTools } from "./keyshade/variable.ts";
import { registerApiKeyTools } from "./keyshade/api-key.ts";
import { registerEventTools } from "./keyshade/event.ts";
import { registerWorkspaceRoleTools } from "./keyshade/workspace-role.ts";
import { registerWorkspaceMemberTools } from "./keyshade/workspace-member.ts";
import { registerSearchTools } from "./keyshade/search.ts";

/**
 * Initialize all Keyshade tools by registering them with the MCP server.
 */
export function initTools() {
  registerUserTools();
  registerWorkspaceTools();
  registerProjectTools();
  registerEnvironmentTools();
  registerSecretTools();
  registerVariableTools();
  registerApiKeyTools();
  registerEventTools();
  registerWorkspaceRoleTools();
  registerWorkspaceMemberTools();
  registerSearchTools();
}
