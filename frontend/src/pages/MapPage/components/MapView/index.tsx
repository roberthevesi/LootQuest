import { useEffect, useRef } from "react";
import "ol/ol.css";
import { Feature, Map, View } from "ol";
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { Point } from "ol/geom";
import { Coordinate } from "../../../../services/locationService";
import { createCircle } from "../../../../helpers/utmHelper";

export type MapViewProps = {
  center?: Coordinate;
};

const radiusMeters = 10;

export const MapView: React.FC<MapViewProps> = ({ center }) => {
  const mapRef = useRef<Map | null>(null);

  const locationLayerRef = useRef(
    new VectorLayer({ source: new VectorSource() })
  );
  const locationRadiusLayerRef = useRef(
    new VectorLayer({ source: new VectorSource() })
  );

  useEffect(() => {
    mapRef.current = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [24.9668, 45.9432],
        zoom: 14,
      }),
    });

    mapRef.current.addLayer(locationLayerRef.current);
    mapRef.current.addLayer(locationRadiusLayerRef.current);

    return () => {
      mapRef.current?.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    if (center && mapRef.current) {
      const locationFeature = new Feature(new Point(center));
      locationFeature.setStyle(
        new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({ color: "#4285F4" }),
            stroke: new Stroke({ color: "white", width: 2 }),
          }),
        })
      );
      locationLayerRef.current.getSource()!.clear();
      locationLayerRef.current.getSource()!.addFeature(locationFeature);

      const locationRadiusFeature = new Feature(
        createCircle(center[0], center[1], radiusMeters)
      );
      locationRadiusFeature.setStyle(
        new Style({
          fill: new Fill({ color: "rgba(0, 0, 0, 0.1)" }),
        })
      );
      locationRadiusLayerRef.current.getSource()!.clear();
      locationRadiusLayerRef.current
        .getSource()!
        .addFeature(locationRadiusFeature);

      mapRef.current.getView().animate({ center: center, zoom: 18 });
    }
  }, [center]);

  return <div id="map" style={{ width: "100vw", height: "100vh" }} />;
};
