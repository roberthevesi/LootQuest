import { useGeographic } from "ol/proj";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import "./App.css";
import { MapPage } from "./pages/MapPage";

function App() {
  useGeographic();
  proj4.defs(
    "EPSG:32634",
    "+proj=utm +zone=34 +datum=WGS84 +units=m +no_defs +type=crs"
  );
  proj4.defs(
    "EPSG:32635",
    "+proj=utm +zone=35 +datum=WGS84 +units=m +no_defs +type=crs"
  );
  register(proj4);
  return <MapPage />;
}

export default App;
