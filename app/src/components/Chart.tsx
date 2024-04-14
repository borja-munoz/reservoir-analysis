import { Grid } from "@mui/material";
import ReactECharts, { ReactEChartsProps } from "./ReactECharts";

export interface ChartProps {
  data: any[];
  xAxisColumn: string;
  yAxisColumn: string;
}

export default function Chart({ data, xAxisColumn, yAxisColumn }: ChartProps) {
  const option: ReactEChartsProps["option"] = {
    xAxis: {
      type: "category",
      data: data.map((row) => row[xAxisColumn]),
    },
    yAxis: {
      type: "value",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    series: [
      {
        data: data.map((row) => row[yAxisColumn]),
        type: "line",
      },
    ],
    // tooltip: {
    //   trigger: "axis",
    //   axisPointer: {
    //     type: "shadow",
    //   },
    // },
    // legend: {
    //   data: ["Owned", "Financed"],
    // },
    // grid: {
    //   left: "10%",
    //   right: "0%",
    //   top: "20%",
    //   bottom: "20%",
    // },
    // xAxis: {
    //   type: "value",
    // },
    // yAxis: {
    //   type: "category",
    // },
    // series: [
    //   {
    //     type: "bar",
    //     stack: "total",
    //     label: {
    //       show: true,
    //     },
    //   },
    //   {
    //     type: "bar",
    //     stack: "total",
    //     label: {
    //       show: true,
    //     },
    //   },
    // ],
  };

  return (
    <Grid container mb={2} mr={2}>
      <Grid item xs={12}>
        <ReactECharts option={option} style={{ height: "300px" }} />
      </Grid>
    </Grid>
  );
}
