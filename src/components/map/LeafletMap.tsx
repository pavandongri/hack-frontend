"use client";

import { getRoute } from "@/helpers/route.helpers";
import { LeafMapProps, RouteType } from "@/types/common.types";
import { Box } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import "./leafletFix";

const DEFAULT_CENTER: [number, number] = [22.5, 79.5];
const DEFAULT_ZOOM = 5;
const LOCATED_ZOOM = 13;
const colors = ["#007AFF", "#A020F0", "#61f2a0ff"];

const RecenterMap = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, map, zoom]);

  return null;
};

const LeafletMap = ({ start, end, setRouteLoading }: LeafMapProps) => {
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!start || !end) {
        setRoutes([]);
        return;
      }

      try {
        setRouteLoading(true);

        const routeData = await getRoute(start, end);

        setRoutes(routeData?.slice(0, 3) || []);
      } catch (err) {
        console.error("Route error:", err);
        setRoutes([]);
      } finally {
        setRouteLoading(false);
      }
    };

    fetchRoute();
  }, [start, end]);

  const center = start ?? DEFAULT_CENTER;
  const zoom = start ? LOCATED_ZOOM : DEFAULT_ZOOM;

  return (
    <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={center} zoom={zoom} />

        {start && <Marker position={start} />}
        {end && <Marker position={end} />}

        {routes.map((route, index) => {
          const latlngs = route.geometry.coordinates.map((c) => [c[1], c[0]] as [number, number]);
          const isSelected = selectedRouteIndex === index;

          return (
            <Polyline
              key={index}
              positions={latlngs}
              eventHandlers={{
                click: () => {
                  setSelectedRouteIndex(index);
                }
              }}
              pathOptions={{
                color: selectedRouteIndex === index ? colors[index] : colors[index] + "80",
                weight: isSelected ? 6 : 4,
                opacity: isSelected ? 1 : 0.8
              }}
            >
              <Tooltip sticky direction="top">
                🚗 {(route.duration / 60).toFixed(1)} min | 📏 {(route.distance / 1000).toFixed(2)}{" "}
                km
              </Tooltip>
            </Polyline>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default LeafletMap;
