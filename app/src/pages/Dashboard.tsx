import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Field } from "apache-arrow";

import { Box, Grid } from "@mui/material";

import { RootState } from "../store/store";
import { useMetric } from "../models/model";

import EntitySelector from "../components/EntitySelector";
import Filters from "../components/Filters";
import TableView from "../components/TableView";

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
  const [data, setData] = useState<any[] | undefined>();
  const [resultFields, setResultFields] = useState<Field<any>[] | undefined>(
    []
  );
  // const { data: arrowTable, status, error } = useDefaultBasinMetric();
  const { data: arrowTable, status } = useMetric(
    selectedEntity,
    selectedMetric.table,
    selectedMetric.column,
    selectedMetric.aggregation,
    selectedTimeStep
  );

  useEffect(() => {
    setResultFields([]);
  }, [selectedEntity, selectedMetric, selectedTimeStep]);

  console.log("Status: " + status);
  if (status == "success" && resultFields?.length == 0) {
    setResultFields(arrowTable?.schema.fields);
    setData(arrowTable?.toArray());
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
          <TableView data={data!} resultFields={resultFields!} />
        </Box>
      </Grid>
    </Grid>
  );
}
