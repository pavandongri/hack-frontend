import { API_ENDPOINTS } from "@/constants/api.constants";
import type { MapLocation } from "@/types/common.types";
import { apiClient } from "@/utils/api-client.util";

export type SubmitReportResult = {
  id?: string;
  message?: string;
  [key: string]: unknown;
};

export async function submitReport(
  images: File[],
  location: MapLocation
): Promise<SubmitReportResult> {
  const formData = new FormData();

  for (const file of images) {
    formData.append("images", file);
  }

  formData.append("lat", String(location.lat));
  formData.append("lng", String(location.lng));

  return apiClient.postForm<SubmitReportResult>(API_ENDPOINTS.SUBMIT_REPORT, formData);
}
