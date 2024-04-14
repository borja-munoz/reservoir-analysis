import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import DeckGL from "@deck.gl/react";
import { Map as MapLibreMap } from "react-map-gl/maplibre";
import { GeoJsonLayer } from "@deck.gl/layers";
import type { Feature } from "geojson";

import "maplibre-gl/dist/maplibre-gl.css";

const MapContainer = styled("div")(({ theme }) => ({
  // backgroundColor: theme.palette.grey[50],
  minHeight: "300px",
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
  }, [stations]);

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

  return (
    <MapContainer>
      <DeckGL
        initialViewState={{
          latitude: 37,
          longitude: -4.5,
          zoom: 6.3,
        }}
        controller={true}
        layers={[layer]}
      >
        <MapLibreMap reuseMaps mapStyle={MAP_STYLE} styleDiffing={false} />
      </DeckGL>
    </MapContainer>
  );
}
