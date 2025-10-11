import { z } from "zod";
import { fetchKeyshadeApi } from "../api-client.ts";
import { KeyshadeUserSchema } from "../../schema/index.ts";

/**
 * Performs a health check on the Keyshade API.
 *
 * @returns Promise with the health check result
 */
export async function checkHealth() {
  return fetchKeyshadeApi("/api/health", z.any());
}

/**
 * Retrieves the current user's information.
 *
 * @returns Promise with the user data
 */
export async function getCurrentUser() {
  return fetchKeyshadeApi("/api/user", KeyshadeUserSchema);
}
