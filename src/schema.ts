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

// --- GET Request Schemas ---

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
  }).optional(),
  createdBy: KeyshadeUserSchema.pick({
    id: true,
    name: true,
    profilePictureUrl: true
  }).optional(),
  createdOn: z.string().optional()
}).passthrough();

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
  }).partial().optional(),
  project: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string()
  }).optional(),
  versions: z.array(VariableVersionSchema).optional()
}).passthrough();

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

// --- CREATE Request Schemas ---

// Create Workspace
export const CreateWorkspaceRequestSchema = z.object({
  name: z.string(),
  icon: z.string().optional(),
});

// Create Project
export const CreateProjectRequestSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  storePrivateKey: z.boolean().optional(),
  accessLevel: z.enum(['GLOBAL', 'INTERNAL', 'PRIVATE']).optional(),
  environments: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
  })).optional(),
});

// Fork Project
export const ForkProjectRequestSchema = z.object({
  name: z.string(),
});

// Create Environment
export const CreateEnvironmentRequestSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

// Create Secret
export const CreateSecretRequestSchema = z.object({
  name: z.string(),
  note: z.string().optional(),
  rotateAfter: z.string().optional(),
  entries: z.array(z.object({
    environmentSlug: z.string(),
    value: z.string(),
  })),
});

// Create Variable
export const CreateVariableRequestSchema = z.object({
  name: z.string(),
  note: z.string().optional(),
  entries: z.array(z.object({
    environmentSlug: z.string(),
    value: z.string(),
  })),
});

// Create Workspace Role
export const CreateWorkspaceRoleRequestSchema = z.object({
  workspaceSlug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  colorCode: z.string().optional(),
  authorities: z.array(z.string()).optional(),
  projectEnvironments: z.array(z.object({
    projectSlug: z.string(),
    environmentSlugs: z.array(z.string()).optional(),
  })).optional(),
});

// --- DELETE Request Schemas ---

// Delete Environment
export const DeleteEnvironmentRequestSchema = z.object({
  environmentSlug: z.string(),
});

// Delete Project
export const DeleteProjectRequestSchema = z.object({
  projectSlug: z.string(),
});

// Unlink Fork Parent
export const UnlinkForkRequestSchema = z.object({
  projectSlug: z.string(),
});

// Delete Secret
export const DeleteSecretRequestSchema = z.object({
  secretSlug: z.string(),
});

// Delete Environment Value of Secret
export const DeleteSecretEnvironmentValueRequestSchema = z.object({
  secretSlug: z.string(),
  environmentSlug: z.string(),
});

// Delete Variable
export const DeleteVariableRequestSchema = z.object({
  variableSlug: z.string(),
});

// Delete Environment Value of Variable
export const DeleteVariableEnvironmentValueRequestSchema = z.object({
  variableSlug: z.string(),
  environmentSlug: z.string(),
});

// Delete Workspace
export const DeleteWorkspaceRequestSchema = z.object({
  workspaceSlug: z.string(),
});

// Delete Workspace Role
export const DeleteWorkspaceRoleRequestSchema = z.object({
  workspaceRoleSlug: z.string(),
});

// Leave Workspace
export const LeaveWorkspaceRequestSchema = z.object({
  workspaceSlug: z.string(),
});

// --- UPDATE Request Schemas ---

// Update Environment
export const UpdateEnvironmentRequestSchema = z.object({
  slug: z.string().describe("Environment slug to update"),
  name: z.string().optional().describe("New environment name"),
  description: z.string().optional().describe("New environment description"),
});

// Update Project
export const UpdateProjectRequestSchema = z.object({
  projectSlug: z.string().describe("Project slug to update"),
  name: z.string().optional().describe("New project name"),
  description: z.string().optional().describe("New project description"),
  storePrivateKey: z.boolean().optional().describe("Whether to store private key"),
  privateKey: z.string().optional().describe("Private key if storePrivateKey is true"),
  regenerateKeyPair: z.boolean().optional().describe("Whether to regenerate key pair"),
  accessLevel: z.enum(['GLOBAL', 'INTERNAL', 'PRIVATE']).optional().describe("Project access level"),
});

// Sync Fork
export const SyncForkRequestSchema = z.object({
  projectSlug: z.string().describe("Forked project slug to sync"),
  hardSync: z.boolean().optional().describe("Whether to perform hard sync (replaces everything)"),
});

// Update Secret
export const UpdateSecretRequestSchema = z.object({
  secretSlug: z.string().describe("Secret slug to update"),
  name: z.string().optional().describe("New secret name"),
  note: z.string().optional().describe("New secret note"),
  rotateAfter: z.string().optional().describe("Rotation interval (24, 168, 720, 8760, never)"),
  entries: z.array(z.object({
    environmentSlug: z.string(),
    value: z.string(),
  })).optional().describe("New secret values for environments"),
});

// Rollback Secret
export const RollbackSecretRequestSchema = z.object({
  secretSlug: z.string().describe("Secret slug to rollback"),
  environmentSlug: z.string().describe("Environment to rollback in"),
  version: z.number().describe("Version number to rollback to"),
});

// Update Variable
export const UpdateVariableRequestSchema = z.object({
  variableSlug: z.string().describe("Variable slug to update"),
  name: z.string().optional().describe("New variable name"),
  note: z.string().optional().describe("New variable note"),
  entries: z.array(z.object({
    environmentSlug: z.string(),
    value: z.string(),
  })).optional().describe("New variable values for environments"),
});

// Rollback Variable
export const RollbackVariableRequestSchema = z.object({
  variableSlug: z.string().describe("Variable slug to rollback"),
  environmentSlug: z.string().describe("Environment to rollback in"),
  version: z.number().describe("Version number to rollback to"),
});

// Update Workspace
export const UpdateWorkspaceRequestSchema = z.object({
  workspaceSlug: z.string().describe("Workspace slug to update"),
  name: z.string().optional().describe("New workspace name"),
  icon: z.string().optional().describe("New workspace icon"),
});

// Update Workspace Role
export const UpdateWorkspaceRoleRequestSchema = z.object({
  workspaceRoleSlug: z.string().describe("Workspace role slug to update"),
  name: z.string().optional().describe("New role name"),
  description: z.string().optional().describe("New role description"),
  colorCode: z.string().optional().describe("New role color code"),
  authorities: z.array(z.string()).optional().describe("New role authorities"),
  projectEnvironments: z.array(z.object({
    projectSlug: z.string(),
    environmentSlugs: z.array(z.string()).optional(),
  })).optional().describe("Project-environment access control"),
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
export const CreateWorkspaceResponseSchema = KeyshadeWorkspaceSchema;
export const CreateProjectResponseSchema = KeyshadeProjectSchema;
export const ForkProjectResponseSchema = KeyshadeProjectSchema;
export const CreateEnvironmentResponseSchema = KeyshadeEnvironmentSchema;
export const CreateSecretResponseSchema = KeyshadeSecretSchema;
export const CreateVariableResponseSchema = z.object({
  variable: KeyshadeVariableSchema
}).or(KeyshadeVariableSchema);
export const CreateWorkspaceRoleResponseSchema = KeyshadeWorkspaceRoleSchema;
export const UpdateEnvironmentResponseSchema = KeyshadeEnvironmentSchema;
export const UpdateProjectResponseSchema = KeyshadeProjectSchema;
export const SyncForkResponseSchema = KeyshadeProjectSchema;
export const UpdateSecretResponseSchema = z.object({
  secret: KeyshadeSecretSchema,
  updatedVersions: z.array(SecretVersionSchema).optional()
}).or(KeyshadeSecretSchema);
export const RollbackSecretResponseSchema = z.object({
  count: z.number().optional()
}).or(z.any());
export const UpdateVariableResponseSchema = z.object({
  variable: KeyshadeVariableSchema,
  updatedVersions: z.array(VariableVersionSchema).optional()
}).or(KeyshadeVariableSchema);
export const RollbackVariableResponseSchema = z.object({
  count: z.number().optional()
}).or(z.any());
export const UpdateWorkspaceResponseSchema = KeyshadeWorkspaceSchema;
export const UpdateWorkspaceRoleResponseSchema = KeyshadeWorkspaceRoleSchema;
export const DeleteResponseSchema = z.union([
  z.object({
    message: z.string().optional(),
    success: z.boolean().optional()
  }),
  z.null(),
  z.undefined(),
  z.any()
]);