import "ol/ol.css";
import { MapView } from "./components/MapView";
import { useEffect, useState } from "react";
import { Coordinate, getLocationAsync } from "../../services/locationService";

export type MapPageProps = {};

export const MapPage: React.FC<MapPageProps> = ({}) => {
  const [location, setLocation] = useState<Coordinate>();

  useEffect(() => {
    getLocationAsync().then((response) => setLocation(response));
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <MapView center={location} />
    </div>
  );
};
