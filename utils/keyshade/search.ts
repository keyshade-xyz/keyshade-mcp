import { fetchKeyshadeApi } from "../api-client.ts";
import { GlobalSearchResponseSchema } from "../../schema/index.ts";

/**
 * Performs a global search within a workspace.
 *
 * @param workspaceSlug - The slug of the workspace
 * @param search - Search query
 * @returns Promise with the search results
 */
export async function globalSearch(workspaceSlug: string, search: string) {
  return fetchKeyshadeApi(
    `/api/workspace/${workspaceSlug}/global-search/${encodeURIComponent(search)}`,
    GlobalSearchResponseSchema
  );
}
