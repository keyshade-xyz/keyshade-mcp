import { z } from "zod";
import { KeyshadeUserSchema, PaginatedResponseSchema } from "./base.ts";

// Workspace schema
export const KeyshadeWorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  isFreeTier: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  ownerId: z.string(),
  lastUpdatedBy: KeyshadeUserSchema.pick({
    id: true,
    name: true,
    profilePictureUrl: true,
  })
    .partial()
    .nullable(),
});

// Workspace input schemas
export const GetWorkspaceInputSchema = {
  workspaceSlug: z.string().describe("The slug of the workspace to retrieve"),
};

// Workspace response schemas
export const KeyshadeWorkspacesResponse =
  PaginatedResponseSchema(KeyshadeWorkspaceSchema);
