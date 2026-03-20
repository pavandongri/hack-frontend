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

  // watchPosition: first fix is often coarse (IP/cell → e.g. regional city); later updates can move the pin to you.
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation not supported");
      setLoadingLocation(false);
      return;
    }

    const stopTimer = setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
    }, 25000);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setStart(coords);
        setLoadingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setErrorMsg(error.message || "Failed to get location");
        setLoadingLocation(false);
        navigator.geolocation.clearWatch(watchId);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
    );

    return () => {
      clearTimeout(stopTimer);
      navigator.geolocation.clearWatch(watchId);
    };
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
        timeout: 20000,
        maximumAge: 0
      }
    );
  };

  // 🔍 Handle search (ONLY updates after backend route is ready)
  const handleSearch = async (s: [number, number], e: [number, number]) => {
    try {
      setStart(s);
      setEnd(e);
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <LocationSearch onSearch={handleSearch} loading={routeLoading} />

      <Box
        sx={{
          height: "60vh",
          width: "100%",
          borderRadius: 1.5,
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

        <LeafletMap start={start} end={end} setRouteLoading={setRouteLoading} />
      </Box>
    </Box>
  );
}
