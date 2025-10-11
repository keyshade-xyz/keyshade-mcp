import { fetchKeyshadeApi, buildQueryParams } from "../api-client.ts";
import {
  KeyshadeApiKeySchema,
  KeyshadeApiKeysResponse,
} from "../../schema/index.ts";

/**
 * Lists all API keys for the current user.
 *
 * @param params - Pagination parameters
 * @returns Promise with the list of API keys
 */
export async function listApiKeys(params: {
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

  return fetchKeyshadeApi(`/api/api-key?${queryParams}`, KeyshadeApiKeysResponse);
}

/**
 * Gets details for a specific API key.
 *
 * @param apiKeySlug - The slug of the API key
 * @returns Promise with the API key data
 */
export async function getApiKey(apiKeySlug: string) {
  return fetchKeyshadeApi(`/api/api-key/${apiKeySlug}`, KeyshadeApiKeySchema);
}
