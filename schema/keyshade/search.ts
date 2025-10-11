import { z } from "zod";
import { KeyshadeProjectSchema } from "./project.js";
import { KeyshadeEnvironmentSchema } from "./environment.js";
import { KeyshadeSecretSchema } from "./secret.js";
import { KeyshadeVariableSchema } from "./variable.js";

// Search input schemas
export const GlobalSearchInputSchema = {
  workspaceSlug: z.string().describe("The slug of the workspace"),
  search: z.string().describe("Search query"),
};

// Search response schema
export const GlobalSearchResponseSchema = z.object({
  projects: z.array(KeyshadeProjectSchema),
  environments: z.array(KeyshadeEnvironmentSchema),
  secrets: z.array(KeyshadeSecretSchema),
  variables: z.array(KeyshadeVariableSchema),
});
