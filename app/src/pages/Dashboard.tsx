import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Field } from "apache-arrow";

import { Box, Grid } from "@mui/material";

import { RootState } from "../store/store";
import { useMetric, useStations } from "../models/model";

import EntitySelector from "../components/EntitySelector";
import Filters from "../components/Filters";
import TableView from "../components/TableView";
import Chart from "../components/Chart";
import Map from "../components/Map";

export default function Dashboard() {
  const selectedEntity = useSelector(
    (state: RootState) => state.app.selectedEntity
  );
  const selectedMetric = useSelector(
    (state: RootState) => state.app.selectedMetric
  );
  const selectedTimeStep = useSelector(
    (state: RootState) => state.app.selectedTimeStep
  );
  const [measurementData, setMeasurementData] = useState<any[] | undefined>();
  const [stationsData, setStationsData] = useState<any[] | undefined>();
  const [resultFields, setResultFields] = useState<Field<any>[] | undefined>(
    []
  );
  // const { data: arrowTable, status, error } = useDefaultBasinMetric();
  const { data: arrowTable, status: statusMetrics } = useMetric(
    selectedEntity,
    selectedMetric.table,
    selectedMetric.column,
    selectedMetric.aggregation,
    selectedTimeStep
  );

  const { data: stationsResult, status: statusStations } = useStations(selectedEntity);

  useEffect(() => {
    setResultFields([]);
    setStationsData([]);
  }, [selectedEntity, selectedMetric, selectedTimeStep]);

  // console.log("Status: " + statusMetrics);
  if (statusMetrics == "success" && resultFields?.length == 0) {
    setResultFields(arrowTable?.schema.fields);
    setMeasurementData(arrowTable?.toArray());
  }

  if (statusStations == "success" && stationsData?.length == 0) {
    setStationsData(stationsResult?.toArray());
  }

  return (
    <Grid container>
      <Grid item xs={3}>
        <EntitySelector />
      </Grid>
      <Grid item xs={9}>
        <Box
          maxWidth="xs"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <Filters />
          {measurementData && (
            <Chart
              data={measurementData!}
              xAxisColumn={selectedTimeStep}
              yAxisColumn={selectedMetric.column}
            />
          )}
          {stationsData && (
            <Map stations={stationsData!} />
          )}
          {measurementData && (
            <TableView data={measurementData!} resultFields={resultFields!} />
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
