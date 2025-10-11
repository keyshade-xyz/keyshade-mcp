import { z } from "zod";
import { fetchKeyshadeApi, buildQueryParams } from "../api-client.ts";
import {
  KeyshadeVariablesResponse,
  VariableInEnvironmentSchema,
} from "../../schema/index.ts";

/**
 * Lists all variables within a specific project.
 *
 * @param projectSlug - The slug of the project
 * @param params - Pagination parameters
 * @returns Promise with the list of variables
 */
export async function listVariables(
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
    `/api/variable/${projectSlug}?${queryParams}`,
    KeyshadeVariablesResponse
  );
}

/**
 * Lists all variables within a specific environment.
 *
 * @param projectSlug - The slug of the project
 * @param environmentSlug - The slug of the environment
 * @returns Promise with the list of variables in the environment
 */
export async function listVariablesInEnvironment(
  projectSlug: string,
  environmentSlug: string
) {
  return fetchKeyshadeApi(
    `/api/variable/${projectSlug}/${environmentSlug}`,
    z.array(VariableInEnvironmentSchema)
  );
}
