import { z } from "zod";
import { PaginatedResponseSchema } from "./base.ts";

// Workspace role schema
export const KeyshadeWorkspaceRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  colorCode: z.string().nullable(),
  authorities: z.array(z.string()),
  hasAdminAuthority: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  projects: z
    .array(
      z.object({
        project: z.object({
          id: z.string(),
          slug: z.string(),
          name: z.string(),
        }),
        environments: z.array(
          z.object({
            id: z.string(),
            slug: z.string(),
            name: z.string(),
          })
        ),
      })
    )
    .optional(),
});

// Workspace role input schemas
export const ListWorkspaceRolesInputSchema = {
  workspaceSlug: z.string().describe("The slug of the workspace"),
};

// Workspace role response schemas
export const KeyshadeWorkspaceRolesResponse = PaginatedResponseSchema(
  KeyshadeWorkspaceRoleSchema
);
