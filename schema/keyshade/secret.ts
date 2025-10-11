import { z } from "zod";
import { KeyshadeUserSchema, PaginatedResponseSchema } from "./base.ts";

// Secret version schema
export const SecretVersionSchema = z.object({
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

// Secret schema
export const KeyshadeSecretSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    slug: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    note: z.string().nullable().optional(),
    rotateAt: z.string().nullable().optional(),
    lastUpdatedBy: KeyshadeUserSchema.pick({
      id: true,
      name: true,
      profilePictureUrl: true,
    })
      .partial()
      .optional(),
    project: z
      .object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
      })
      .optional(),
    versions: z.array(SecretVersionSchema).optional(),
  })
  .passthrough();

// Secret input schemas
export const ListSecretsInputSchema = {
  projectSlug: z.string().describe("The slug of the project"),
  decryptValue: z
    .boolean()
    .optional()
    .describe("Whether to decrypt secret values"),
};

export const ListSecretsInEnvironmentInputSchema = {
  projectSlug: z.string().describe("The slug of the project"),
  environmentSlug: z.string().describe("The slug of the environment"),
};

// Secret response schemas
export const KeyshadeSecretsResponse =
  PaginatedResponseSchema(KeyshadeSecretSchema);

export const SecretInEnvironmentSchema = z.object({
  name: z.string(),
  value: z.string(),
  isPlaintext: z.boolean(),
});
