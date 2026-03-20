"use client";

import { APP_NAME } from "@/config/brand";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Box
      component={Link}
      href="/dashboard"
      aria-label={`${APP_NAME} — home`}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        textDecoration: "none",
        color: "inherit",
        "&:hover": { opacity: 0.92 }
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          lineHeight: 0,
          flexShrink: 0
        }}
      >
        <Image
          src="/logo.png"
          alt=""
          width={48}
          height={48}
          priority
          sizes="48px"
          style={{
            objectFit: "contain",
            display: "block"
          }}
        />
      </Box>

      <Typography
        variant="h6"
        component="span"
        sx={{
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
          /* Match logo.png: teal leaves + navy path */
          background: `linear-gradient(125deg, #00897b 0%, #0d47a1 100%)`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent"
        }}
      >
        {APP_NAME}
      </Typography>
    </Box>
  );
}
