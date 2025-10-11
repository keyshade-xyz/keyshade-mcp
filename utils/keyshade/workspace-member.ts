import { fetchKeyshadeApi, buildQueryParams } from "../api-client.ts";
import { KeyshadeWorkspaceMembersResponse } from "../../schema/index.ts";

/**
 * Lists all members of a specific workspace.
 *
 * @param workspaceSlug - The slug of the workspace
 * @param params - Pagination parameters
 * @returns Promise with the list of workspace members
 */
export async function listWorkspaceMembers(
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
    `/api/workspace-membership/${workspaceSlug}/members?${queryParams}`,
    KeyshadeWorkspaceMembersResponse
  );
}
