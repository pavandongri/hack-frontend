"use client";

import LocationSearch from "@/components/search/LocationSearch";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import {
  alpha,
  Box,
  Button,
  Card,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false
});

export default function MapWrapper() {
  const theme = useTheme();
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);

  const [routeLoading, setRouteLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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
    <Box
      sx={{
        minHeight: "100%",
        pb: 2,
        mx: { xs: -2, sm: -3 },
        mt: { xs: -2, sm: -3 },
        px: { xs: 2, sm: 3 },
        pt: { xs: 2, sm: 3 },
        background:
          theme.palette.mode === "light"
            ? `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${theme.palette.background.default} 280px)`
            : undefined
      }}
    >
      <Stack spacing={3} sx={{ maxWidth: 1280, mx: "auto" }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: 2, sm: 3 },
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha("#1e3a5f", 0.95)} 42%, ${alpha(theme.palette.secondary.dark, 0.88)} 100%)`,
            color: "common.white",
            px: { xs: 2.5, sm: 3.5 },
            py: { xs: 2.5, sm: 3 },
            boxShadow: "0 20px 40px rgba(15, 23, 42, 0.28)"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -40,
              right: -20,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: alpha("#fff", 0.06),
              pointerEvents: "none"
            }}
          />
          <Stack direction="row" alignItems="center" spacing={1.75} sx={{ position: "relative" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 2.5,
                bgcolor: alpha("#fff", 0.14),
                flexShrink: 0
              }}
            >
              <ExploreOutlinedIcon sx={{ fontSize: 22, opacity: 0.95 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1.125rem", sm: "1.28rem" },
                  letterSpacing: "0.01em",
                  lineHeight: 1.35
                }}
              >
                Maps
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 0.65,
                  color: alpha("#fff", 0.88),
                  maxWidth: 560,
                  lineHeight: 1.55,
                  fontSize: { xs: "0.8125rem", sm: "0.875rem" }
                }}
              >
                Search a start and destination to see up to three route options. Your position is
                used as the default starting point when location access is allowed.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <LocationSearch onSearch={handleSearch} loading={routeLoading} />

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            position: "relative",
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, 0.9),
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)"
          }}
        >
          {routeLoading && (
            <LinearProgress
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1001,
                height: 3,
                borderRadius: 0
              }}
            />
          )}

          <Box
            sx={{
              height: { xs: "min(56vh, 420px)", sm: "min(62vh, 560px)" },
              width: "100%",
              minHeight: 320,
              position: "relative"
            }}
          >
            {loadingLocation && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 1000,
                  backdropFilter: "blur(8px)",
                  bgcolor: alpha(theme.palette.background.paper, 0.75),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5
                }}
              >
                <CircularProgress size={40} thickness={4} />
                <Typography variant="body2" color="text.secondary">
                  Getting your location…
                </Typography>
              </Box>
            )}

            {!loadingLocation && errorMsg && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 1000,
                  backdropFilter: "blur(6px)",
                  bgcolor: alpha(theme.palette.background.paper, 0.92),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 3,
                  textAlign: "center",
                  gap: 2
                }}
              >
                <Typography color="error" variant="body1">
                  {errorMsg}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
                  Allow location in your browser settings, or continue by choosing both points in
                  the search bar above.
                </Typography>
                <Button variant="contained" size="medium" onClick={retryLocation}>
                  Try again
                </Button>
              </Box>
            )}

            <LeafletMap start={start} end={end} setRouteLoading={setRouteLoading} />
          </Box>
        </Card>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", px: 0.5 }}>
          Click a route line to highlight it. Tooltips show duration and distance. Map data ©
          OpenStreetMap contributors.
        </Typography>
      </Stack>
    </Box>
  );
}
