import { API_ENDPOINTS } from "@/constants/api.constants";
import { LocationOption } from "@/types/common.types";
import { apiClient } from "@/utils/api-client.util";

export const fetchLocationSuggestions = async (query: string): Promise<LocationOption[]> => {
  if (!query) return [];

  try {
    const res = await apiClient.get<any>(API_ENDPOINTS.SEARCH_LOCATION, {
      params: { q: query }
    });

    return res.data; // ✅ always array
  } catch (error) {
    console.error("Location fetch error:", error);
    return [];
  }
};
