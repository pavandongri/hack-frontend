"use client";

import LocationSearch from "@/components/search/LocationSearch";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false
});

export default function MapWrapper() {
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);

  const [routeLoading, setRouteLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 📍 Get user location on load
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation not supported");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];

        setStart(coords);
        setLoadingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setErrorMsg(error.message || "Failed to get location");
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  // 🔁 Retry location
  const retryLocation = () => {
    setLoadingLocation(true);
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];

        setStart(coords);
        setLoadingLocation(false);
      },
      (error) => {
        setErrorMsg(error.message || "Failed to get location");
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // 🔍 Handle search (ONLY updates after backend route is ready)
  const handleSearch = async (s: [number, number], e: [number, number]) => {
    setRouteLoading(true);

    try {
      // simulate backend delay (replace with real API)
      await new Promise((res) => setTimeout(res, 1500));

      setStart(s);
      setEnd(e);
    } catch (err) {
      console.error(err);
    } finally {
      setRouteLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <LocationSearch onSearch={handleSearch} loading={routeLoading} />

      <Box
        sx={{
          height: "500px",
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          boxShadow: 3
        }}
      >
        {/* 🔄 Loading user location */}
        {loadingLocation && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 1000,
              bgcolor: "rgba(255,255,255,0.7)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <CircularProgress />
            <Typography mt={1}>Getting your location...</Typography>
          </Box>
        )}

        {/* ❌ Error */}
        {!loadingLocation && errorMsg && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 1000,
              bgcolor: "rgba(255,255,255,0.9)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Typography color="error" mb={2}>
              {errorMsg}
            </Typography>

            <Button variant="contained" onClick={retryLocation}>
              Retry
            </Button>
          </Box>
        )}

        {/* 🔄 Route loading */}
        {routeLoading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 999,
              bgcolor: "rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <LeafletMap start={start} end={end} />
      </Box>
    </Box>
  );
}
