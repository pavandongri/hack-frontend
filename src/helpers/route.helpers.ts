export const getRoute = async (start: [number, number], end: [number, number]) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&alternatives=true&steps=true&annotations=true`;

  const res = await fetch(url);
  const data = await res.json();

  return data.routes;
};
