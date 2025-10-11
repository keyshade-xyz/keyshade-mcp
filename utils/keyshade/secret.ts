import { z } from "zod";
import { fetchKeyshadeApi, buildQueryParams } from "../api-client.ts";
import { SecretInEnvironmentSchema } from "../../schema/index.ts";

/**
 * Lists all secrets within a specific project.
 *
 * @param projectSlug - The slug of the project
 * @param params - Query parameters including decryptValue and pagination
 * @returns Promise with the list of secrets
 */
export async function listSecrets(
  projectSlug: string,
  params: {
    decryptValue?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
  }
) {
  const queryParams = buildQueryParams({
    decryptValue: params.decryptValue ?? false,
    page: params.page ?? 0,
    limit: params.limit ?? 10,
    sort: params.sort ?? "name",
    order: params.order ?? "asc",
    search: params.search ?? "",
  });

  return fetchKeyshadeApi(`/api/secret/${projectSlug}?${queryParams}`, z.any());
}

/**
 * Lists all secrets within a specific environment.
 *
 * @param projectSlug - The slug of the project
 * @param environmentSlug - The slug of the environment
 * @returns Promise with the list of secrets in the environment
 */
export async function listSecretsInEnvironment(
  projectSlug: string,
  environmentSlug: string
) {
  return fetchKeyshadeApi(
    `/api/secret/${projectSlug}/${environmentSlug}`,
    z.array(SecretInEnvironmentSchema)
  );
}
