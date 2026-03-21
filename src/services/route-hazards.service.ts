import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  Coordinates,
  RouteHazardBuckets,
  RouteHazardPoint,
  RouteHazardsResponse
} from "@/types/common.types";
import { apiClient } from "@/utils/api-client.util";

/** Collect all hazard points from every alternate route and risk bucket for map display. */
export function flattenRouteHazards(data: Record<string, RouteHazardBuckets>): RouteHazardPoint[] {
  const out: RouteHazardPoint[] = [];
  for (const buckets of Object.values(data)) {
    for (const list of Object.values(buckets)) {
      if (!Array.isArray(list)) continue;
      for (const item of list) {
        if (
          item &&
          typeof item.latitude === "number" &&
          typeof item.longitude === "number" &&
          typeof item.category === "string"
        ) {
          out.push(item);
        }
      }
    }
  }
  return out;
}

export async function fetchRouteHazards(
  start: Coordinates,
  end: Coordinates
): Promise<RouteHazardsResponse> {
  return apiClient.get<RouteHazardsResponse>(API_ENDPOINTS.ROUTE_HAZARDS, {
    params: {
      sourceLat: start[0],
      sourceLng: start[1],
      destLat: end[0],
      destLng: end[1]
    }
  });
}
