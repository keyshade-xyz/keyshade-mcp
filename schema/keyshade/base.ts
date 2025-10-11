import { z } from "zod";

// Base pagination metadata schema
export const PaginationMetadataSchema = z.object({
  totalCount: z.number(),
  links: z.object({
    self: z.string(),
    first: z.string(),
    previous: z.string().nullable(),
    next: z.string().nullable(),
    last: z.string(),
  }),
});

// Paginated response wrapper
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    items: z.array(itemSchema),
    metadata: PaginationMetadataSchema,
  });

// User schema
export const KeyshadeUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  profilePictureUrl: z.string().nullable(),
  isActive: z.boolean(),
  isOnboardingFinished: z.boolean(),
  isAdmin: z.boolean(),
});

// Common query parameters schema
export const PaginationQuerySchema = {
  page: z.number().optional().describe("Page number (0-based)"),
  limit: z.number().optional().describe("Number of items per page"),
  sort: z.string().optional().describe("Sort field"),
  order: z.enum(["asc", "desc"]).optional().describe("Sort order"),
  search: z.string().optional().describe("Search query"),
};
