"use client";

import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

import { DEBOUNCE_DELAY } from "@/constants/api.constants";
import { fetchLocationSuggestions } from "@/services/location.service";
import { Coordinates, LocationOption } from "@/types/common.types";
import { useDebounce } from "@/utils/debounce.util";

type Props = {
  onSearch: (start: Coordinates, end: Coordinates) => void;
  loading: boolean;
};

export default function LocationSearch({ onSearch, loading }: Props) {
  const theme = useTheme();
  const [start, setStart] = useState<LocationOption | null>(null);
  const [end, setEnd] = useState<LocationOption | null>(null);

  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");

  const debouncedStart = useDebounce(startQuery, DEBOUNCE_DELAY);
  const debouncedEnd = useDebounce(endQuery, DEBOUNCE_DELAY);

  const [startOptions, setStartOptions] = useState<LocationOption[]>([]);
  const [endOptions, setEndOptions] = useState<LocationOption[]>([]);

  const [startLoading, setStartLoading] = useState(false);
  const [endLoading, setEndLoading] = useState(false);

  useEffect(() => {
    if (!debouncedStart) {
      setStartOptions([]);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setStartLoading(true);
      try {
        const res = await fetchLocationSuggestions(debouncedStart);
        if (!cancelled) {
          setStartOptions(Array.isArray(res) ? res : []);
        }
      } catch {
        if (!cancelled) setStartOptions([]);
      } finally {
        if (!cancelled) setStartLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [debouncedStart]);

  useEffect(() => {
    if (!debouncedEnd) {
      setEndOptions([]);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setEndLoading(true);
      try {
        const res = await fetchLocationSuggestions(debouncedEnd);
        if (!cancelled) {
          setEndOptions(Array.isArray(res) ? res : []);
        }
      } catch {
        if (!cancelled) setEndOptions([]);
      } finally {
        if (!cancelled) setEndLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [debouncedEnd]);

  const swapLocations = () => {
    const s = start;
    const sq = startQuery;
    setStart(end);
    setEnd(s);
    setStartQuery(endQuery);
    setEndQuery(sq);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.9),
        background:
          theme.palette.mode === "light"
            ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`
            : theme.palette.background.paper,
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)"
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 2, md: 1.5 }}
        alignItems={{ xs: "stretch", md: "center" }}
      >
        <Autocomplete<LocationOption>
          fullWidth
          options={startOptions}
          loading={startLoading}
          value={start}
          isOptionEqualToValue={(o, v) => o.place_id === v.place_id}
          getOptionLabel={(o) => o.display_name || ""}
          onInputChange={(_, value) => setStartQuery(value)}
          onChange={(_, value) => setStart(value)}
          filterOptions={(x) => x}
          renderInput={(params) => (
            <TextField
              {...params}
              label="From"
              placeholder="Search starting place"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceOutlinedIcon sx={{ color: "primary.main", opacity: 0.85 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {startLoading && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Tooltip title="Swap from and to">
            <span>
              <IconButton
                onClick={swapLocations}
                disabled={!start && !end}
                color="primary"
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: alpha(theme.palette.primary.main, 0.04)
                }}
                aria-label="Swap start and destination"
              >
                <SwapHorizIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <Autocomplete<LocationOption>
          fullWidth
          options={endOptions}
          loading={endLoading}
          value={end}
          isOptionEqualToValue={(o, v) => o.place_id === v.place_id}
          getOptionLabel={(o) => o.display_name || ""}
          onInputChange={(_, value) => setEndQuery(value)}
          onChange={(_, value) => setEnd(value)}
          filterOptions={(x) => x}
          renderInput={(params) => (
            <TextField
              {...params}
              label="To"
              placeholder="Search destination"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <FlagOutlinedIcon sx={{ color: "secondary.main", opacity: 0.85 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {endLoading && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />

        <Button
          variant="contained"
          size="medium"
          disabled={!start || !end || loading}
          onClick={() => {
            if (start && end) {
              onSearch(
                [parseFloat(start.lat), parseFloat(start.lon)],
                [parseFloat(end.lat), parseFloat(end.lon)]
              );
            }
          }}
          sx={{
            minWidth: { xs: "100%", md: 120 },
            alignSelf: { xs: "stretch" },
            py: 1.25,
            boxShadow: "0 4px 14px rgba(25, 118, 210, 0.35)"
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Show routes"}
        </Button>
      </Stack>
    </Paper>
  );
}
