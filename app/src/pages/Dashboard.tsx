import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { executeQuery } from "../db/duckdb";
import EntitySelector from "../components/EntitySelector";

export default function Dashboard() {
  const [data, setData] = useState<any[] | undefined>([]);
  const [query, setQuery] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (query !== null) {
        const arrowTable = await executeQuery(query);
        console.log("Rows: " + arrowTable?.numRows);
        setData(arrowTable?.toArray());
      }
    };

    fetchData();
  }, [query]);

  useEffect(() => {
    // Initializing the dashboard with this query downloads
    // 276 MB, including downloading twice the DuckDB-wasm
    // bundle, and takes 42 seconds.
    // Reloading the page, even with no-cache, downloads
    // everything again and takes the same.
    // Possible things to try:
    // - Download the wasm bundle only once
    // - Remove the single measurements table
    // - Have 2 different databases: one with original data
    //   and another with daily averages
    // - See if query results can be cached
    // - Cache some columns (i.e. station name), to read
    //   as few columns as possible

    // After changing the useEffect for fetching data to
    // depend on the query, it seems the wasm bundle is
    // downloaded only once.
    // I have also reverted to the database version without
    // the single measurements table.
    // Now it downloads 84 MB in 17 seconds.

    setQuery(`
      SELECT st.id as station_id,
             st.name as station_name,
             AVG(mr.level_masl) AS level_masl,
             AVG(mr.volume_hm3) AS volume_hm3,
             extract('year' FROM hour) AS year
        FROM stations st     
           INNER JOIN measurements_reservoir mr
           ON st.id = mr.station_id
           GROUP BY st.id, st.name, year
           ORDER BY st.id, year
    `);
  }, []);

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
            {data &&
              data.map((row, index) => (
                <Grid container p={1} key={index}>
                  <Grid item xs={2}>
                    <Typography variant="caption">{row.station_id}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">
                      {row.station_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="caption">
                      {String(row.year)}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="caption">
                      {row.volume_hm3.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
