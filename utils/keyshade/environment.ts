import { fetchKeyshadeApi, buildQueryParams } from "../api-client.ts";
import {
  KeyshadeEnvironmentSchema,
  KeyshadeEnvironmentsResponse,
} from "../../schema/index.ts";

/**
 * Lists all environments within a specific project.
 *
 * @param projectSlug - The slug of the project
 * @param params - Pagination parameters
 * @returns Promise with the list of environments
 */
export async function listEnvironments(
  projectSlug: string,
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
    `/api/environment/all/${projectSlug}?${queryParams}`,
    KeyshadeEnvironmentsResponse
  );
}

/**
 * Gets details for a specific environment.
 *
 * @param environmentSlug - The slug of the environment
 * @returns Promise with the environment data
 */
export async function getEnvironment(environmentSlug: string) {
  return fetchKeyshadeApi(
    `/api/environment/${environmentSlug}`,
    KeyshadeEnvironmentSchema
  );
}
