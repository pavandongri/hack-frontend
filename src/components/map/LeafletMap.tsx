"use client";

import { getRoute } from "@/helpers/route.helpers";
import { LeafMapProps } from "@/types/common.types";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import "./leafletFix";

// 📍 Default fallback (Hyderabad)
const DEFAULT_CENTER: [number, number] = [17.385044, 78.486671];

// 🔁 Recenter map when start changes
const RecenterMap = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
};

const LeafletMap = ({ start, end, setRouteLoading }: LeafMapProps) => {
  const [routes, setRoutes] = useState<[number, number][][]>([]);

  // 🛣️ Fetch route ONLY when both start & end exist
  useEffect(() => {
    const fetchRoute = async () => {
      if (!start || !end) {
        setRoutes([]);
        return;
      }

      try {
        setRouteLoading(true);
        const routeData = await getRoute(start, end);

        // take top 3 routes
        const topRoutes = routeData
          ?.slice(0, 3)
          ?.map((route: any) =>
            route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])
          );

        setRoutes(topRoutes);
        setRouteLoading(false);
      } catch (err) {
        console.error("Route error:", err);
        setRoutes([]);
        setRouteLoading(false);
      }
    };

    fetchRoute();
  }, [start, end]);

  const center = start || DEFAULT_CENTER;

  console.log({ center });

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🔁 Auto recenter */}
      <RecenterMap center={center} />

      {/* 📍 Markers */}
      {start && <Marker position={start} />}
      {end && <Marker position={end} />}

      {/* 🛣️ Route */}
      {routes.map((route, index) => {
        const colors = ["#007AFF", "#A020F0", "#FF3B30"];
        return (
          <Polyline
            key={index}
            positions={route}
            pathOptions={{
              color: colors[index] || "#666",
              weight: index === 0 ? 6 : 4,
              opacity: index === 0 ? 1 : 0.85
            }}
          />
        );
      })}
    </MapContainer>
  );
};

export default LeafletMap;
