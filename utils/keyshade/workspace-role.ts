import { fetchKeyshadeApi, buildQueryParams } from "../api-client.ts";
import { KeyshadeWorkspaceRolesResponse } from "../../schema/index.ts";

/**
 * Lists all roles within a specific workspace.
 *
 * @param workspaceSlug - The slug of the workspace
 * @param params - Pagination parameters
 * @returns Promise with the list of workspace roles
 */
export async function listWorkspaceRoles(
  workspaceSlug: string,
  params: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
  }
) {
  const queryParams = buildQueryParams({
    page: params.page ?? 0,
    limit: params.limit ?? 10,
    sort: params.sort ?? "name",
    order: params.order ?? "asc",
    search: params.search ?? "",
  });

  return fetchKeyshadeApi(
    `/api/workspace-role/${workspaceSlug}/all?${queryParams}`,
    KeyshadeWorkspaceRolesResponse
  );
}
