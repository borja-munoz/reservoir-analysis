import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { executeQuery } from "../db/duckdb";

export default function Dashboard() {
  const [data, setData] = useState<any[]|undefined>([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        SELECT station_id, 
               station_name, 
               AVG(CAST(REPLACE(res_volume_hm3, ',', '.') AS FLOAT4)) AS res_volume_hm3,
               extract('year' FROM hour) AS year
        FROM measurements
        WHERE res_volume_hm3 IS NOT NULL
        GROUP BY station_id, station_name, year
        ORDER BY station_id, year
      `;

      const arrowTable = await executeQuery(query);

      console.log("Rows: " + arrowTable?.numRows);

      setData(arrowTable?.toArray());
    };

    fetchData();
  }, []);

  return(
    <Box maxWidth="xs" 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px'
      }}
    >
      <Grid container>
        <Grid container p={1}>
          <Grid item xs={2}>
            <Typography variant="body1" color="primary">
              <FormattedMessage id="station_id" />
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" color="primary">
              <FormattedMessage id="station_name" />
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" color="primary">
              <FormattedMessage id="volume" />
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" color="primary">
              <FormattedMessage id="year" />
            </Typography>
          </Grid>
        </Grid>
        {data && (
          data.map((row, index) => 
            <Grid container p={1} key={index}>
              <Grid item xs={2}>
                <Typography variant="caption">{row.station_id}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">{row.station_name}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="caption">{String(row.year)}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="caption">{row.res_volume_hm3.toFixed(2)}</Typography>
              </Grid>
            </Grid>
          )
        )}        
      </Grid>
    </Box>
  );
}