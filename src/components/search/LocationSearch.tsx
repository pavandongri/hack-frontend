"use client";

import { Autocomplete, Button, CircularProgress, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { DEBOUNCE_DELAY } from "@/constants/api.constants";
import { fetchLocationSuggestions } from "@/services/location.service";
import { Coordinates, LocationOption } from "@/types/common.types";
import { useDebounce } from "@/utils/debounce.util";

type Props = {
  onSearch: (start: Coordinates, end: Coordinates) => void;
  loading: boolean;
};

export default function LocationSearch({ onSearch }: Props) {
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

  // 🔹 Fetch start suggestions
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

  // 🔹 Fetch end suggestions
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

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        gap: 2,
        alignItems: "center",
        borderRadius: 3
      }}
    >
      {/* 🔹 Start */}
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
            label="Start Location"
            InputProps={{
              ...params.InputProps,
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

      {/* 🔹 End */}
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
            label="Destination"
            InputProps={{
              ...params.InputProps,
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

      {/* 🔹 Button */}
      <Button
        variant="contained"
        disabled={!start || !end}
        onClick={() => {
          if (start && end) {
            onSearch(
              [parseFloat(start.lat), parseFloat(start.lon)],
              [parseFloat(end.lat), parseFloat(end.lon)]
            );
          }
        }}
      >
        Go
      </Button>
    </Paper>
  );
}
