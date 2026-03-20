"use client";

import { Box, Typography } from "@mui/material";

export default function ImageDropzone({ images, setImages }: any) {
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setImages((prev: File[]) => [...prev, ...newFiles]);
  };

  return (
    <Box
      component="label"
      sx={{
        border: "2px dashed #ccc",
        borderRadius: 4,
        p: 6,
        textAlign: "center",
        cursor: "pointer",
        display: "block",
        transition: "0.3s",
        "&:hover": { backgroundColor: "#fafafa" }
      }}
    >
      <Typography variant="body1" fontWeight={500}>
        Drag & drop images here
      </Typography>
      <Typography variant="body2" color="text.secondary">
        or click to browse
      </Typography>

      <input hidden type="file" multiple onChange={(e) => handleFiles(e.target.files)} />
    </Box>
  );
}
