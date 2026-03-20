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

const LeafletMap = ({ start, end }: LeafMapProps) => {
  const [route, setRoute] = useState<[number, number][]>([]);

  // 🛣️ Fetch route ONLY when both start & end exist
  useEffect(() => {
    const fetchRoute = async () => {
      if (!start || !end) {
        setRoute([]); // clear old route
        return;
      }

      try {
        const coords = await getRoute(start, end);

        const formatted = coords.map((coord: [number, number]) => [coord[1], coord[0]]);

        setRoute(formatted);
      } catch (err) {
        console.error("Route error:", err);
        setRoute([]);
      }
    };

    fetchRoute();
  }, [start, end]);

  const center = start || DEFAULT_CENTER;

  console.log({ center });

  return (
    <MapContainer center={center} zoom={13} style={{ height: "500px", width: "100%" }}>
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
      {route.length > 0 && <Polyline positions={route} />}
    </MapContainer>
  );
};

export default LeafletMap;
