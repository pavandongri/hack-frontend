"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { useState } from "react";

import { submitReport } from "@/services/report.service";

import type { MapLocation } from "@/types/common.types";

const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: 320,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "action.hover",
        borderRadius: 2
      }}
    >
      <Typography color="text.secondary" variant="body2">
        Loading map…
      </Typography>
    </Box>
  )
});

export default function Upload() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [location, setLocation] = useState<MapLocation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemove = (index: number) => {
    setPreviews((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      undefined,
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(false);

    if (images.length === 0) {
      setSubmitError("Add at least one photo.");
      return;
    }
    if (!location) {
      setSubmitError("Choose a location on the map or use “Use my location”.");
      return;
    }

    setSubmitting(true);
    try {
      await submitReport(images, location);
      setSubmitSuccess(true);
      previews.forEach((url) => URL.revokeObjectURL(url));
      setPreviews([]);
      setImages([]);
      setLocation(null);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        pb: 4
      }}
    >
      <Stack spacing={3}>
        <Box
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: (t) => alpha(t.palette.divider, 0.85),
            overflow: "hidden",
            bgcolor: "background.paper",
            boxShadow: (t) => `0 1px 2px ${alpha(t.palette.common.black, 0.04)}`
          }}
        >
          <Box
            sx={{
              height: 3,
              background: (t) =>
                `linear-gradient(90deg, ${t.palette.primary.main} 0%, ${alpha(
                  t.palette.primary.main,
                  0.45
                )} 55%, ${alpha(t.palette.secondary.main, 0.35)} 100%)`
            }}
          />
          <Box
            sx={{
              p: { xs: 2.5, sm: 3 },
              background: (t) =>
                `linear-gradient(145deg, ${alpha(t.palette.primary.main, 0.07)} 0%, ${alpha(
                  t.palette.background.paper,
                  1
                )} 38%, ${alpha(t.palette.primary.main, 0.03)} 100%)`
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2, sm: 2.5 }}
              alignItems={{ xs: "center", sm: "flex-start" }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  width: { xs: 52, sm: 56 },
                  height: { xs: 52, sm: 56 },
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                  color: "primary.main",
                  border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.2)}`
                }}
              >
                <CloudUploadRoundedIcon sx={{ fontSize: { xs: 26, sm: 28 } }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0, textAlign: { xs: "center", sm: "left" } }}>
                <Chip
                  icon={
                    <ReportProblemOutlinedIcon
                      sx={{ fontSize: 18, color: (t) => `${t.palette.primary.main} !important` }}
                    />
                  }
                  label="Road safety"
                  size="small"
                  sx={{
                    mb: 1.25,
                    fontWeight: 600,
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                    color: "primary.main",
                    border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.22)}`
                  }}
                />
                <Typography
                  variant="h3"
                  component="h1"
                  fontWeight={800}
                  letterSpacing={{ xs: -0.5, sm: -0.75 }}
                  sx={{
                    fontSize: { xs: "1.65rem", sm: "1.85rem", md: "2.1rem" },
                    lineHeight: 1.2,
                    mb: 1,
                    color: "text.primary"
                  }}
                >
                  Report a road issue
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxWidth: 560,
                    mx: { xs: "auto", sm: 0 },
                    lineHeight: 1.65
                  }}
                >
                  Add clear photos and drop a pin so crews can find the spot quickly.
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Card
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider", overflow: "visible" }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                  color: "primary.main"
                }}
              >
                <ImageOutlinedIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Photos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PNG or JPG — multiple files allowed
                </Typography>
              </Box>
            </Stack>

            <Box
              component="label"
              htmlFor="upload-file-input"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
              sx={{
                display: "block",
                cursor: "pointer",
                border: "2px dashed",
                borderColor: (t) => alpha(t.palette.primary.main, 0.35),
                borderRadius: 2,
                py: { xs: 4, sm: 5 },
                px: 2,
                textAlign: "center",
                transition: "background-color 0.2s, border-color 0.2s, box-shadow 0.2s",
                bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
                "&:hover": {
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
                  borderColor: "primary.main",
                  boxShadow: (t) => `0 0 0 4px ${alpha(t.palette.primary.main, 0.12)}`
                }
              }}
            >
              <input
                id="upload-file-input"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg"
                hidden
                onChange={(e) => handleFiles(e.target.files)}
              />
              <CloudUploadRoundedIcon
                sx={{ fontSize: 40, color: "primary.main", opacity: 0.9, mb: 1 }}
              />
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                Drag images here or click to browse
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                Max ~10 MB per file recommended
              </Typography>
            </Box>

            {previews.length > 0 && (
              <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mt: 2.5 }}>
                {previews.map((src, index) => (
                  <Box
                    key={src}
                    sx={{
                      position: "relative",
                      width: { xs: "calc(50% - 6px)", sm: 140 },
                      flexGrow: { xs: 0, sm: 0 },
                      borderRadius: 2,
                      overflow: "hidden",
                      aspectRatio: "4/3",
                      boxShadow: 2,
                      "&:hover .remove-btn": { opacity: 1 }
                    }}
                  >
                    <Box
                      component="img"
                      src={src}
                      alt=""
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                    <IconButton
                      className="remove-btn"
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(index);
                      }}
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        opacity: 0,
                        transition: "opacity 0.2s",
                        bgcolor: "rgba(0,0,0,0.65)",
                        color: "common.white",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.8)" }
                      }}
                      aria-label="Remove image"
                    >
                      <CloseRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider", overflow: "visible" }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: (t) => alpha(t.palette.info.main, 0.12),
                    color: "info.main"
                  }}
                >
                  <LocationOnOutlinedIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Location
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tap the map to place a pin
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="outlined"
                color="info"
                startIcon={<MyLocationIcon />}
                onClick={getCurrentLocation}
                sx={{ alignSelf: { xs: "stretch", sm: "center" }, whiteSpace: "nowrap" }}
              >
                Use my location
              </Button>
            </Stack>

            <Box
              sx={{
                height: 320,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "action.hover"
              }}
            >
              <MapPicker location={location} setLocation={setLocation} />
            </Box>

            {location && (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 2 }}
                flexWrap="wrap"
                useFlexGap
              >
                <Chip
                  icon={<LocationOnOutlinedIcon sx={{ fontSize: "18px !important" }} />}
                  label={`${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`}
                  variant="outlined"
                  sx={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: "0.8rem",
                    borderColor: "divider"
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Adjust by clicking again on the map
                </Typography>
              </Stack>
            )}
          </CardContent>
        </Card>

        {submitError && (
          <Alert severity="error" onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}
        {submitSuccess && (
          <Alert severity="success" onClose={() => setSubmitSuccess(false)}>
            Report submitted successfully.
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={submitting}
          onClick={handleSubmit}
          sx={{
            py: 1.75,
            fontSize: "1rem",
            borderRadius: 2,
            boxShadow: (t) => `0 8px 24px ${alpha(t.palette.primary.main, 0.35)}`
          }}
        >
          {submitting ? "Submitting…" : "Submit report"}
        </Button>
      </Stack>
    </Box>
  );
}
