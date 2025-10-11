import { fetchKeyshadeApi, buildQueryParams } from "../api-client.ts";
import { KeyshadeEventsResponse } from "../../schema/index.ts";

/**
 * Gets events for a specific workspace.
 *
 * @param workspaceSlug - The slug of the workspace
 * @param params - Query parameters including source filter and pagination
 * @returns Promise with the list of events
 */
export async function getWorkspaceEvents(
  workspaceSlug: string,
  params: {
    source?:
      | "SECRET"
      | "VARIABLE"
      | "ENVIRONMENT"
      | "PROJECT"
      | "WORKSPACE"
      | "WORKSPACE_ROLE"
      | "INTEGRATION";
    page?: number;
    limit?: number;
    search?: string;
  }
) {
  const queryParams = buildQueryParams({
    page: params.page ?? 0,
    limit: params.limit ?? 10,
    search: params.search ?? "",
    ...(params.source && { source: params.source }),
  });

  return fetchKeyshadeApi(
    `/api/event/${workspaceSlug}?${queryParams}`,
    KeyshadeEventsResponse
  );
}
