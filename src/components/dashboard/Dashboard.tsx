"use client";

import { getUser } from "@/helpers/common.helpers";
import { User } from "@/types/common.types";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import BoltIcon from "@mui/icons-material/Bolt";
import InsightsIcon from "@mui/icons-material/Insights";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  alpha,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";

const KPI_CARDS = [
  {
    label: "Reports this week",
    value: "1,284",
    delta: "+18.2%",
    deltaPositive: true,
    hint: "vs. prior 7 days",
    icon: ReportProblemOutlinedIcon,
    accent: "#ff6b6b"
  },
  {
    label: "Verified routes",
    value: "428",
    delta: "+6.4%",
    deltaPositive: true,
    hint: "Community-validated paths",
    icon: ShieldOutlinedIcon,
    accent: "#4ecdc4"
  },
  {
    label: "Active map tiles",
    value: "92",
    delta: "0%",
    deltaPositive: true,
    hint: "Regions with fresh data",
    icon: MapOutlinedIcon,
    accent: "#a78bfa"
  },
  {
    label: "Avg. response",
    value: "2.4m",
    delta: "−12%",
    deltaPositive: true,
    hint: "Time to surface new hazards",
    icon: BoltIcon,
    accent: "#fbbf24"
  }
] as const;

const WEEKLY_VOLUME = [
  { label: "Mon", pct: 42 },
  { label: "Tue", pct: 68 },
  { label: "Wed", pct: 55 },
  { label: "Thu", pct: 88 },
  { label: "Fri", pct: 72 },
  { label: "Sat", pct: 48 },
  { label: "Sun", pct: 36 }
] as const;

const HAZARD_MIX = [
  { name: "Potholes & surface", pct: 38, color: "#ff6b6b" },
  { name: "Construction / closure", pct: 27, color: "#fbbf24" },
  { name: "Flooding / debris", pct: 18, color: "#38bdf8" },
  { name: "Visibility / signage", pct: 17, color: "#a78bfa" }
] as const;

const RECENT_ACTIVITY = [
  {
    title: "Oak Ave — severe lane damage",
    meta: "Verified · 12 min ago",
    tone: "error" as const
  },
  {
    title: "Highway 9 on-ramp closure",
    meta: "City feed · 1h ago",
    tone: "warning" as const
  },
  {
    title: "Downtown loop cleared",
    meta: "Auto-resolved · 3h ago",
    tone: "success" as const
  },
  {
    title: "New contributor in your zone",
    meta: "Community · Yesterday",
    tone: "default" as const
  }
] as const;

export default function Dashboard() {
  const theme = useTheme();
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const user: User | null = isHydrated ? getUser() : null;

  const greeting = useMemo(() => {
    if (!user?.name) return "Welcome back";
    const first = user.name.trim().split(/\s+/)[0];
    return `Hey, ${first}`;
  }, [user]);

  const maxBar = Math.max(...WEEKLY_VOLUME.map((w) => w.pct));

  return (
    <Box
      sx={{
        minHeight: "100%",
        pb: 6,
        mx: { xs: -2, sm: -3 },
        px: { xs: 2, sm: 3 },
        background:
          theme.palette.mode === "light"
            ? `linear-gradient(180deg, ${alpha(theme.palette.primary.dark, 0.06)} 0%, ${alpha(theme.palette.background.default, 1)} 380px)`
            : undefined
      }}
    >
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: { xs: 0, sm: 3 },
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha("#0f172a", 0.96)} 42%, ${alpha(theme.palette.secondary.dark, 0.9)} 100%)`,
          color: "common.white",
          pt: { xs: 3.5, md: 4.5 },
          pb: { xs: 4, md: 5 },
          px: { xs: 2, sm: 3 },
          boxShadow: "0 24px 56px rgba(15, 23, 42, 0.38)"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.4,
            backgroundImage: `radial-gradient(circle at 15% 30%, ${alpha("#fff", 0.22)} 0%, transparent 42%),
              radial-gradient(circle at 85% 10%, ${alpha("#f472b6", 0.35)} 0%, transparent 38%),
              radial-gradient(circle at 70% 85%, ${alpha("#38bdf8", 0.2)} 0%, transparent 45%)`
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Stack spacing={1.25} maxWidth={720}>
              <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
                <Chip
                  icon={
                    <InsightsIcon
                      sx={{ fontSize: 18, color: `${alpha("#fff", 0.95)} !important` }}
                    />
                  }
                  label="Intelligence overview"
                  size="small"
                  sx={{
                    bgcolor: alpha("#fff", 0.12),
                    color: "common.white",
                    fontWeight: 700,
                    border: `1px solid ${alpha("#fff", 0.22)}`,
                    backdropFilter: "blur(10px)"
                  }}
                />
                <Chip
                  label="Demo data"
                  size="small"
                  sx={{
                    bgcolor: alpha("#fbbf24", 0.18),
                    color: "#fef9c3",
                    fontWeight: 600,
                    border: `1px solid ${alpha("#fbbf24", 0.4)}`
                  }}
                />
              </Stack>

              <Typography
                variant="h3"
                fontWeight={800}
                letterSpacing={-1}
                sx={{ fontSize: { xs: "1.85rem", md: "2.35rem" } }}
              >
                {greeting} — your road safety command center
              </Typography>

              <Typography variant="body1" sx={{ color: alpha("#fff", 0.78), maxWidth: 560 }}>
                Live-style snapshot of how your area is reporting hazards, where data is freshest,
                and what changed recently. Swap these figures for API-backed metrics when ready.
              </Typography>
            </Stack>

            <Stack
              spacing={1.5}
              alignItems={{ xs: "stretch", md: "flex-end" }}
              sx={{ minWidth: { md: 220 } }}
            >
              <Typography
                variant="caption"
                sx={{ color: alpha("#fff", 0.55), textAlign: { xs: "left", md: "right" } }}
              >
                Last refreshed · just now
              </Typography>
              <Button
                component={Link}
                href="/upload"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: alpha("#fff", 0.14),
                  color: "common.white",
                  border: `1px solid ${alpha("#fff", 0.28)}`,
                  backdropFilter: "blur(8px)",
                  fontWeight: 700,
                  py: 1.25,
                  "&:hover": { bgcolor: alpha("#fff", 0.22) }
                }}
              >
                Submit a report
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 0, sm: 0 } }}>
        {/* KPI row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
            gap: 2,
            mb: 2.5
          }}
        >
          {KPI_CARDS.map((k) => {
            const Icon = k.icon;
            return (
              <Card
                key={k.label}
                elevation={0}
                sx={{
                  p: 2.5,
                  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                  background:
                    theme.palette.mode === "light"
                      ? `linear-gradient(155deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`
                      : theme.palette.background.paper,
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 20px 44px ${alpha(k.accent, 0.15)}`
                  }
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: alpha(k.accent, 0.12),
                        color: k.accent
                      }}
                    >
                      <Icon sx={{ fontSize: 24 }} />
                    </Box>
                    <Chip
                      size="small"
                      icon={
                        k.deltaPositive ? (
                          <TrendingUpIcon
                            sx={{ fontSize: 16, color: `${theme.palette.success.main} !important` }}
                          />
                        ) : undefined
                      }
                      label={k.delta}
                      sx={{
                        fontWeight: 700,
                        bgcolor: alpha(theme.palette.success.main, 0.12),
                        color: theme.palette.success.dark,
                        border: "none"
                      }}
                    />
                  </Stack>
                  <Box>
                    <Typography variant="h4" fontWeight={800} letterSpacing={-0.5}>
                      {k.value}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 0.5 }}>
                      {k.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {k.hint}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.45fr 1fr" },
            gap: 2.5,
            mb: 2.5
          }}
        >
          {/* Weekly report volume */}
          <Card
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              boxShadow: "0 18px 44px rgba(15, 23, 42, 0.08)",
              overflow: "hidden"
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={700}
                  letterSpacing={1.1}
                >
                  Reports volume
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  Last 7 days
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 420 }}>
                  Inbound hazard submissions normalized to your busiest day this week.
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                }}
              >
                <AutoGraphIcon />
              </Box>
            </Stack>

            <Stack direction="row" alignItems="flex-end" spacing={1.25} sx={{ height: 200, pt: 1 }}>
              {WEEKLY_VOLUME.map((d) => (
                <Box
                  key={d.label}
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 0
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: `${Math.max(12, (d.pct / maxBar) * 100)}%`,
                      minHeight: 16,
                      borderRadius: 1.5,
                      background: `linear-gradient(180deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                      transition: "transform 0.2s ease",
                      "&:hover": { transform: "scaleY(1.03)" },
                      transformOrigin: "bottom"
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {d.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>

          {/* Hazard mix + health */}
          <Stack spacing={2.5}>
            <Card
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                boxShadow: "0 18px 44px rgba(15, 23, 42, 0.08)"
              }}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                fontWeight={700}
                letterSpacing={1.1}
              >
                Report mix
              </Typography>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                By hazard category
              </Typography>
              <Stack spacing={1.75}>
                {HAZARD_MIX.map((h) => (
                  <Box key={h.name}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={0.5}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {h.name}
                      </Typography>
                      <Typography variant="caption" fontWeight={700} color="text.secondary">
                        {h.pct}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={h.pct}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(h.color, 0.12),
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${h.color}, ${alpha(h.color, 0.65)})`
                        }
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Card>

            <Card
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                background: `linear-gradient(125deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${theme.palette.background.paper} 55%)`,
                boxShadow: "0 18px 44px rgba(15, 23, 42, 0.06)"
              }}
            >
              <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                Coverage health
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Blend of verified reports vs. open items in your selected corridors.
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography variant="caption" fontWeight={700}>
                      Verified
                    </Typography>
                    <Typography variant="caption" fontWeight={800} color="success.main">
                      78%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={78}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: alpha(theme.palette.success.main, 0.15),
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 5,
                        bgcolor: theme.palette.success.main
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography variant="caption" fontWeight={700}>
                      Needs triage
                    </Typography>
                    <Typography variant="caption" fontWeight={800} color="warning.main">
                      22%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={22}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: alpha(theme.palette.warning.main, 0.15),
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 5,
                        bgcolor: theme.palette.warning.main
                      }
                    }}
                  />
                </Box>
              </Stack>
            </Card>
          </Stack>
        </Box>

        {/* Activity + quick links */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
            gap: 2.5
          }}
        >
          <Card
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              boxShadow: "0 18px 44px rgba(15, 23, 42, 0.08)"
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={700}
                  letterSpacing={1.1}
                >
                  Pulse
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  Recent signals
                </Typography>
              </Box>
              <Chip
                label="Live demo"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
            </Stack>
            <Stack
              divider={
                <Divider flexItem sx={{ borderColor: alpha(theme.palette.divider, 0.12) }} />
              }
            >
              {RECENT_ACTIVITY.map((item) => (
                <Stack
                  key={item.title}
                  direction="row"
                  justifyContent="space-between"
                  py={1.75}
                  spacing={2}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.meta}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={
                      item.tone === "error"
                        ? "Critical"
                        : item.tone === "warning"
                          ? "Watch"
                          : item.tone === "success"
                            ? "Cleared"
                            : "Info"
                    }
                    sx={{
                      fontWeight: 700,
                      flexShrink: 0,
                      ...(item.tone === "error" && {
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.dark
                      }),
                      ...(item.tone === "warning" && {
                        bgcolor: alpha(theme.palette.warning.main, 0.12),
                        color: theme.palette.warning.dark
                      }),
                      ...(item.tone === "success" && {
                        bgcolor: alpha(theme.palette.success.main, 0.12),
                        color: theme.palette.success.dark
                      }),
                      ...(item.tone === "default" && {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.dark
                      })
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          </Card>

          <Card
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              background: `linear-gradient(160deg, ${alpha(theme.palette.secondary.light, 0.12)} 0%, ${theme.palette.background.paper} 65%)`,
              boxShadow: "0 18px 44px rgba(15, 23, 42, 0.08)"
            }}
          >
            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={700}
              letterSpacing={1.1}
            >
              Shortcuts
            </Typography>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              Jump back in
            </Typography>
            <Stack spacing={1.25}>
              <Button
                component={Link}
                href="/maps"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ py: 1.25, fontWeight: 700 }}
              >
                Open maps
              </Button>
              <Button
                component={Link}
                href="/profile"
                fullWidth
                variant="outlined"
                color="inherit"
                sx={{ py: 1.25, fontWeight: 700, borderColor: alpha(theme.palette.divider, 0.35) }}
              >
                View profile & impact
              </Button>
              <Button
                component={Link}
                href="/upload"
                fullWidth
                variant="text"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                sx={{ fontWeight: 700 }}
              >
                Add road intelligence
              </Button>
            </Stack>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
