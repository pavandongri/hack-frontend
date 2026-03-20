"use client";

import "@/components/map/leafletFix";
import type { MapLocation } from "@/types/common.types";
import { Box } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

export type { MapLocation };

type MapPickerProps = {
  location: MapLocation | null;
  setLocation: (loc: MapLocation) => void;
};

function RecenterOnLocation({ location }: { location: MapLocation | null }) {
  const map = useMap();
  useEffect(() => {
    if (!location) return;
    map.setView([location.lat, location.lng], map.getZoom());
  }, [location?.lat, location?.lng, map]);
  return null;
}

export default function MapPicker({ location, setLocation }: MapPickerProps) {
  function LocationPicker() {
    useMapEvents({
      click(e) {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    });

    return location ? <Marker position={[location.lat, location.lng]} /> : null;
  }

  const center: [number, number] = location ? [location.lat, location.lng] : [17.385044, 78.486671];

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 280,
        borderRadius: 2,
        overflow: "hidden",
        "& .leaflet-container": {
          height: "100%",
          width: "100%",
          fontFamily: "inherit"
        }
      }}
    >
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <RecenterOnLocation location={location} />
        <LocationPicker />
      </MapContainer>
    </Box>
  );
}
