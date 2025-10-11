import { z } from "zod";
import { KeyshadeUserSchema, PaginatedResponseSchema } from "./base.ts";

// Project schema
export const KeyshadeProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDisabled: z.boolean().optional(),
  accessLevel: z.enum(["GLOBAL", "INTERNAL", "PRIVATE"]).optional(),
  pendingCreation: z.boolean().optional(),
  isForked: z.boolean().optional(),
  lastUpdatedBy: KeyshadeUserSchema.pick({
    id: true,
    name: true,
    profilePictureUrl: true,
  })
    .partial()
    .nullable(),
  totalEnvironments: z.number().optional(),
  totalSecrets: z.number().optional(),
  totalVariables: z.number().optional(),
  maxAllowedEnvironments: z.number().optional(),
  maxAllowedSecrets: z.number().optional(),
  maxAllowedVariables: z.number().optional(),
});

// Project input schemas
export const GetProjectInputSchema = {
  projectSlug: z.string().describe("The slug of the project to retrieve"),
};

export const ListProjectsInputSchema = {
  workspaceSlug: z.string().describe("The slug of the workspace"),
};

// Project response schemas
export const KeyshadeProjectsResponse =
  PaginatedResponseSchema(KeyshadeProjectSchema);
