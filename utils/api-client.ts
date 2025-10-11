import { z } from "zod";
import fetch from "node-fetch";

const KEYSHADE_BASE_URL =
  process.env.KEYSHADE_API_URL || "https://api.keyshade.xyz";
const KEYSHADE_API_KEY = process.env.KEYSHADE_API_KEY;

/**
 * Fetches data from the Keyshade API and validates it against a schema.
 *
 * @param endpoint - The API endpoint to fetch from
 * @param schema - Zod schema to validate the response
 * @returns Promise with the API response formatted for MCP
 */
export async function fetchKeyshadeApi(
  endpoint: string,
  schema: z.ZodTypeAny
): Promise<any> {
  if (!KEYSHADE_API_KEY) {
    return {
      content: [
        {
          type: "text",
          text: "Keyshade API key is not configured. Please set the KEYSHADE_API_KEY environment variable.",
        },
      ],
      isError: true,
    };
  }

  try {
    const response = await fetch(`${KEYSHADE_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-keyshade-token": KEYSHADE_API_KEY,
      },
    });

    if (!response.ok) {
      return {
        content: [
          {
            type: "text",
            text: `API request failed with status ${response.status}: ${await response.text()}`,
          },
        ],
        isError: true,
      };
    }

    const data = await response.json();
    const parsedData = schema.safeParse(data);

    if (!parsedData.success) {
      return {
        content: [
          {
            type: "text",
            text: `API response validation failed: ${parsedData.error.message}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(parsedData.data, null, 2) }],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error fetching from Keyshade API: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Builds query parameters string from an object.
 *
 * @param params - Object containing query parameters
 * @returns URLSearchParams instance
 */
export function buildQueryParams(params: Record<string, any>): URLSearchParams {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });
  
  return queryParams;
}
