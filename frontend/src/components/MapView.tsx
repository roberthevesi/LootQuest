import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import "ol/ol.css";
import { Feature, Map, View } from "ol";
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { Point } from "ol/geom";
import { Coordinate } from "../services/locationService.ts";
import { createCircle } from "../helpers/utmHelper";

export type MapViewProps = {
  setCenterPosition: (c: Coordinate) => void;
};

export type MapViewHandle = {
  setZoomAndCenter: (coord: Coordinate, zoom?: number) => void;
  setMyPosition: (coord: Coordinate) => void;
};

const radiusMeters = 10;

export const MapView = forwardRef<MapViewHandle, MapViewProps>(
  ({ setCenterPosition }, ref) => {
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
        view: new View(),
      });

      mapRef.current.addLayer(locationLayerRef.current);
      mapRef.current.addLayer(locationRadiusLayerRef.current);

      mapRef.current.on("moveend", () => {
        setCenterPosition(mapRef.current!.getView().getCenter() as Coordinate);
      });

      return () => {
        mapRef.current?.setTarget(undefined);
      };
    }, []);

    useImperativeHandle(ref, () => ({
      setZoomAndCenter: (coord: Coordinate, zoom = 18) => {
        if (mapRef.current) {
          mapRef.current.getView().animate({
            center: coord,
            zoom,
          });
        }
      },

      setMyPosition: (coord: Coordinate) => {
        if (!mapRef.current) {
          return;
        }

        const locationFeature = new Feature(new Point(coord));
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
          createCircle(coord[0], coord[1], radiusMeters)
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
      },
    }));

    return <div id="map" style={{ width: "100vw", height: "100vh" }} />;
  }
);
