import { fetchKeyshadeApi, buildQueryParams } from "../api-client.ts";
import {
  KeyshadeProjectSchema,
  KeyshadeProjectsResponse,
} from "../../schema/index.ts";

/**
 * Lists all projects within a specific workspace.
 *
 * @param workspaceSlug - The slug of the workspace
 * @param params - Pagination parameters
 * @returns Promise with the list of projects
 */
export async function listProjects(
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
    `/api/project/all/${workspaceSlug}?${queryParams}`,
    KeyshadeProjectsResponse
  );
}

/**
 * Gets details for a specific project.
 *
 * @param projectSlug - The slug of the project
 * @returns Promise with the project data
 */
export async function getProject(projectSlug: string) {
  return fetchKeyshadeApi(
    `/api/project/${projectSlug}`,
    KeyshadeProjectSchema
  );
}
