export const API_ENDPOINTS = {
  SEARCH_LOCATION: "maps/search/location",
  SUBMIT_REPORT: "maps/report-hazard",
  /** GET query: sourceLat, sourceLng, destLat, destLng → wrapped { data: r1, r2, … } hazards */
  ROUTE_HAZARDS: "maps/list-hazards",
  /** POST body: raw GET /maps/list-hazards JSON → { data: { explanation } } */
  BEST_ROUTE_AI: "llm/best-route"
};

export const DEBOUNCE_DELAY = 500;
export const MAX_RESULTS = 5;
