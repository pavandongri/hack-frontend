"use client";

import { LeafMapProps, RouteHazardPoint, RouteType } from "@/types/common.types";
import { Box } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap
} from "react-leaflet";
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

/** Remount when the route set changes so selection resets without an effect. */
function RoutePolylines({ routes }: { routes: RouteType[] }) {
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  return (
    <>
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
              ⏰ {(route.duration / 60).toFixed(1)} min | 📏 {(route.distance / 1000).toFixed(2)} km
            </Tooltip>
          </Polyline>
        );
      })}
    </>
  );
}

function routesIdentityKey(routes: RouteType[]): string {
  if (routes.length === 0) return "0";
  return routes
    .map((r) => `${r.distance}-${r.duration}-${r.geometry.coordinates.length}`)
    .join("|");
}

function hazardPointsKey(points: RouteHazardPoint[]): string {
  if (points.length === 0) return "0";
  return points.map((p) => p.id).join("|");
}

function HazardMarkers({ points }: { points: RouteHazardPoint[] }) {
  return (
    <>
      {points.map((h) => (
        <CircleMarker
          key={h.id}
          center={[h.latitude, h.longitude]}
          radius={9}
          pathOptions={{
            color: "#8b0000",
            fillColor: "#e53935",
            fillOpacity: 0.95,
            weight: 2
          }}
        >
          <Tooltip sticky direction="top">
            {h.category}
            {h.subcategory ? ` · ${h.subcategory}` : ""}
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}

const LeafletMap = ({ start, end, routes, hazardPoints = [] }: LeafMapProps) => {
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

        <RoutePolylines key={routesIdentityKey(routes)} routes={routes} />
        <HazardMarkers key={hazardPointsKey(hazardPoints)} points={hazardPoints} />
      </MapContainer>
    </Box>
  );
};

export default LeafletMap;
