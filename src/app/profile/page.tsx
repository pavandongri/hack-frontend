"use client";

import { getUser } from "@/helpers/common.helpers";
import { User } from "@/types/common.types";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ShieldIcon from "@mui/icons-material/Shield";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo, useSyncExternalStore } from "react";

const IMPACT_STATS = [
  {
    label: "Road hazards you reported",
    value: "47",
    sub: "Community alerts that helped others reroute",
    icon: ReportProblemIcon,
    accent: "#ff6b6b"
  },
  {
    label: "Tough roads you avoided",
    value: "23",
    sub: "Rough or risky segments skipped on your routes",
    icon: AltRouteIcon,
    accent: "#4ecdc4"
  },
  {
    label: "Safer distance guided",
    value: "1,240 km",
    sub: "Miles of smoother, verified paths you’ve taken",
    icon: ShieldIcon,
    accent: "#a78bfa"
  },
  {
    label: "Time saved for you",
    value: "6h 24m",
    sub: "Less crawling traffic & bad surfaces on your trips",
    icon: TimerOutlinedIcon,
    accent: "#fbbf24"
  }
] as const;

export default function ProfilePage() {
  const theme = useTheme();
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const user: User | null = isHydrated ? getUser() : null;

  const initials = useMemo(() => {
    if (!user?.name) return "?";
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return user.name.slice(0, 2).toUpperCase();
  }, [user]);

  if (!user) return null;

  return (
    <Box
      sx={{
        minHeight: "100%",
        pb: 6,
        background:
          theme.palette.mode === "light"
            ? `linear-gradient(180deg, ${alpha(theme.palette.primary.dark, 0.06)} 0%, ${alpha(theme.palette.background.default, 1)} 420px)`
            : undefined
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: { xs: 0, sm: 3 },
          mx: { xs: -2, sm: 0 },
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha("#312e81", 0.95)} 45%, ${alpha(theme.palette.secondary.dark, 0.92)} 100%)`,
          color: "common.white",
          pt: { xs: 4, md: 5 },
          pb: { xs: 10, md: 12 },
          px: { xs: 2, sm: 3 },
          boxShadow: "0 24px 48px rgba(15, 23, 42, 0.35)"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.35,
            backgroundImage: `radial-gradient(circle at 20% 20%, ${alpha("#fff", 0.25)} 0%, transparent 45%),
              radial-gradient(circle at 80% 0%, ${alpha("#f472b6", 0.35)} 0%, transparent 40%)`
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            alignItems={{ xs: "center", sm: "flex-start" }}
          >
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${alpha("#fff", 0.55)}, ${alpha("#c4b5fd", 0.4)})`,
                  filter: "blur(0px)"
                }}
              />
              <Avatar
                src={user.picture ?? undefined}
                alt={user.name ?? ""}
                sx={{
                  width: { xs: 108, sm: 120 },
                  height: { xs: 108, sm: 120 },
                  fontSize: "2.25rem",
                  fontWeight: 700,
                  border: "3px solid",
                  borderColor: alpha("#fff", 0.85),
                  boxShadow: `0 12px 40px ${alpha("#000", 0.35)}`
                }}
              >
                {!user.picture ? initials : null}
              </Avatar>
            </Box>

            <Stack spacing={1.25} flex={1} textAlign={{ xs: "center", sm: "left" }}>
              <Stack
                direction="row"
                flexWrap="wrap"
                gap={1}
                justifyContent={{ xs: "center", sm: "flex-start" }}
              >
                <Chip
                  label="Road safety contributor"
                  size="small"
                  sx={{
                    bgcolor: alpha("#fff", 0.15),
                    color: "common.white",
                    fontWeight: 600,
                    border: `1px solid ${alpha("#fff", 0.25)}`,
                    backdropFilter: "blur(8px)"
                  }}
                />
                <Chip
                  label="Premium profile"
                  size="small"
                  sx={{
                    bgcolor: alpha("#fbbf24", 0.2),
                    color: "#fef3c7",
                    fontWeight: 600,
                    border: `1px solid ${alpha("#fbbf24", 0.45)}`
                  }}
                />
              </Stack>

              <Typography variant="h4" fontWeight={800} letterSpacing={-0.5}>
                {user.name}
              </Typography>

              <Typography variant="body1" sx={{ color: alpha("#fff", 0.82), maxWidth: 520 }}>
                {user.email}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: alpha("#fff", 0.65), maxWidth: 560, pt: 0.5 }}
              >
                Your trips help everyone choose safer roads. Here’s the impact you’ve made so far —
                personalized to your journeys.
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Card
          elevation={0}
          sx={{
            mt: { xs: -9, md: -10 },
            position: "relative",
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            background:
              theme.palette.mode === "light"
                ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.06)} 100%)`
                : theme.palette.background.paper,
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)",
            overflow: "hidden"
          }}
        >
          <Box sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
            <Stack spacing={0.5} mb={3}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontWeight={700}
                letterSpacing={1.2}
              >
                Your impact
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                Stats from your road intelligence
              </Typography>
              <Typography variant="body2" color="text.secondary" maxWidth={640}>
                Dummy figures for demo — swap with live analytics when your backend is ready.
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
                gap: 2
              }}
            >
              {IMPACT_STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={stat.label}
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      borderColor: alpha(theme.palette.divider, 0.14),
                      bgcolor: alpha(theme.palette.background.paper, 0.85),
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: `0 12px 28px ${alpha(stat.accent, 0.18)}`
                      }
                    }}
                  >
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: alpha(stat.accent, 0.12),
                          color: stat.accent
                        }}
                      >
                        <Icon sx={{ fontSize: 26 }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="h4"
                          fontWeight={800}
                          letterSpacing={-0.5}
                          lineHeight={1.15}
                        >
                          {stat.value}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 0.75 }}>
                          {stat.label}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          {stat.sub}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                );
              })}
            </Box>

            <Box sx={{ mt: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" mb={1}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Route quality score
                </Typography>
                <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                  94 / 100
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={94}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                Based on how often you pick verified, smoother paths over hazardous segments.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 4 }}
              justifyContent="flex-end"
            >
              <Button variant="outlined" color="inherit" href="/dashboard">
                Back to dashboard
              </Button>
              <Button variant="contained" href="/auth/logout" color="primary" sx={{ px: 3 }}>
                Log out
              </Button>
            </Stack>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
