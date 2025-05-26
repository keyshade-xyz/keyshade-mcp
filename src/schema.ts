import { z } from "zod";

// Base pagination metadata schema
export const PaginationMetadataSchema = z.object({
  totalCount: z.number(),
  links: z.object({
    self: z.string(),
    first: z.string(),
    previous: z.string().nullable(),
    next: z.string().nullable(),
    last: z.string()
  })
});
// Paginated response wrapper
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    metadata: PaginationMetadataSchema
  });

// User schema
export const KeyshadeUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  profilePictureUrl: z.string().nullable(),
  isActive: z.boolean(),
  isOnboardingFinished: z.boolean(),
  isAdmin: z.boolean()
});

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
    profilePictureUrl: true
  }).partial().nullable()
});

// Project schema
export const KeyshadeProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDisabled: z.boolean().optional(),
  accessLevel: z.enum(['GLOBAL', 'INTERNAL', 'PRIVATE']).optional(),
  pendingCreation: z.boolean().optional(),
  isForked: z.boolean().optional(),
  lastUpdatedBy: KeyshadeUserSchema.pick({
    id: true,
    name: true,
    profilePictureUrl: true
  }).partial().nullable(),
  // Additional fields for project listing
  totalEnvironments: z.number().optional(),
  totalSecrets: z.number().optional(),
  totalVariables: z.number().optional(),
  maxAllowedEnvironments: z.number().optional(),
  maxAllowedSecrets: z.number().optional(),
  maxAllowedVariables: z.number().optional()
});

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
    profilePictureUrl: true
  }).partial(),
  project: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string()
  }).optional()
});

// Secret version schema
export const SecretVersionSchema = z.object({
  value: z.string(),
  version: z.number(),
  environment: z.object({
    name: z.string(),
    id: z.string(),
    slug: z.string()
  }),
  createdBy: KeyshadeUserSchema.pick({
    id: true,
    name: true,
    profilePictureUrl: true
  }),
  createdOn: z.string()
});

// Secret schema
export const KeyshadeSecretSchema = z.object({
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
    profilePictureUrl: true
  }).partial().optional(),
  project: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string()
  }).optional(),
  versions: z.array(SecretVersionSchema).optional()
}).passthrough();

// Variable version schema
export const VariableVersionSchema = z.object({
  value: z.string(),
  version: z.number(),
  environment: z.object({
    name: z.string(),
    id: z.string(),
    slug: z.string()
  }),
  createdBy: KeyshadeUserSchema.pick({
    id: true,
    name: true,
    profilePictureUrl: true
  }),
  createdOn: z.string()
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
    profilePictureUrl: true
  }).partial(),
  project: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string()
  }).optional(),
  versions: z.array(VariableVersionSchema).optional()
});

// API Key schema
export const KeyshadeApiKeySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  value: z.string().optional(), // Only present on creation
  authorities: z.array(z.string()),
  expiresAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
});

// Event schema
export const KeyshadeEventSchema = z.object({
  id: z.string(),
  source: z.enum(['SECRET', 'VARIABLE', 'ENVIRONMENT', 'PROJECT', 'WORKSPACE', 'WORKSPACE_ROLE', 'INTEGRATION']),
  triggerer: z.enum(['USER', 'SYSTEM']),
  severity: z.enum(['INFO', 'WARN', 'ERROR']),
  type: z.string(),
  timestamp: z.string(),
  metadata: z.record(z.any()),
  user: KeyshadeUserSchema.pick({
    id: true,
    name: true
  }).optional(),
  workspace: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string()
  }).optional()
});

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
  projects: z.array(z.object({
    project: z.object({
      id: z.string(),
      slug: z.string(),
      name: z.string()
    }),
    environments: z.array(z.object({
      id: z.string(),
      slug: z.string(),
      name: z.string()
    }))
  })).optional()
});

// Workspace member schema
export const KeyshadeWorkspaceMemberSchema = z.object({
  id: z.string(),
  user: KeyshadeUserSchema,
  roles: z.array(z.object({
    role: KeyshadeWorkspaceRoleSchema
  })),
  invitationAccepted: z.boolean()
});

// Export response schemas
export const KeyshadeWorkspacesResponse = PaginatedResponseSchema(KeyshadeWorkspaceSchema);
export const KeyshadeProjectsResponse = PaginatedResponseSchema(KeyshadeProjectSchema);
export const KeyshadeEnvironmentsResponse = PaginatedResponseSchema(KeyshadeEnvironmentSchema);
export const KeyshadeSecretsResponse = PaginatedResponseSchema(KeyshadeSecretSchema);
export const KeyshadeVariablesResponse = PaginatedResponseSchema(KeyshadeVariableSchema);
export const KeyshadeApiKeysResponse = PaginatedResponseSchema(KeyshadeApiKeySchema);
export const KeyshadeEventsResponse = PaginatedResponseSchema(KeyshadeEventSchema);
export const KeyshadeWorkspaceRolesResponse = PaginatedResponseSchema(KeyshadeWorkspaceRoleSchema);
export const KeyshadeWorkspaceMembersResponse = PaginatedResponseSchema(KeyshadeWorkspaceMemberSchema);