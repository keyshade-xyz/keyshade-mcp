import { z } from "zod";
import { KeyshadeUserSchema, PaginatedResponseSchema } from "./base.ts";

// Environment schema
export const KeyshadeEnvironmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastUpdatedBy: KeyshadeUserSchema.pick({
    id: true,
    name: true,
    profilePictureUrl: true,
  }).partial(),
  project: z
    .object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    })
    .optional(),
});

// Environment input schemas
export const GetEnvironmentInputSchema = {
  environmentSlug: z
    .string()
    .describe("The slug of the environment to retrieve"),
};

export const ListEnvironmentsInputSchema = {
  projectSlug: z.string().describe("The slug of the project"),
};

// Environment response schemas
export const KeyshadeEnvironmentsResponse = PaginatedResponseSchema(
  KeyshadeEnvironmentSchema
);
