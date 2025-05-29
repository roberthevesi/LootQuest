import { Circle } from "ol/geom";
import { transform } from "ol/proj";

export const getUtm = (lon: number) =>
  lon < 24.0 ? "EPSG:32634" : "EPSG:32635";

export const createCircle = (
  lon: number,
  lat: number,
  radiusMeters: number
) => {
  const utmProjection = getUtm(lon);
  return new Circle(
    transform([lon, lat], "EPSG:4326", utmProjection),
    radiusMeters
  ).transform(utmProjection, "EPSG:4326");
};
