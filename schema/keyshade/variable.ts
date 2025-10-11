import { z } from "zod";
import { KeyshadeUserSchema, PaginatedResponseSchema } from "./base.ts";

// Variable version schema
export const VariableVersionSchema = z.object({
  value: z.string(),
  version: z.number(),
  environment: z.object({
    name: z.string(),
    id: z.string(),
    slug: z.string(),
  }),
  createdBy: KeyshadeUserSchema.pick({
    id: true,
    name: true,
    profilePictureUrl: true,
  }),
  createdOn: z.string(),
});

// Variable schema
export const KeyshadeVariableSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  note: z.string().nullable(),
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
  versions: z.array(VariableVersionSchema).optional(),
});

// Variable input schemas
export const ListVariablesInputSchema = {
  projectSlug: z.string().describe("The slug of the project"),
};

export const ListVariablesInEnvironmentInputSchema = {
  projectSlug: z.string().describe("The slug of the project"),
  environmentSlug: z.string().describe("The slug of the environment"),
};

// Variable response schemas
export const KeyshadeVariablesResponse = PaginatedResponseSchema(
  KeyshadeVariableSchema
);

export const VariableInEnvironmentSchema = z.object({
  name: z.string(),
  value: z.string(),
  isPlaintext: z.boolean(),
});
