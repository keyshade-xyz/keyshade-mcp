import { fetchKeyshadeApi, buildQueryParams } from "../api-client.ts";
import {
  KeyshadeWorkspaceSchema,
  KeyshadeWorkspacesResponse,
  PaginationQuerySchema,
} from "../../schema/index.ts";

/**
 * Lists all accessible workspaces with pagination support.
 *
 * @param params - Pagination parameters
 * @returns Promise with the list of workspaces
 */
export async function listWorkspaces(params: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
}) {
  const queryParams = buildQueryParams({
    page: params.page ?? 0,
    limit: params.limit ?? 10,
    sort: params.sort ?? "name",
    order: params.order ?? "asc",
    search: params.search ?? "",
  });

  return fetchKeyshadeApi(
    `/api/workspace?${queryParams}`,
    KeyshadeWorkspacesResponse
  );
}

/**
 * Gets details for a specific workspace.
 *
 * @param workspaceSlug - The slug of the workspace
 * @returns Promise with the workspace data
 */
export async function getWorkspace(workspaceSlug: string) {
  return fetchKeyshadeApi(
    `/api/workspace/${workspaceSlug}`,
    KeyshadeWorkspaceSchema
  );
}
