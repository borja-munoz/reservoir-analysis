import { Grid, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Field } from "apache-arrow";

interface TableViewProps {
  data: any[];
  resultFields: Field<any>[];
}

export default function TableView({ data, resultFields }: TableViewProps) {
  return (
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
  );
}
