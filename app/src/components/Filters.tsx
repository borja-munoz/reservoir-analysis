import { useState } from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";

import { Grid, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";

import MetricSelector from "./MetricSelector";
import { setSelectedTimeStep } from "../store/appSlice";

export default function Filters() {
  const dispatch = useDispatch();
  const [timeStep, setTimeStep] = useState("year");

  const handleTimeStepChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTimeStep: string
  ) => {
    setTimeStep(newTimeStep);
    dispatch(setSelectedTimeStep(newTimeStep));
  };
  
  return (
    <Grid container ml={2}>
      <Grid item xs={6}>
        <MetricSelector />
      </Grid>
      <Grid item xs={6}>
        <Stack direction="row" justifyContent="end" sx={{ marginTop: '10px' }}>
          <ToggleButtonGroup
            color="primary"
            value={timeStep}
            exclusive
            onChange={handleTimeStepChange}
            aria-label="Time Step"
            size="small"
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
  );
}
