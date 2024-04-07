import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { executeQuery, loadDB } from "../db/duckdb";
import EntitySelector from "../components/EntitySelector";
import { useDispatch, useSelector } from "react-redux";
import { Field } from "apache-arrow";

import { RootState } from "../store/store";
import { setDBInitialized } from "../store/appSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const dbInitialized = useSelector(
    (state: RootState) => state.app.dbInitialized
  );
  const selectedEntity = useSelector(
    (state: RootState) => state.app.selectedEntity
  );
  const [data, setData] = useState<any[] | undefined>([]);
  const [query, setQuery] = useState<string | null>(null);
  const [resultFields, setResultFields] = useState<Field<any>[] | undefined>(
    []
  );

  useEffect(() => {
    const initializeDB = async () => {
      await loadDB();
      dispatch(setDBInitialized(true));
    };

    if (!dbInitialized) {
      initializeDB();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (query !== null) {
        const arrowTable = await executeQuery(query);
        // console.log("Rows: " + arrowTable?.numRows);
        setResultFields(arrowTable?.schema.fields);
        setData(arrowTable?.toArray());
      }
    };

    if (dbInitialized) {
      fetchData();
    }
  }, [dbInitialized, query]);

  useEffect(() => {
    setQuery(`
      SELECT 1 as station_id, 'station' as station_name, year, volume_hm3
      FROM basin_reservoir_yearly_average
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
          {selectedEntity && (
            <Typography variant="body1">
              Selected entity:{" "}
              {selectedEntity.type +
                "-" +
                selectedEntity.id +
                "-" +
                selectedEntity.idBasin}
            </Typography>
          )}
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
