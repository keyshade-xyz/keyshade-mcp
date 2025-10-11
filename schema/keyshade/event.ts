import { z } from "zod";
import { KeyshadeUserSchema, PaginatedResponseSchema } from "./base.ts";

// Event schema
export const KeyshadeEventSchema = z.object({
  id: z.string(),
  source: z.enum([
    "SECRET",
    "VARIABLE",
    "ENVIRONMENT",
    "PROJECT",
    "WORKSPACE",
    "WORKSPACE_ROLE",
    "INTEGRATION",
  ]),
  triggerer: z.enum(["USER", "SYSTEM"]),
  severity: z.enum(["INFO", "WARN", "ERROR"]),
  type: z.string(),
  timestamp: z.string(),
  metadata: z.record(z.any()),
  user: KeyshadeUserSchema.pick({
    id: true,
    name: true,
  }).optional(),
  workspace: z
    .object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    })
    .optional(),
});

// Event input schemas
export const GetWorkspaceEventsInputSchema = {
  workspaceSlug: z.string().describe("The slug of the workspace"),
  source: z
    .enum([
      "SECRET",
      "VARIABLE",
      "ENVIRONMENT",
      "PROJECT",
      "WORKSPACE",
      "WORKSPACE_ROLE",
      "INTEGRATION",
    ])
    .optional()
    .describe("Filter by event source"),
};

// Event response schemas
export const KeyshadeEventsResponse =
  PaginatedResponseSchema(KeyshadeEventSchema);
