import { ReactElement, useState } from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";

import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { setSelectedMetric } from "../store/appSlice";

export type Metric = {
  id: string;
  table: string;
  column: string;
  unit: string;
  aggregation: string;
};

const metricGroups = [
  {
    group: "reservoir",
    metrics: [
      {
        id: "res_volume",
        table: "measurements_reservoir",
        column: "volume_hm3",
        unit: "hm3",
        aggregation: "SUM",
      },
      {
        id: "res_masl",
        table: "measurements_reservoir",
        column: "level_masl",
        unit: "m",
        aggregation: "AVG",
      },
    ],
  },
  {
    group: "river",
    metrics: [
      {
        id: "river_level",
        table: "measurements_river",
        column: "level_m",
        unit: "m",
        aggregation: "AVG",
      },
    ],
  },
  {
    group: "meteo",
    metrics: [
      {
        id: "meteo_temperature",
        table: "measurements_temperature",
        column: "temperature_degc",
        unit: "degrees",
        aggregation: "AVG",
      },
      {
        id: "meteo_atm_pressure",
        table: "measurements_atmospheric_pressure",
        column: "atmospheric_pressure_mb",
        unit: "mb",
        aggregation: "AVG",
      },
      {
        id: "meteo_rel_humidity",
        table: "measurements_relative_humidity",
        column: "relative_humidity_pct",
        unit: "%",
        aggregation: "AVG",
      },
      {
        id: "meteo_wind_speed",
        table: "measurements_wind_speed",
        column: "wind_speed_kmh",
        unit: "kmh",
        aggregation: "AVG",
      },
      {
        id: "meteo_wind_direction",
        table: "measurements_wind_direction",
        column: "wind_direction_deg",
        unit: "degrees",
        aggregation: "AVG",
      },
      {
        id: "meteo_solar_radiation",
        table: "measurements_solar_radiation",
        column: "solar_radiation_wm2",
        unit: "wm2",
        aggregation: "SUM",
      },
    ],
  },
  {
    group: "pluviometry",
    metrics: [
      {
        id: "pluviometry_acc_rain",
        table: "measurements_pluviometer",
        column: "accumulated_rain_lm2",
        unit: "lm2",
        aggregation: "SUM",
      },
    ],
  },
  {
    group: "snow",
    metrics: [
      {
        id: "snow_accumulated_snowfall",
        table: "measurements_snowmeter",
        column: "accumulated_snowfall_lm2",
        unit: "lm2",
        aggregation: "SUM",
      },
    ],
  },
  {
    group: "evaporation",
    metrics: [
      {
        id: "evaporation_tank_level",
        table: "measurements_evaporation_tank",
        column: "level_mm",
        unit: "mm",
        aggregation: "AVG",
      },
    ],
  },
];

export function getMetric(id: string) : Metric | undefined {
  for (let group of metricGroups) {
    const metricFound = group.metrics.find((metric) => metric.id === id);
    if (metricFound) {
      return {
        id,
        table: metricFound.table,
        column: metricFound.column,
        unit: metricFound.unit,
        aggregation: metricFound.aggregation,
      };
    }
  };
};

export default function MetricSelector() {
  const dispatch = useDispatch();
  const [metric, setMetric] = useState("res_volume");
  let items: ReactElement[] = [];

  const handleChange = (event: SelectChangeEvent) => {
    setMetric(event.target.value as string);
    const metric = getMetric(event.target.value as string);
    dispatch(setSelectedMetric(metric!));
  };
  
  const buildItems = () => {
    metricGroups.forEach((group) => {
      items.push(
        <ListSubheader key={group.group} >
          <FormattedMessage id={group.group} />
        </ListSubheader>
      );
      group.metrics.map((metric) =>
        items.push(
          <MenuItem value={metric.id} key={metric.id}>
            <FormattedMessage id={metric.id} />
          </MenuItem>
        )
      );
    });
  };

  if (items.length == 0) {
    buildItems();
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel htmlFor="grouped-select">
        <FormattedMessage id="metric" />
      </InputLabel>
      <Select
        value={metric}
        id="grouped-select"
        label="Grouping"
        onChange={handleChange}
      >
        {items}
      </Select>
    </FormControl>
  );
}
