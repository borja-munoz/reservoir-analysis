import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import EntitySelector from "../components/EntitySelector";
import { useSelector } from "react-redux";
import { Field } from "apache-arrow";

import { RootState } from "../store/store";
import { useMetric } from "../models/model";
import MetricSelector from "../components/MetricSelector";

export default function Dashboard() {
  const selectedEntity = useSelector(
    (state: RootState) => state.app.selectedEntity
  );
  const selectedMetric = useSelector(
    (state: RootState) => state.app.selectedMetric
  );
  const [data, setData] = useState<any[] | undefined>();
  const [resultFields, setResultFields] = useState<Field<any>[] | undefined>(
    []
  );
  const [timeStep, setTimeStep] = useState("year");
  // const { data: arrowTable, status, error } = useDefaultBasinMetric();
  const { data: arrowTable, status } = useMetric(
    selectedEntity,
    selectedMetric.table,
    selectedMetric.column,
    selectedMetric.aggregation,
    timeStep
  );

  useEffect(() => {
    setResultFields([]);
  }, [selectedEntity, selectedMetric]);

  const handleTimeStepChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeStep: string
  ) => {
    setTimeStep(newTimeStep);
    setResultFields([]);
  };

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
          <Grid container sx={{ marginBottom: "20px" }}>
            <Grid item xs={6}>
              <MetricSelector />
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" justifyContent="end">
                <ToggleButtonGroup
                  color="primary"
                  value={timeStep}
                  exclusive
                  onChange={handleTimeStepChange}
                  aria-label="Time Step"
                >
                  <ToggleButton value="year">
                    <FormattedMessage id="yearly" />
                  </ToggleButton>
                  <ToggleButton value="month">
                    <FormattedMessage id="monthly" />
                  </ToggleButton>
                  <ToggleButton value="day">
                    <FormattedMessage id="daily" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Grid>
          </Grid>
          <Grid container>
            <Grid container p={1}>
              {resultFields &&
                resultFields.map((field, index) => (
                  <Grid item xs={3} key={"field" + index}>
                    <Typography variant="body1" color="primary">
                      <FormattedMessage id={field.name} />
                    </Typography>
                  </Grid>
                ))}
            </Grid>
            {data &&
              data.map((row, indexRow) => (
                <Grid container p={1} key={"row" + indexRow}>
                  {resultFields &&
                    resultFields.map((field, indexField) => (
                      <Grid item xs={3} key={"row" + indexRow + indexField}>
                        <Typography variant="caption">
                          {field.type.typeId == 2 // int
                            ? String(row[field.name])
                            : field.type.typeId == 3 // float
                            ? row[field.name].toFixed(2)
                            : row[field.name]}
                        </Typography>
                      </Grid>
                    ))}
                </Grid>
              ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
