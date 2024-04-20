import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import DeckGL from "@deck.gl/react";
import { Map as MapLibreMap } from "react-map-gl/maplibre";
import { GeoJsonLayer } from "@deck.gl/layers";
import { WebMercatorViewport } from "@deck.gl/core";
import type { Feature } from "geojson";

import "maplibre-gl/dist/maplibre-gl.css";

const MapContainer = styled("div")(({ theme: _theme }) => ({
  // backgroundColor: theme.palette.grey[50],
  // minHeight: "300px",
  height: "40vh",
  width: "100%",
  position: "relative",
  flex: "1 1 auto",
}));

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

type StationProperties = {
  id: number;
  name: string;
};

export default function Map({ stations }: { stations: any[] }) {
  const [data, setData] = useState<Feature[]>([]);
  const [boundsFitted, setBoundsFitted] = useState(false);
  const [initialViewState, setInitialViewState] = useState({
    latitude: 37,
    longitude: -4.5,
    zoom: 6.3,
  });

  // Transform stations data to GeoJSON
  useEffect(() => {
    setData(
      stations.map((station) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [station.longitude, station.latitude],
          },
          properties: {
            ...station,
          },
        };
      })
    );
    setBoundsFitted(false);
  }, [stations]);

  const getLayerBounds = () => {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = - Number.MAX_VALUE;
    let maxY = - Number.MAX_VALUE;

    if (stations.length == 1) {
      minX = maxX = stations[0].longitude;
      minY = maxY = stations[0].latitude;
    } else {
      stations.forEach((station) => {
        if (station.longitude !== null) {
          if (station.longitude < minX) {
            minX = station.longitude;
          }
          if (station.longitude > maxX) {
            maxX = station.longitude;
          }
          if (station.latitude < minY) {
            minY = station.latitude;
          }
          if (station.latitude > maxY) {
            maxY = station.latitude;
          }  
        }
      });
    }

    return [[minX, minY], [maxX, maxY]];
  };

  const layer = new GeoJsonLayer<StationProperties>({
    id: "GeoJsonLayer",
    data,
    pickable: true,
    getFillColor: [160, 160, 220, 200],
    getLineColor: [255, 255, 255, 200],
    getLineWidth: 1,
    getPointRadius: 4,
    pointRadiusUnits: "pixels",
  });

  const onAfterRender = () => {
    if (!boundsFitted) {
      //@ts-ignore
      if (layer.props.data.length > 0) {
        const viewport = layer.context.viewport as WebMercatorViewport;
        const { longitude, latitude, zoom } = viewport.fitBounds(
          //@ts-ignore
          getLayerBounds(), 
          {
            minExtent: 0.1, // degrees
            padding: 50,    // pixels
          }
        );
        setInitialViewState({ longitude, latitude, zoom });
        setBoundsFitted(true);
      }
    }
  };

  return (
    <MapContainer>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={[layer]}
        onAfterRender={onAfterRender}
      >
        <MapLibreMap reuseMaps mapStyle={MAP_STYLE} styleDiffing={false} />
      </DeckGL>
    </MapContainer>
  );
}
