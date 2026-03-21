import { API_ENDPOINTS } from "@/constants/api.constants";
import type { RouteHazardsResponse } from "@/types/common.types";
import { apiClient } from "@/utils/api-client.util";

/** Wrapped response from POST /llm/best-route. */
export type BestRouteLlmResponse = {
  success: boolean;
  message: string;
  data: {
    explanation: string;
  };
  requestId: string;
};

/** POST body is the raw JSON from GET /maps/list-hazards, unchanged. */
export async function fetchBestRouteFromAI(
  listHazardsResponse: RouteHazardsResponse
): Promise<BestRouteLlmResponse> {
  return apiClient.post<BestRouteLlmResponse>(API_ENDPOINTS.BEST_ROUTE_AI, listHazardsResponse);
}
