import { z } from "zod";
import { KeyshadeUserSchema, PaginatedResponseSchema } from "./base.ts";
import { KeyshadeWorkspaceRoleSchema } from "./workspace-role.js";

// Workspace member schema
export const KeyshadeWorkspaceMemberSchema = z.object({
  id: z.string(),
  user: KeyshadeUserSchema,
  roles: z.array(
    z.object({
      role: KeyshadeWorkspaceRoleSchema,
    })
  ),
  invitationAccepted: z.boolean(),
});

// Workspace member input schemas
export const ListWorkspaceMembersInputSchema = {
  workspaceSlug: z.string().describe("The slug of the workspace"),
};

// Workspace member response schemas
export const KeyshadeWorkspaceMembersResponse = PaginatedResponseSchema(
  KeyshadeWorkspaceMemberSchema
);
