"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Grid, IconButton } from "@mui/material";

export default function ImagePreviewGrid({ images, setImages }: any) {
  const handleRemove = (index: number) => {
    setImages((prev: File[]) => prev.filter((_, i) => i !== index));
  };

  if (!images.length) return null;

  return (
    <Grid container spacing={2} mt={2}>
      {images.map((file: File, index: number) => {
        const url = URL.createObjectURL(file);

        return (
          <Grid container spacing={2} mt={2} key={index}>
            <Box
              sx={{
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 2
              }}
            >
              <img src={url} style={{ width: "100%", height: 140, objectFit: "cover" }} />

              <IconButton
                size="small"
                onClick={() => handleRemove(index)}
                sx={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "white"
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}
