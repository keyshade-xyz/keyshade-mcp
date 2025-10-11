import { z } from "zod";
import { PaginatedResponseSchema } from "./base.ts";

// API Key schema
export const KeyshadeApiKeySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  value: z.string().optional(), // Only present on creation
  authorities: z.array(z.string()),
  expiresAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// API Key input schemas
export const GetApiKeyInputSchema = {
  apiKeySlug: z.string().describe("The slug of the API key to retrieve"),
};

// API Key response schemas
export const KeyshadeApiKeysResponse =
  PaginatedResponseSchema(KeyshadeApiKeySchema);
